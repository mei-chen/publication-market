# Publication Markets: Academic Research & Financial Markets Correlation Analysis

[PublicationMarket.com](https://publicationmarket.com)

## Description

Publication Markets is a data visualization application that explores the relationship between academic research publication rates and financial market performance. The application analyzes and displays correlations between S&P 500 index returns and the growth rate of academic publications over time, providing insights into how these two domains might influence each other.

## Motivation

The academic research ecosystem and financial markets are both complex systems that reflect broader economic and intellectual trends. This project was created to:

1. **Explore Hidden Relationships**: Investigate potential correlations between academic output and market performance that might reveal deeper economic patterns.

2. **Visualize Complex Data**: Present complex time-series data in an intuitive, interactive format that makes patterns more apparent.

3. **Bridge Different Domains**: Connect financial market analysis with academic research metrics to provide cross-domain insights.

4. **Support Decision Making**: Provide data-driven insights that could inform both research funding strategies and investment decisions.

## Features

- **Interactive Correlation Visualization**: Explore the relationship between S&P 500 returns and academic publication growth rates.

- **Time-Lag Analysis**: Adjust time lag parameters to investigate delayed effects between markets and publication rates.

- **Detailed Data Tables**: Access the underlying data in tabular format for deeper analysis.

- **Correlation Coefficient Calculation**: Automatically calculate and display Pearson correlation coefficients.

- **Responsive Design**: Optimized for both desktop and mobile viewing.

## Data Sources

- **S&P 500 Data**: Historical market data including yearly closing prices and calculated returns.

- **Publication Data**: Academic publication counts from OpenAlex API, with calculated year-over-year growth rates.

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Data Visualization**: D3.js
- **Styling**: TailwindCSS
- **Data Processing**: Python (pandas, matplotlib)
- **API Integration**: OpenAlex API

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/publication-market.git
cd publication-market
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Docker Deployment

Alternatively, you can use Docker to run the application:

```bash
docker-compose up -d
```

This will build and start the application in a container, accessible at [http://localhost:3000](http://localhost:3000).

## Data Update Process

The application uses data from the OpenAlex API for academic publications and historical S&P 500 data. To update the data:

1. Navigate to the data-exp directory:

```bash
cd ../data-exp
```

2. Run the update script:

```bash
python update_publication_market_data.py
```

This will fetch the latest data and update the application's dataset.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAlex API for providing academic publication data
- Financial data providers for S&P 500 historical data
