import { PieChartComponent } from '@/components/ui/PieChartComponent'

export function Severities() {
  const baseUrl = import.meta.env.VITE_SEVERITIES_PERCENTAGE_API_URL
  const baseUrl2 = import.meta.env.VITE_HIGH_SEVERITY_ALERTS_API_URL
  const token = import.meta.env.VITE_TINYBIRD_TOKEN

  const url1 = `${baseUrl}?start_date=2024-01-01&end_date=2024-12-31&token=${token}`
  const url2 = `${baseUrl2}?min_percentage=5.0&token=${token}`

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Severities</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart for severity distribution */}
        <PieChartComponent
          title="Security Severity Distribution"
          description="Current security incident severity levels"
          url={url1}
          nameKey="severity_level"
          valueKey="percentage"
        />

        {/* Pie chart for high severity alerts */}
        <PieChartComponent
          title="High Severity Alerts Distribution"
          description="Alert types with >5% occurrence rate"
          url={url2}
          nameKey="alert_group"
          valueKey="total_percentage"
        />
      </div>
    </div>
  )
}
