import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { AlertTriangle, Shield } from 'lucide-react'

interface MetricCardData {
  title: string
  value: string | number
  description: string
  icon: any
  color: string
  loading: boolean
  error: string | null
}

interface TopAlertApiResponse {
  data: Array<{
    alert_name: string
    alert_count: number
  }>
}

interface HighSeverityApiResponse {
  data: Array<{
    high_severity_count: number
  }>
}

interface TwoMetricCardsProps {
  topAlertUrl: string
  highSeverityUrl: string
}

export function TwoMetricCards({
  topAlertUrl,
  highSeverityUrl,
}: TwoMetricCardsProps) {
  const [topAlert, setTopAlert] = useState<MetricCardData>({
    title: 'Top Alert Type',
    value: 'Loading...',
    description: 'Most frequent alert in selected period',
    icon: AlertTriangle,
    color: 'text-amber-600',
    loading: true,
    error: null,
  })

  const [highSeverity, setHighSeverity] = useState<MetricCardData>({
    title: 'High Severity Alerts',
    value: 'Loading...',
    description: 'Total high severity incidents',
    icon: Shield,
    color: 'text-red-600',
    loading: true,
    error: null,
  })

  // Fetch top alert data
  useEffect(() => {
    if (topAlertUrl) {
      setTopAlert((prev) => ({ ...prev, loading: true, error: null }))

      fetch(topAlertUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json() as Promise<TopAlertApiResponse>
        })
        .then((json) => {
          if (json.data && json.data.length > 0) {
            const topAlertData = json.data[0]
            setTopAlert((prev) => ({
              ...prev,
              value: topAlertData.alert_name || 'No data',
              loading: false,
            }))
          } else {
            setTopAlert((prev) => ({
              ...prev,
              value: 'No alerts found',
              loading: false,
            }))
          }
        })
        .catch((err) => {
          console.error('Error fetching top alert:', err)
          setTopAlert((prev) => ({
            ...prev,
            error: 'Failed to load data',
            loading: false,
          }))
        })
    }
  }, [topAlertUrl])

  // Fetch high severity count
  useEffect(() => {
    if (highSeverityUrl) {
      setHighSeverity((prev) => ({ ...prev, loading: true, error: null }))

      fetch(highSeverityUrl)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json() as Promise<HighSeverityApiResponse>
        })
        .then((json) => {
          if (json.data && json.data.length > 0) {
            const count = json.data[0].high_severity_count
            setHighSeverity((prev) => ({
              ...prev,
              value: count.toLocaleString(),
              loading: false,
            }))
          } else {
            setHighSeverity((prev) => ({
              ...prev,
              value: '0',
              loading: false,
            }))
          }
        })
        .catch((err) => {
          console.error('Error fetching high severity count:', err)
          setHighSeverity((prev) => ({
            ...prev,
            error: 'Failed to load data',
            loading: false,
          }))
        })
    }
  }, [highSeverityUrl])

  const renderCard = (metric: MetricCardData) => {
    const IconComponent = metric.icon

    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <IconComponent className={`h-5 w-5 ${metric.color}`} />
            {metric.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metric.loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          ) : metric.error ? (
            <div className="text-red-500 text-sm">{metric.error}</div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">
                {metric.value}
              </div>
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {renderCard(topAlert)}
      {renderCard(highSeverity)}
    </div>
  )
}
