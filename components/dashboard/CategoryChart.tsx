"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { CategoryTotal, EXPENSE_CATEGORIES } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface CategoryChartProps {
  data: Record<string, number>
  loading?: boolean
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  'hsl(var(--destructive))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--muted))'
]

export function CategoryChart({
  data,
  loading = false
}: CategoryChartProps) {
  const chartData = loading
    ? []
    : Object.entries(data).map(([category, amount]) => ({
        name: category,
        value: amount
      }))
      .sort((a, b) => b.value - a.value)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Expense by Category</CardTitle>
        <CardDescription>
          Monthly expense categories
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-48 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Amount']} 
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No expense data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}