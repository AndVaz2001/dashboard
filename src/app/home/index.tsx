import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Table } from '@/components/ui/graphics'

export function Home() {
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
              A quick overview of your performance and profitability.
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
              Sales Overview
            </CardTitle>
            <CardDescription>Track your current sales pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Analyze sales trends and identify new opportunities.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-gray-500">Updated 2h ago</span>
          </CardFooter>
        </Card>

        {/* Card 3 */}
        <Card className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Customer Satisfaction
            </CardTitle>
            <CardDescription>Feedback and survey results</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Monitor client feedback to improve service quality.
            </p>
          </CardContent>
          <CardFooter>
            <span className="text-sm text-gray-500">Last week summary</span>
          </CardFooter>
        </Card>
      </div>

      {/* Tabla/gráfico principal */}
      <Table />
    </div>
  )
}
