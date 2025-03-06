import React from "react";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface LineChartProps {
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
}

const colorMap: Record<string, string> = {
  blue: "#3b82f6",
  green: "#22c55e",
  emerald: "#10b981",
  red: "#ef4444",
  orange: "#f97316",
  purple: "#8b5cf6",
  yellow: "#eab308",
  gray: "#6b7280",
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  categories,
  index,
  colors = [],
  valueFormatter,
  yAxisWidth = 50,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey={index} />
        <YAxis width={yAxisWidth} tickFormatter={valueFormatter} />
        <Tooltip formatter={(value: number | string) => (valueFormatter ? [valueFormatter(value as number), ""] : [value, ""])} />
        <Legend />
        {categories.map((category, i) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colorMap[colors[i]] || colors[i] || colorMap.blue}
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
