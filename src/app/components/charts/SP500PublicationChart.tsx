'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { processedData, DataPoint } from '../../data/sp500_publications';

interface ChartDimensions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
}

interface LaggedDataPoint extends DataPoint {
  lagged_return_pct?: number | null;
  lagged_publication_growth_rate?: number | null;
}

export default function SP500PublicationChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 900,
    height: 500,
    margin: { top: 50, right: 180, bottom: 80, left: 80 }
  });
  const [lag, setLag] = useState<number>(0);
  const [comparisonMode, setComparisonMode] = useState<'normal' | 'lagged'>('normal');
  const [correlationValue, setCorrelationValue] = useState<number>(0);

  // Filter out the first year since it doesn't have return_pct or growth rate
  const baseChartData = processedData.filter(d => d.return_pct !== null && d.publication_growth_rate !== null);
  
  // Apply lag to the data
  const applyLag = (data: DataPoint[], lagYears: number): LaggedDataPoint[] => {
    if (lagYears === 0) {
      return data.map(d => ({
        ...d,
        lagged_return_pct: d.return_pct,
        lagged_publication_growth_rate: d.publication_growth_rate
      }));
    }
    
    return data.map((current, index) => {
      // Find the lagged data point (if it exists)
      const laggedIndex = index - lagYears;
      const laggedPoint = laggedIndex >= 0 && laggedIndex < data.length ? data[laggedIndex] : null;
      
      return {
        ...current,
        // If we're lagging S&P 500, use lagged S&P 500 data with current publication data
        lagged_return_pct: laggedPoint?.return_pct ?? null,
        // If we're lagging publications, use lagged publication data with current S&P 500 data
        lagged_publication_growth_rate: laggedPoint?.publication_growth_rate ?? null
      };
    });
  };
  
  const chartData = applyLag(baseChartData, lag);
  
  // Function to calculate Pearson correlation coefficient with lag
  const calculateCorrelation = useCallback((data: LaggedDataPoint[]) => {
    // Filter out data points where either value is null after applying lag
    const filteredData = data.filter(d => {
      if (comparisonMode === 'normal') {
        return d.return_pct !== null && d.publication_growth_rate !== null;
      } else {
        return d.return_pct !== null && d.lagged_publication_growth_rate !== null;
      }
    });
    
    const n = filteredData.length;
    if (n < 3) return 0; // Not enough data for meaningful correlation
    
    const xValues = filteredData.map(d => d.return_pct as number);
    const yValues = comparisonMode === 'normal' 
      ? filteredData.map(d => d.publication_growth_rate as number)
      : filteredData.map(d => d.lagged_publication_growth_rate as number);

    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let xDenominator = 0;
    let yDenominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      numerator += xDiff * yDiff;
      xDenominator += xDiff * xDiff;
      yDenominator += yDiff * yDiff;
    }

    return numerator / Math.sqrt(xDenominator * yDenominator);
  }, [comparisonMode]);
  
  // Calculate correlation when lag or comparison mode changes
  useEffect(() => {
    const correlation = calculateCorrelation(chartData);
    setCorrelationValue(correlation);
  }, [lag, comparisonMode, chartData, calculateCorrelation]);
  


  useEffect(() => {
    const handleResize = () => {
      const containerWidth = Math.min(window.innerWidth - 40, 1000);
      setDimensions({
        width: containerWidth,
        height: containerWidth * 0.6,
        margin: { top: 50, right: 180, bottom: 80, left: 80 }
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a function to draw the chart
  // Note: We're using useCallback to ensure the function doesn't change on every render
  const drawChart = useCallback(() => {
    // Type safety check
    if (!svgRef.current || chartData.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height, margin } = dimensions;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Filter out data points where either value is null
    const validData = chartData.filter(d => {
      const pubGrowth = comparisonMode === 'normal' ? d.publication_growth_rate : d.lagged_publication_growth_rate;
      return d.return_pct !== null && pubGrowth !== null && pubGrowth !== undefined;
    });
    
    if (validData.length === 0) return;
    
    // For scatter plot: x-axis is publication growth rate, y-axis is S&P 500 returns
    const xScale = d3.scaleLinear()
      .domain([
        d3.min(validData, d => comparisonMode === 'normal' ? 
          d.publication_growth_rate as number : d.lagged_publication_growth_rate as number) || -20,
        d3.max(validData, d => comparisonMode === 'normal' ? 
          d.publication_growth_rate as number : d.lagged_publication_growth_rate as number) || 40
      ])
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(validData, d => d.return_pct as number) || -40,
        d3.max(validData, d => d.return_pct as number) || 40
      ])
      .range([innerHeight, 0])
      .nice();

    // Create a group for the chart content
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => `${d}%`)
      .tickSizeOuter(0);

    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d => `${d}%`)
      .tickSizeOuter(0);

    // Add x-axis with improved visibility
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('stroke-width', 1.5)
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#333');

    // Add y-axis with improved visibility
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .attr('stroke-width', 1.5)
      .selectAll('text')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .attr('fill', '#333');

    // Add grid lines for better readability
    g.selectAll('grid-line-y')
      .data(yScale.ticks())
      .enter()
      .append('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#d4d4d4')
      .attr('stroke-width', 0.7);
      
    // Add a border around the chart area for better visibility
    g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 1.5);

    g.selectAll('grid-line-x')
      .data(xScale.ticks())
      .enter()
      .append('line')
      .attr('class', 'grid-line-x')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#d4d4d4')
      .attr('stroke-width', 0.7);

    // Add zero line with improved visibility
    g.append('line')
      .attr('class', 'zero-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0))
      .attr('y2', yScale(0))
      .attr('stroke', '#555')
      .attr('stroke-dasharray', '4')
      .attr('stroke-width', 1.5);

    // Add scatter plot points
    g.selectAll('.scatter-point')
      .data(validData)
      .enter()
      .append('circle')
      .attr('class', 'scatter-point')
      .attr('cx', d => {
        const value = comparisonMode === 'normal' 
          ? d.publication_growth_rate 
          : d.lagged_publication_growth_rate;
        return xScale(value as number);
      })
      .attr('cy', d => yScale(d.return_pct as number))
      .attr('r', 6)
      .attr('fill', '#4682b4')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.7)
      .on('mouseover', function() {
        d3.select(this)
          .attr('r', 8)
          .attr('stroke-width', 2)
          .attr('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', 6)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.7);
      });
      
    // Add a regression line
    if (validData.length > 2) {
      const x = validData.map(d => comparisonMode === 'normal' 
        ? d.publication_growth_rate as number 
        : d.lagged_publication_growth_rate as number);
      const y = validData.map(d => d.return_pct as number);
      
      // Simple linear regression
      const n = x.length;
      const xMean = x.reduce((a, b) => a + b, 0) / n;
      const yMean = y.reduce((a, b) => a + b, 0) / n;
      
      let numerator = 0;
      let denominator = 0;
      
      for (let i = 0; i < n; i++) {
        numerator += (x[i] - xMean) * (y[i] - yMean);
        denominator += (x[i] - xMean) * (x[i] - xMean);
      }
      
      const slope = denominator !== 0 ? numerator / denominator : 0;
      const intercept = yMean - slope * xMean;
      
      // Create the regression line function
      const regressionLine = d3.line<{x: number, y: number}>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
      
      // Get min and max x values for the line
      const xMin = d3.min(x) || 0;
      const xMax = d3.max(x) || 0;
      
      // Calculate y values for the line
      const regressionPoints = [
        {x: xMin, y: slope * xMin + intercept},
        {x: xMax, y: slope * xMax + intercept}
      ];
      
      // Add the regression line with color based on correlation value
      g.append('path')
        .datum(regressionPoints)
        .attr('fill', 'none')
        .attr('stroke', correlationValue < 0 ? '#dc2626' : '#16a34a') // Red for negative, green for positive
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5')
        .attr('d', regressionLine);
    }

    // Add event handlers for scatter points
    g.selectAll('.scatter-point')
      .each(function(d: any) {
        // Using any here to avoid TypeScript errors with d3's typing
        const point = d3.select(this);
        point.on('mouseover', function(event: any) {
          const pubGrowthValue = comparisonMode === 'normal' 
            ? d.publication_growth_rate 
            : d.lagged_publication_growth_rate;
          
          d3.select(this)
            .attr('r', 8)
            .attr('stroke-width', 2)
            .attr('opacity', 1);
          
          const tooltip = d3.select(tooltipRef.current);
          tooltip.style('display', 'block')
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 28}px`)
            .html(`
              <div class="font-bold">Year: ${d.year}</div>
              <div>Publication Growth: ${pubGrowthValue?.toFixed(2)}%</div>
              <div>S&P 500 Return: ${d.return_pct?.toFixed(2)}%</div>
              <div>Publication Count: ${d.count.toLocaleString()}</div>
            `);
        });
        
        point.on('mouseout', function() {
          d3.select(this)
            .attr('r', 6)
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.7);
          
          d3.select(tooltipRef.current).style('display', 'none');
        });
      });


    // Add chart title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text(`Publication Growth Rate vs S&P 500 Returns ${comparisonMode === 'lagged' ? `(${lag} Year Lag)` : ''} (${chartData[0].year}-${chartData[chartData.length - 1].year})`);

    // Add x-axis label with improved visibility
    g.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('Publication Growth Rate (%)');

    // Add y-axis label with improved visibility
    g.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -50)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#333')
      .text('S&P 500 Return (%)');

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right + 30}, ${margin.top})`);

    // Legend title
    legend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-weight', 'bold')
      .text('Metrics');

    // Legend items
    const metrics = [
      { name: 'Data Points', color: '#4682b4' },
      { name: 'Regression Line', color: correlationValue < 0 ? '#dc2626' : '#16a34a' } // Red for negative, green for positive
    ];

    metrics.forEach((metric, i) => {
      const legendItem = legend.append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(0, ${i * 25})`)
        .style('cursor', 'default');

      legendItem.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', metric.color)
        .attr('stroke', 'none')
        .attr('stroke-width', 2);

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(metric.name)
        .style('font-weight', 'normal');
    });

    // Add correlation info with color based on value
    svg.append('text')
      .attr('class', 'correlation-info')
      .attr('x', width - margin.right + 30)
      .attr('y', margin.top + 70)
      .style('font-size', '12px')
      .style('fill', correlationValue < 0 ? '#dc2626' : '#16a34a') // Red for negative, green for positive
      .text(`Correlation: ${correlationValue.toFixed(2)}`);

  }, [dimensions, lag, comparisonMode, correlationValue, chartData]);
  
  // Draw chart whenever any of the dependencies change
  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div className="relative w-full max-w-[1000px] mx-auto bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="w-full mb-6 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-5">
            {/* Comparison Mode - Left */}
            <div className="flex flex-col w-full md:w-auto gap-2">
              <span className="font-semibold text-gray-800">Comparison Mode</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setComparisonMode('normal')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    comparisonMode === 'normal' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setComparisonMode('lagged')}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    comparisonMode === 'lagged' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Lagged
                </button>
              </div>
            </div>
            
            {/* Correlation - Middle */}
            <div className="flex flex-col w-full md:w-auto gap-2 items-center">
              <span className="font-semibold text-gray-800">Correlation</span>
              <div className="text-lg font-mono bg-white px-4 py-2 rounded-md border shadow-sm font-medium"
                   style={{ color: correlationValue < 0 ? '#dc2626' : '#16a34a' }}>
                {correlationValue.toFixed(4)}
              </div>
            </div>
            
            {/* Lag Slider - Right, only visible when in lagged mode */}
            {comparisonMode === 'lagged' && (
              <div className="flex flex-col w-full md:w-auto gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Lag (Years)</span>
                  <span className="text-sm font-mono bg-white px-3 py-1.5 rounded-md border shadow-sm text-gray-800 font-medium">{lag}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={lag}
                  onChange={(e) => setLag(parseInt(e.target.value))}
                  className="w-full md:w-60 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-600 px-0.5">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-700 bg-white p-3 rounded-md border border-gray-100">
            Comparing S&P 500 returns with publication growth rates from {comparisonMode === 'lagged' ? `${lag} year${lag > 1 ? 's' : ''} earlier` : 'in the same year'}.
          </div>
        </div>
        
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible"
        />
        <div
          ref={tooltipRef}
          className="absolute hidden bg-white p-2 rounded shadow-lg border border-gray-200 text-sm z-10"
        />
        
        <div className="mt-8 text-sm text-gray-700 max-w-2xl mx-auto bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
          <p className="mb-3 text-base font-semibold text-gray-800">Instructions</p>
          <ul className="list-disc pl-5 mb-4 space-y-1.5">
            <li>Use the <span className="font-medium text-gray-900">Lag</span> slider to adjust the time offset between S&P 500 returns and publication growth rates</li>
            <li>Switch between <span className="font-medium text-gray-900">Normal</span> and <span className="font-medium text-gray-900">Lagged</span> comparison modes to see different relationships</li>
            <li>Hover over data points to see detailed information for specific years</li>
          </ul>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="font-medium text-gray-900">Analysis Tip:</p>
            <p>A correlation coefficient closer to 1 indicates a stronger positive relationship, while a value closer to -1 indicates a stronger negative relationship. Values near 0 suggest little to no correlation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
