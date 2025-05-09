'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Back Button - positioned outside the container */}
      <Link href="/" className="absolute left-6 top-6 flex items-center group transition-all duration-300 hover:translate-x-[-5px] z-10">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="32" 
          height="12" 
          viewBox="0 0 32 12" 
          fill="none" 
          className="mr-2 transition-all duration-300 group-hover:translate-x-[-3px]"
        >
          <path 
            d="M0.469669 5.46967C0.176777 5.76256 0.176777 6.23744 0.469669 6.53033L5.24264 11.3033C5.53553 11.5962 6.01041 11.5962 6.3033 11.3033C6.59619 11.0104 6.59619 10.5355 6.3033 10.2426L2.06066 6L6.3033 1.75736C6.59619 1.46447 6.59619 0.989593 6.3033 0.696699C6.01041 0.403806 5.53553 0.403806 5.24264 0.696699L0.469669 5.46967ZM32 5.25L1 5.25V6.75L32 6.75V5.25Z" 
            fill="#111827"
          />
        </svg>
        <span className="font-medium text-gray-800">Back</span>
      </Link>
      
      <div className="container mx-auto py-16 px-4 max-w-7xl">


        <h1 className="text-4xl font-bold mb-10 text-center text-gray-800 pt-10">
          S&P 500 and Publication Growth Rate Correlation
        </h1>
        
        {/* Key Findings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 border-b pb-3">Key Findings</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-lg font-medium text-gray-800 mb-2">Correlation Coefficient</p>
                <p className="text-3xl font-mono font-bold" style={{ color: correlation < 0 ? '#dc2626' : '#16a34a' }}>
                  {correlation.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Between {processedData[1].year} and {processedData[processedData.length-1].year}
                </p>
              </div>
            </div>
            
            <div className="flex-[2]">
              <p className="text-gray-700 mb-4 text-lg">
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
              <p className="text-gray-600">
                The strength of this relationship indicates how the S&P 500 performance relates to academic publication growth over the analyzed time period.
              </p>
            </div>
          </div>
        </div>
        
        {/* Data Summary Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-10">
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h2 className="text-2xl font-semibold text-gray-800">Data Summary</h2>
            <button 
              onClick={() => setShowTable(!showTable)}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
              aria-expanded={showTable}
            >
              {showTable ? 'Hide Raw Data' : 'Show Raw Data'}
            </button>
          </div>
          
          {showTable ? (
            <div className="overflow-x-auto mt-4 border rounded-lg">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 border-b font-semibold text-gray-700 text-left">Year</th>
                    <th className="py-3 px-4 border-b font-semibold text-gray-700 text-left">S&P 500 Close</th>
                    <th className="py-3 px-4 border-b font-semibold text-gray-700 text-left">S&P 500 Return (%)</th>
                    <th className="py-3 px-4 border-b font-semibold text-gray-700 text-left">Publication Count</th>
                    <th className="py-3 px-4 border-b font-semibold text-gray-700 text-left">Publication Growth (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {processedData.map((item, index) => (
                    <tr key={item.year} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-3 px-4 border-b text-gray-800 font-medium">{item.year}</td>
                      <td className="py-3 px-4 border-b text-gray-700">{item.close.toFixed(2)}</td>
                      <td className="py-3 px-4 border-b text-gray-700" style={{ color: (item.return_pct || 0) < 0 ? '#dc2626' : '#16a34a' }}>
                        {item.return_pct !== null ? item.return_pct.toFixed(2) : 'N/A'}
                      </td>
                      <td className="py-3 px-4 border-b text-gray-700">{item.count.toLocaleString()}</td>
                      <td className="py-3 px-4 border-b text-gray-700" style={{ color: (item.publication_growth_rate || 0) < 0 ? '#dc2626' : '#16a34a' }}>
                        {item.publication_growth_rate !== null ? item.publication_growth_rate.toFixed(2) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-600 text-center py-6">
              <p>Click the button above to view the raw data used in this analysis.</p>
            </div>
          )}
        </div>
        
        {/* Methodology Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800 border-b pb-3">Methodology</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Overview</h3>
              <p className="text-gray-700 mb-4">
                This visualization explores the relationship between the S&P 500 index performance and academic publication growth rates over time.
                We analyze how these two metrics correlate and what insights can be drawn from their relationship.
              </p>
              
              <h3 className="text-lg font-medium mb-3 text-gray-800">Correlation Analysis</h3>
              <p className="text-gray-700">
                The correlation coefficient is calculated using the Pearson correlation method, which measures the linear relationship between two variables.
                Values range from -1 (perfect negative correlation) to +1 (perfect positive correlation), with 0 indicating no correlation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">Data Sources</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span className="text-gray-700">
                      <strong>S&P 500 Data:</strong> Historical market data from financial markets, including yearly closing prices and calculated returns.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                    <span className="text-gray-700">
                      <strong>Publication Data:</strong> Academic publication counts from research databases, with calculated year-over-year growth rates.
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-md font-medium mb-2 text-gray-800">Note on Interpretation</h3>
                <p className="text-sm text-gray-600">
                  Correlation does not imply causation. The relationship observed between these variables may be influenced by other factors
                  not captured in this analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
