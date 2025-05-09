'use client';

import { useState } from 'react';
import SP500PublicationChart from '../components/charts/SP500PublicationChart';
import { processedData } from '../data/sp500_publications';

export default function CorrelationPage() {
  const [showTable, setShowTable] = useState(false);
  
  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    const data = processedData.filter(d => d.return_pct !== null && d.publication_growth_rate !== null);
    const n = data.length;
    const xValues = data.map(d => d.return_pct as number);
    const yValues = data.map(d => d.publication_growth_rate as number);

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
  };

  const correlation = calculateCorrelation();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">S&P 500 and Publication Growth Rate Correlation</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Key Findings</h2>
        <p className="mb-4">
          The correlation coefficient between S&P 500 returns and publication growth rates from {processedData[1].year} to {processedData[processedData.length-1].year} is <strong>{correlation.toFixed(4)}</strong>.
        </p>
        <p className="mb-4">
          {correlation > 0.7 ? 
            'This indicates a strong positive correlation, suggesting that S&P 500 performance and academic publication growth tend to move in the same direction.' :
            correlation > 0.3 ? 
              'This indicates a moderate positive correlation between S&P 500 performance and academic publication growth.' :
              correlation > 0 ? 
                'This indicates a weak positive correlation between S&P 500 performance and academic publication growth.' :
                correlation > -0.3 ? 
                  'This indicates a weak negative correlation between S&P 500 performance and academic publication growth.' :
                  correlation > -0.7 ? 
                    'This indicates a moderate negative correlation between S&P 500 performance and academic publication growth.' :
                    'This indicates a strong negative correlation, suggesting that S&P 500 performance and academic publication growth tend to move in opposite directions.'
          }
        </p>
      </div>
      
      <div className="mb-8">
        <SP500PublicationChart />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Data Summary</h2>
          <button 
            onClick={() => setShowTable(!showTable)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showTable ? 'Hide Data' : 'Show Data'}
          </button>
        </div>
        
        {showTable && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Year</th>
                  <th className="py-2 px-4 border-b text-left">S&P 500 Close</th>
                  <th className="py-2 px-4 border-b text-left">S&P 500 Return (%)</th>
                  <th className="py-2 px-4 border-b text-left">Publication Count</th>
                  <th className="py-2 px-4 border-b text-left">Publication Growth (%)</th>
                </tr>
              </thead>
              <tbody>
                {processedData.map((item, index) => (
                  <tr key={item.year} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">{item.year}</td>
                    <td className="py-2 px-4 border-b">{item.close.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{item.return_pct !== null ? item.return_pct.toFixed(2) : 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{item.count.toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{item.publication_growth_rate !== null ? item.publication_growth_rate.toFixed(2) : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Methodology</h2>
        <p className="mb-2">
          This visualization explores the relationship between the S&P 500 index performance and academic publication growth rates over time.
        </p>
        <p className="mb-2">
          <strong>Data Sources:</strong>
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>S&P 500 historical data from financial markets</li>
          <li>Publication counts from academic databases</li>
        </ul>
        <p>
          The correlation coefficient is calculated using the Pearson correlation method, which measures the linear relationship between two variables.
        </p>
      </div>
    </div>
  );
}
