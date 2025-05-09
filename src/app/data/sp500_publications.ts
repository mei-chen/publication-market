export interface DataPoint {
  year: number;
  close: number;
  return_pct: number | null;
  count: number;
  publication_growth_rate?: number | null;
}

export const sp500_publications_data: DataPoint[] = [
  { year: 1999, close: 93.2522, return_pct: null, count: 1000175 },
  { year: 2000, close: 84.1795, return_pct: -9.72920746105722, count: 1170111 },
  { year: 2001, close: 74.2863, return_pct: -11.752505063584373, count: 1259101 },
  { year: 2002, close: 58.2496, return_pct: -21.58769517394189, count: 1647866 },
  { year: 2003, close: 74.6623, return_pct: 28.176502499587983, count: 1653651 },
  { year: 2004, close: 82.6532, return_pct: 10.702724132527395, count: 1813897 },
  { year: 2005, close: 86.6419, return_pct: 4.825826465279026, count: 1953796 },
  { year: 2006, close: 100.3731, return_pct: 15.84822124168559, count: 2118798 },
  { year: 2007, close: 105.5279, return_pct: 5.135638931147901, count: 2268421 },
  { year: 2008, close: 66.6863, return_pct: -36.806948683713024, count: 2427888 },
  { year: 2009, close: 84.2689, return_pct: 26.366135173191484, count: 2641592 },
  { year: 2010, close: 96.9578, return_pct: 15.057630988419213, count: 2818802 },
  { year: 2011, close: 98.7883, return_pct: 1.8879347509947573, count: 3079719 },
  { year: 2012, close: 114.5862, return_pct: 15.99167107845767, count: 3131957 },
  { year: 2013, close: 151.6052, return_pct: 32.3066826546303, count: 3252099 },
  { year: 2014, close: 172.0145, return_pct: 13.462137182629627, count: 3419169 },
  { year: 2015, close: 174.1686, return_pct: 1.252278150969821, count: 3534979 },
  { year: 2016, close: 195.0711, return_pct: 12.001302186502038, count: 3545345 },
  { year: 2017, close: 237.4022, return_pct: 21.700344130934823, count: 3341721 },
  { year: 2018, close: 226.5836, return_pct: -4.557076556156603, count: 3396676 },
  { year: 2019, close: 297.3269, return_pct: 31.221721254318503, count: 3561111 },
  { year: 2020, close: 351.9554, return_pct: 18.373211438319224, count: 3926322 },
  { year: 2021, close: 453.1223, return_pct: 28.74423861659745, count: 3452339 },
  { year: 2022, close: 370.7823, return_pct: -18.171694485131276, count: 3639364 },
  { year: 2023, close: 467.8885, return_pct: 26.189545725348815, count: 3637095 },
  { year: 2024, close: 584.3233, return_pct: 24.885159605333328, count: 3157504 }
];

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
