export interface DataPoint {
  year: number;
  close: number;
  return_pct: number | null;
  count: number;
  publication_growth_rate?: number | null;
}

export const sp500_publications_data: DataPoint[] = [
  {
    "year": 1999,
    "close": 93.2522,
    "return_pct": null,
    "count": 5021324
  },
  {
    "year": 2000,
    "close": 84.1795,
    "return_pct": -9.72920746105722,
    "count": 5824125
  },
  {
    "year": 2001,
    "close": 74.2863,
    "return_pct": -11.752505063584373,
    "count": 6142881
  },
  {
    "year": 2002,
    "close": 58.2496,
    "return_pct": -21.58769517394189,
    "count": 7530266
  },
  {
    "year": 2003,
    "close": 74.6623,
    "return_pct": 28.176502499587983,
    "count": 7774597
  },
  {
    "year": 2004,
    "close": 82.6532,
    "return_pct": 10.702724132527395,
    "count": 8406259
  },
  {
    "year": 2005,
    "close": 86.6419,
    "return_pct": 4.825826465279026,
    "count": 9170366
  },
  {
    "year": 2006,
    "close": 100.3731,
    "return_pct": 15.84822124168559,
    "count": 10079186
  },
  {
    "year": 2007,
    "close": 105.5279,
    "return_pct": 5.135638931147901,
    "count": 10859062
  },
  {
    "year": 2008,
    "close": 66.6863,
    "return_pct": -36.806948683713024,
    "count": 11656368
  },
  {
    "year": 2009,
    "close": 84.2689,
    "return_pct": 26.366135173191484,
    "count": 12653179
  },
  {
    "year": 2010,
    "close": 96.9578,
    "return_pct": 15.057630988419213,
    "count": 13619505
  },
  {
    "year": 2011,
    "close": 98.7883,
    "return_pct": 1.8879347509947573,
    "count": 14686972
  },
  {
    "year": 2012,
    "close": 114.5862,
    "return_pct": 15.99167107845767,
    "count": 15263767
  },
  {
    "year": 2013,
    "close": 151.6052,
    "return_pct": 32.3066826546303,
    "count": 16021926
  },
  {
    "year": 2014,
    "close": 172.0145,
    "return_pct": 13.462137182629627,
    "count": 16622707
  },
  {
    "year": 2015,
    "close": 174.1686,
    "return_pct": 1.252278150969821,
    "count": 16975539
  },
  {
    "year": 2016,
    "close": 195.0711,
    "return_pct": 12.001302186502038,
    "count": 17227260
  },
  {
    "year": 2017,
    "close": 237.4022,
    "return_pct": 21.700344130934823,
    "count": 17143684
  },
  {
    "year": 2018,
    "close": 226.5836,
    "return_pct": -4.557076556156603,
    "count": 17744508
  },
  {
    "year": 2019,
    "close": 297.3269,
    "return_pct": 31.221721254318503,
    "count": 18437708
  },
  {
    "year": 2020,
    "close": 351.9554,
    "return_pct": 18.373211438319224,
    "count": 19878581
  },
  {
    "year": 2021,
    "close": 453.1223,
    "return_pct": 28.74423861659745,
    "count": 18689135
  },
  {
    "year": 2022,
    "close": 370.7823,
    "return_pct": -18.17169448513128,
    "count": 17777164
  },
  {
    "year": 2023,
    "close": 467.8885,
    "return_pct": 26.18954572534881,
    "count": 19011627
  },
  {
    "year": 2024,
    "close": 584.3233,
    "return_pct": 24.885159605333328,
    "count": 16810895
  }
]

// Calculate publication growth rate
export const processedData = sp500_publications_data.map((current, index, array) => {
  if (index === 0) {
    return { ...current, publication_growth_rate: null };
  }
  
  const previous = array[index - 1];
  const growthRate = ((current.count - previous.count) / previous.count) * 100;
  
  return {
    ...current,
    publication_growth_rate: parseFloat(growthRate.toFixed(2))
  };
});
