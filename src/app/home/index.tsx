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
import { useState, useEffect, useMemo } from 'react'
import { Calendar28 } from '@/components/ui/datepicker'

// ==== utils ====
type ChartPoint = {
  month: string
  Patients: number
  Reach: number
  Engagement: number
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function ymd(y: number, m: number, d: number) {
  // local-date safe YYYY-MM-DD formatter
  return `${y}-${pad(m)}-${pad(d)}`
}
function startOfMonth(y: number, m1to12: number) {
  return new Date(y, m1to12 - 1, 1)
}
function endOfMonth(y: number, m1to12: number) {
  // Day 0 of next month => last day of current month
  return new Date(y, m1to12, 0)
}
function clampDate(date: Date, min: Date, max: Date) {
  return date < min ? min : date > max ? max : date
}
// Get inclusive list of (year, month) pairs between two dates
function getMonthRange(start: Date, end: Date) {
  const s = new Date(start.getFullYear(), start.getMonth(), 1)
  const e = new Date(end.getFullYear(), end.getMonth(), 1)
  const months: { year: number; month: number }[] = []
  let cur = s
  while (cur <= e) {
    months.push({ year: cur.getFullYear(), month: cur.getMonth() + 1 })
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
  }
  return months
}
function formatLabel(y: number, m1to12: number) {
  return `${new Date(y, m1to12 - 1).toLocaleString('default', {
    month: 'short',
  })} ${y}`
}

// Build safe month-bounded range (respect overall start/end)
function monthBoundedRange(
  y: number,
  m: number,
  overallStart: Date,
  overallEnd: Date,
) {
  const mStart = startOfMonth(y, m)
  const mEnd = endOfMonth(y, m)
  const start = clampDate(mStart, overallStart, overallEnd)
  const end = clampDate(mEnd, overallStart, overallEnd)
  return {
    startStr: ymd(start.getFullYear(), start.getMonth() + 1, start.getDate()),
    endStr: ymd(end.getFullYear(), end.getMonth() + 1, end.getDate()),
  }
}

// ==== component ====
export function Home() {
  // Cards
  const [roi, setRoi] = useState<number | null>(null)
  const [reach, setReach] = useState<number | null>(null)
  const [engagement, setEngagement] = useState<number | null>(null)

  // Chart
  const [chartData, setChartData] = useState<ChartPoint[]>([])

  // Date filters (default: Jun 1, 2024 → Jun 30, 2025)
  const [startDate, setStartDate] = useState(new Date(2024, 5, 1))
  const [endDate, setEndDate] = useState(new Date(2025, 5, 30))

  // Env vars (Vite)
  const ROI_API = import.meta.env.VITE_ROI_API_URL as string
  const REACH_API = import.meta.env.VITE_REACH_API_URL as string
  const ENGAGEMENT_API = import.meta.env.VITE_ENGAGEMENT_API_URL as string
  const PATIENTS_API = import.meta.env.VITE_PATIENTS_API_URL as string
  const TINYBIRD_TOKEN = import.meta.env.VITE_TINYBIRD_TOKEN as string

  // Guard: keep start <= end
  useEffect(() => {
    if (startDate > endDate) {
      // If user picks an earlier end, snap start to end
      setStartDate(endDate)
    }
  }, [startDate, endDate])

  const chartConfig = useMemo(
    () => ({
      Patients: { label: 'Patients Called', color: '#3b82f6' },
      Reach: { label: 'Reach', color: '#10b981' },
      Engagement: { label: 'Engagement', color: '#f59e0b' },
    }),
    [],
  )

  // ====== fetch cards ======
  useEffect(() => {
    const s = ymd(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate(),
    )
    const e = ymd(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      endDate.getDate(),
    )

    const fetchRoiData = async () => {
      try {
        const res = await fetch(
          `${ROI_API}?start_date=${s}&end_date=${e}&token=${TINYBIRD_TOKEN}`,
        )
        if (!res.ok) throw new Error('ROI fetch failed')
        const json = await res.json()
        setRoi(json.data?.[0]?.ROI ?? null)
      } catch (err) {
        console.error(err)
        setRoi(null)
      }
    }

    const fetchReachData = async () => {
      try {
        const res = await fetch(
          `${REACH_API}?start_date=${s}&end_date=${e}&token=${TINYBIRD_TOKEN}`,
        )
        if (!res.ok) throw new Error('Reach fetch failed')
        const json = await res.json()
        setReach(json.data?.[0]?.reach_followup ?? null)
      } catch (err) {
        console.error(err)
        setReach(null)
      }
    }

    const fetchEngagementData = async () => {
      try {
        const res = await fetch(
          `${ENGAGEMENT_API}?start_date=${s}&end_date=${e}&token=${TINYBIRD_TOKEN}`,
        )
        if (!res.ok) throw new Error('Engagement fetch failed')
        const json = await res.json()
        setEngagement(json.data?.[0]?.engagement_percentage ?? null)
      } catch (err) {
        console.error(err)
        setEngagement(null)
      }
    }

    fetchRoiData()
    fetchReachData()
    fetchEngagementData()
  }, [startDate, endDate, ROI_API, REACH_API, ENGAGEMENT_API, TINYBIRD_TOKEN])

  // ====== fetch chart ======
  useEffect(() => {
    const months = getMonthRange(startDate, endDate)

    const run = async () => {
      try {
        const points: ChartPoint[] = []

        for (const { year, month } of months) {
          const { startStr, endStr } = monthBoundedRange(
            year,
            month,
            startDate,
            endDate,
          )

          // patients endpoint is per year & month
          const patientsUrl = `${PATIENTS_API}?year=${year}&month=${month}&token=${TINYBIRD_TOKEN}`

          // fetch all three in parallel for the month
          const [patientsRes, reachRes, engagementRes] = await Promise.all([
            fetch(patientsUrl),
            fetch(
              `${REACH_API}?start_date=${startStr}&end_date=${endStr}&token=${TINYBIRD_TOKEN}`,
            ),
            fetch(
              `${ENGAGEMENT_API}?start_date=${startStr}&end_date=${endStr}&token=${TINYBIRD_TOKEN}`,
            ),
          ])

          const [patientsJson, reachJson, engagementJson] = await Promise.all([
            patientsRes.json(),
            reachRes.json(),
            engagementRes.json(),
          ])

          // NOTE: per your sample, the field is "patients_called_count"
          const patientsCount =
            patientsJson?.data?.[0]?.patients_called_count ?? 0
          const reachValue = reachJson?.data?.[0]?.reach_followup ?? 0
          const engagementValue =
            engagementJson?.data?.[0]?.engagement_percentage ?? 0

          points.push({
            month: formatLabel(year, month),
            Patients: Number(patientsCount),
            Reach: Number(reachValue),
            Engagement: Number(engagementValue),
          })
        }

        setChartData(points)
      } catch (err) {
        console.error('Error fetching chart data:', err)
        setChartData([])
      }
    }

    run()
  }, [
    startDate,
    endDate,
    PATIENTS_API,
    REACH_API,
    ENGAGEMENT_API,
    TINYBIRD_TOKEN,
  ])

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50">
      {/* Date Filters */}
      <div className="flex flex-wrap gap-6">
        <Calendar28
          label="Start Date"
          selectedDate={startDate}
          onChange={(d) => d && setStartDate(d)}
        />
        <Calendar28
          label="End Date"
          selectedDate={endDate}
          onChange={(d) => d && setEndDate(d)}
        />
      </div>

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
            <CardTitle>Reach Percentage</CardTitle>
            <CardDescription>Track your audience reach</CardDescription>
          </CardHeader>
          <CardContent>
            {reach !== null ? `Reach: ${reach.toFixed(2)}` : 'Loading...'}
          </CardContent>
          <CardFooter>Last updated: Today</CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Percentage</CardTitle>
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
      <Card className="p-4 max-w-xxl">
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
