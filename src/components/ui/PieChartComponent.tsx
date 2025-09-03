'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card'
import { TrendingUp } from 'lucide-react'

const DEFAULT_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
]

interface PieChartData {
  name: string
  value: number
  fill?: string
}

interface PieChartComponentProps {
  title: string
  description?: string
  data?: PieChartData[]
  url?: string
  nameKey?: string
  valueKey?: string
}

export function PieChartComponent({
  title,
  description,
  data,
  url,
  nameKey = 'severity_level',
  valueKey = 'percentage',
}: PieChartComponentProps) {
  const [chartData, setChartData] = useState<PieChartData[]>(data || [])
  const [loading, setLoading] = useState<boolean>(!!url)
  const [error, setError] = useState<string | null>(null)

  // Fetch API data
  useEffect(() => {
    if (url) {
      setLoading(true)
      setError(null)

      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then((json: any) => {
          const formatted: PieChartData[] = json.data.map(
            (item: any, index: number) => ({
              name: item[nameKey] ?? `Item ${index + 1}`,
              value: item[valueKey] ?? 0,
              fill: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
            }),
          )
          setChartData(formatted)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching chart data:', err)
          setError('Failed to load chart data')
          setLoading(false)
        })
    }
  }, [url, nameKey, valueKey])

  // Handle static data
  useEffect(() => {
    if (data && !url) {
      const dataWithColors = data.map((item, index) => ({
        ...item,
        fill: item.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      }))
      setChartData(dataWithColors)
    }
  }, [data, url])

  return (
    <Card className="flex flex-col max-w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        {error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p className="text-sm">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={140}
              labelLine={false}
              label={({ value }) => `${value.toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name,
              ]}
            />
          </PieChart>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total percentages
        </div>
      </CardFooter>
    </Card>
  )
}
