import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table } from '@/components/ui/graphics'
import { useState, useEffect } from 'react'

export function Home() {
  const [roi, setRoi] = useState<number | null>(null)
  const [reach, setReach] = useState<number | null>(null)
  const [engagement, setEngagement] = useState<number | null>(null)

  // Function to fetch ROI data
  const fetchRoiData = async () => {
    try {
      const response = await fetch(
        `${process.env.VITE_ROI_API_URL}?start_date=2024-01-01&end_date=2024-12-31&token=${process.env.VITE_TINYBIRD_TOKEN}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch ROI data')
      }
      const result = await response.json()
      const roiValue = result.data?.[0]?.ROI || null
      setRoi(roiValue)
    } catch (error) {
      console.error('Error fetching ROI data:', error)
      setRoi(null)
    }
  }

  // Function to fetch Reach data
  const fetchReachData = async () => {
    try {
      const response = await fetch(
        `${process.env.VITE_REACH_API_URL}?start_date=2024-01-01&end_date=2024-12-31&token=${process.env.VITE_TINYBIRD_TOKEN}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch Reach data')
      }
      const result = await response.json()
      const reachValue = result.data?.[0]?.reach_followup || null
      setReach(reachValue)
    } catch (error) {
      console.error('Error fetching Reach data:', error)
      setReach(null)
    }
  }

  // Function to fetch Engagement data
  const fetchEngagementData = async () => {
    try {
      const response = await fetch(
        `${process.env.VITE_ENGAGEMENT_API_URL}?start_date=2024-01-01&end_date=2024-12-31&token=${process.env.VITE_TINYBIRD_TOKEN}`,
      )
      if (!response.ok) {
        throw new Error('Failed to fetch Engagement data')
      }
      const result = await response.json()
      const engagementValue = result.data?.[0]?.engagement_percentage || null
      setEngagement(engagementValue)
    } catch (error) {
      console.error('Error fetching Engagement data:', error)
      setEngagement(null)
    }
  }

  // Fetch data when the component mounts
  useEffect(() => {
    fetchRoiData()
    fetchReachData()
    fetchEngagementData()
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50">
      {/* Cards arriba */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">ROI Formula</CardTitle>
            <CardDescription>Measure your return on investment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {roi !== null ? `ROI: ${roi.toFixed(2)}` : 'Loading...'}
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-gray-500">Last updated: Today</span>
          </CardFooter>
        </Card>

        {/* Card 2 */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Reach Overview
            </CardTitle>
            <CardDescription>Track your audience reach</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {reach !== null ? `Reach: ${reach.toFixed(2)}` : 'Loading...'}
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-gray-500">Last updated: Today</span>
          </CardFooter>
        </Card>

        {/* Card 3 */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Engagement Overview
            </CardTitle>
            <CardDescription>Track audience engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {engagement !== null
                ? `Engagement: ${engagement.toFixed(2)}`
                : 'Loading...'}
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-gray-500">Last updated: Today</span>
          </CardFooter>
        </Card>
      </div>
      {/* Tabla/gráfico principal */}
      <Table /> {/* Pass table data to the Table component */}
    </div>
  )
}
