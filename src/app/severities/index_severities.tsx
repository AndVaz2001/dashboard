import { PieChartComponent } from '@/components/ui/PieChartComponent'
import { TwoMetricCards } from '@/components/ui/TwoMetricCards'
import { useDateContext } from '@/components/ui/date-context'

// ==== API Configuration ====
const API_BASE = import.meta.env.VITE_API_BASE_URL
const TINYBIRD_TOKEN = import.meta.env.VITE_TINYBIRD_TOKEN

const API_ENDPOINTS = {
  severityDistribution: `${API_BASE}/severity_distribution.json`,
  highSeverityAlerts: `${API_BASE}/high_severity_alerts_distribution.json`,
  topAlert: `${API_BASE}/most_frequent_high_severity_alert.json`,
  highSeverityCount: `${API_BASE}/high_severity_count.json`,
} as const

// ==== Utils ====
function pad(n: number) {
  return String(n).padStart(2, '0')
}

function ymd(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`
}

// ==== Component ====
export function Severities() {
  const { startDate, endDate } = useDateContext()

  const startDateStr = ymd(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    startDate.getDate(),
  )
  const endDateStr = ymd(
    endDate.getFullYear(),
    endDate.getMonth() + 1,
    endDate.getDate(),
  )

  // Build API URLs
  const severityDistributionUrl = `${API_ENDPOINTS.severityDistribution}?start_date=${startDateStr}&end_date=${endDateStr}&token=${TINYBIRD_TOKEN}`

  const highSeverityAlertsUrl = `${API_ENDPOINTS.highSeverityAlerts}?min_percentage=5.0&start_date=${startDateStr}&end_date=${endDateStr}&token=${TINYBIRD_TOKEN}`

  const topAlertApiUrl = `${API_ENDPOINTS.topAlert}?start_date=${startDateStr}&end_date=${endDateStr}&token=${TINYBIRD_TOKEN}`

  const highSeverityApiUrl = `${API_ENDPOINTS.highSeverityCount}?start_date=${startDateStr}&end_date=${endDateStr}&token=${TINYBIRD_TOKEN}`

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Severities</h1>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          title="Security Severity Distribution"
          description="Current security incident severity levels"
          url={severityDistributionUrl}
          nameKey="severity_level"
          valueKey="percentage"
        />
        <PieChartComponent
          title="High Severity Alerts Distribution"
          description="Alert types with >5% occurrence rate"
          url={highSeverityAlertsUrl}
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
