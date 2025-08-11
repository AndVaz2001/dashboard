// src/components/ui/table.tsx
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartData {
  month: string
  value: number
  target: number
}

export function Table() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://api.tinybird.co/v0/pipes/tu_endpoint.json?token=TU_TOKEN',
        )
        if (!res.ok) throw new Error('Error fetching data')
        const json = await res.json()

        const formattedData = json.data.map((item: any) => ({
          month: item.month,
          value: item.value,
          target: item.target,
        }))

        setData(formattedData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-6 shadow-sm text-center text-gray-500">
        Loading chart...
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Annual Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#374151" />
          <YAxis stroke="#374151" />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="value"
            name="Actual"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Target"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
