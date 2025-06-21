"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MonthlyData } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface MonthlyExpenseChartProps {
  data: MonthlyData[]
  loading?: boolean
}

export function MonthlyExpenseChart({
  data,
  loading = false
}: MonthlyExpenseChartProps) {
  const [chartType, setChartType] = useState<'expenses' | 'income' | 'savings'>('expenses')
  
  const chartData = loading 
    ? Array(6).fill({ month: '', value: 0 }) 
    : data.map(item => ({
        month: item.month,
        value: item[chartType]
      }))

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Monthly {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</CardTitle>
          <CardDescription>
            Showing data for the last 6 months
          </CardDescription>
        </div>
        <Select 
          value={chartType} 
          onValueChange={(value) => setChartType(value as any)}
        >
          <SelectTrigger className="w-36 h-8">
            <SelectValue placeholder="Select data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expenses">Expenses</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="savings">Savings</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-48 w-full animate-pulse rounded-md bg-muted"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), chartType]} 
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey="value" 
                fill={
                  chartType === 'expenses' 
                    ? 'hsl(var(--destructive))' 
                    : chartType === 'income' 
                      ? 'hsl(var(--chart-2))' 
                      : 'hsl(var(--chart-1))'
                }
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}