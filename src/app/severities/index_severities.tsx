// Updated Severities component
import { PieChartComponent } from '@/components/ui/PieChartComponent'
import { TwoMetricCards } from '@/components/ui/TwoMetricCards'
import { useDateContext } from '@/components/ui/date-context'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function ymd(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`
}

export function Severities() {
  const { startDate, endDate } = useDateContext()
  const baseUrl = import.meta.env.VITE_SEVERITIES_PERCENTAGE_API_URL
  const baseUrl2 = import.meta.env.VITE_HIGH_SEVERITY_ALERTS_API_URL
  const topAlertUrl = import.meta.env.VITE_TOP_ALERT_API_URL
  const highSeverityCountUrl = import.meta.env.VITE_HIGH_SEVERITY_COUNT_API_URL
  const token = import.meta.env.VITE_TINYBIRD_TOKEN

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

  const url1 = `${baseUrl}?start_date=${s}&end_date=${e}&token=${token}`
  const url2 = `${baseUrl2}?min_percentage=5.0&start_date=${s}&end_date=${e}&token=${token}`
  const topAlertApiUrl = `${topAlertUrl}?start_date=${s}&end_date=${e}&token=${token}`
  const highSeverityApiUrl = `${highSeverityCountUrl}?start_date=${s}&end_date=${e}&token=${token}`

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Severities</h1>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          title="Security Severity Distribution"
          description="Current security incident severity levels"
          url={url1}
          nameKey="severity_level"
          valueKey="percentage"
        />
        <PieChartComponent
          title="High Severity Alerts Distribution"
          description="Alert types with >5% occurrence rate"
          url={url2}
          nameKey="alert_group"
          valueKey="total_percentage"
        />
      </div>

      {/* Metric Cards */}
      <TwoMetricCards
        topAlertUrl={topAlertApiUrl}
        highSeverityUrl={highSeverityApiUrl}
      />
    </div>
  )
}
