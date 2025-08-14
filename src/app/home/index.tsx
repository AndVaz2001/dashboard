import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useState, useEffect } from 'react'

// Helper: June 2024 → June 2025
function getMonthRange() {
  const months: { year: number; month: number }[] = []
  let start = new Date(2024, 5) // June = index 5
  for (let i = 0; i < 12; i++) {
    months.push({ year: start.getFullYear(), month: start.getMonth() + 1 })
    start.setMonth(start.getMonth() + 1)
  }
  return months
}

export function Home() {
  const [roi, setRoi] = useState<number | null>(null)
  const [reach, setReach] = useState<number | null>(null)
  const [engagement, setEngagement] = useState<number | null>(null)
  const [chartData, setChartData] = useState<any[]>([])

  const ROI_API = import.meta.env.VITE_ROI_API_URL
  const REACH_API = import.meta.env.VITE_REACH_API_URL
  const ENGAGEMENT_API = import.meta.env.VITE_ENGAGEMENT_API_URL
  const TINYBIRD_TOKEN = import.meta.env.VITE_TINYBIRD_TOKEN

  // Fetch top-card metrics
  const fetchRoiData = async () => {
    try {
      const response = await fetch(
        `${ROI_API}?start_date=2024-01-01&end_date=2024-12-31&token=${TINYBIRD_TOKEN}`,
      )
      if (!response.ok) throw new Error('Failed to fetch ROI data')
      const result = await response.json()
      setRoi(result.data?.[0]?.ROI || null)
    } catch (error) {
      console.error('Error fetching ROI data:', error)
      setRoi(null)
    }
  }

  const fetchReachData = async () => {
    try {
      const response = await fetch(
        `${REACH_API}?start_date=2024-01-01&end_date=2024-12-31&token=${TINYBIRD_TOKEN}`,
      )
      if (!response.ok) throw new Error('Failed to fetch Reach data')
      const result = await response.json()
      setReach(result.data?.[0]?.reach_followup || null)
    } catch (error) {
      console.error('Error fetching Reach data:', error)
      setReach(null)
    }
  }

  const fetchEngagementData = async () => {
    try {
      const response = await fetch(
        `${ENGAGEMENT_API}?start_date=2024-01-01&end_date=2024-12-31&token=${TINYBIRD_TOKEN}`,
      )
      if (!response.ok) throw new Error('Failed to fetch Engagement data')
      const result = await response.json()
      setEngagement(result.data?.[0]?.engagement_percentage || null)
    } catch (error) {
      console.error('Error fetching Engagement data:', error)
      setEngagement(null)
    }
  }

  // Fetch monthly chart data
  const fetchMonthlyData = async () => {
    try {
      const months = getMonthRange()
      const results: any[] = []

      for (const { year, month } of months) {
        // Patients Called
        const patientsRes = await fetch(
          `http://localhost:7181/v0/pipes/patients_called_per_month.json?year=${year}&month=${month}&token=${TINYBIRD_TOKEN}`,
        )
        const patientsJson = await patientsRes.json()
        const patientsCount = patientsJson.data?.[0]?.patients_called ?? 0

        // Reach
        const reachRes = await fetch(
          `${REACH_API}?start_date=${year}-${String(month).padStart(2, '0')}-01&end_date=${year}-${String(month).padStart(2, '0')}-28&token=${TINYBIRD_TOKEN}`,
        )
        const reachJson = await reachRes.json()
        const reachValue = reachJson.data?.[0]?.reach_followup ?? 0

        // Engagement
        const engagementRes = await fetch(
          `${ENGAGEMENT_API}?start_date=${year}-${String(month).padStart(2, '0')}-01&end_date=${year}-${String(month).padStart(2, '0')}-28&token=${TINYBIRD_TOKEN}`,
        )
        const engagementJson = await engagementRes.json()
        const engagementValue =
          engagementJson.data?.[0]?.engagement_percentage ?? 0

        results.push({
          month: `${new Date(year, month - 1).toLocaleString('default', { month: 'short' })} ${year}`,
          Patients: patientsCount,
          Reach: reachValue,
          Engagement: engagementValue,
        })
      }

      setChartData(results)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setChartData([])
    }
  }

  useEffect(() => {
    fetchRoiData()
    fetchReachData()
    fetchEngagementData()
    fetchMonthlyData()
  }, [])

  const chartConfig = {
    Patients: { label: 'Patients Called', color: '#3b82f6' },
    Reach: { label: 'Reach', color: '#10b981' },
    Engagement: { label: 'Engagement', color: '#f59e0b' },
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ROI Formula</CardTitle>
            <CardDescription>Measure your return on investment</CardDescription>
          </CardHeader>
          <CardContent>
            {roi !== null ? `ROI: ${roi.toFixed(2)}` : 'Loading...'}
          </CardContent>
          <CardFooter>Last updated: Today</CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reach Overview</CardTitle>
            <CardDescription>Track your audience reach</CardDescription>
          </CardHeader>
          <CardContent>
            {reach !== null ? `Reach: ${reach.toFixed(2)}` : 'Loading...'}
          </CardContent>
          <CardFooter>Last updated: Today</CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
            <CardDescription>Track audience engagement</CardDescription>
          </CardHeader>
          <CardContent>
            {engagement !== null
              ? `Engagement: ${engagement.toFixed(2)}`
              : 'Loading...'}
          </CardContent>
          <CardFooter>Last updated: Today</CardFooter>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4">
        <ChartContainer config={chartConfig}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Patients" fill="var(--color-Patients)" />
            <Line type="monotone" dataKey="Reach" stroke="var(--color-Reach)" />
            <Line
              type="monotone"
              dataKey="Engagement"
              stroke="var(--color-Engagement)"
            />
          </ComposedChart>
        </ChartContainer>
      </Card>
    </div>
  )
}
