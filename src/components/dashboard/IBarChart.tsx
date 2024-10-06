'use client'

import React from 'react'
import { BarChart } from '@mui/x-charts/BarChart'

interface IBarChartProps {
  dataset: Array<{ [key: string]: any }>;
  xAxisDataKey: string;
  yAxisLabel: string;
  seriesDataKey: string;
  height: number;
}

export default function IBarChart({
  dataset,
  xAxisDataKey,
  yAxisLabel,
  seriesDataKey,
  height,
}: IBarChartProps) {

   const valueFormatter = (value: number | null) => `${value} AED`

   const chartSetting = {
      yAxis: [
         { 
            label: yAxisLabel,
            tickLabelStyle: { fill: '#ffffff' }
         }
      ],
      series: [{ dataKey: seriesDataKey, valueFormatter }],
      height: height,
   }

   return (
      <BarChart
         dataset={dataset}
         colors={["#ffffff"]}
         xAxis={[
            { 
              scaleType: 'band', 
              dataKey: xAxisDataKey, 
              tickLabelStyle: { fill: '#ffffff' },  
            }
          ]}
         {...chartSetting}
      />
   )
}
