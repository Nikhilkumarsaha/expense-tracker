"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, formatDistanceToNow } from "date-fns"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  loading?: boolean
  trend?: {
    value: number
    label: string
  }
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  loading = false,
  trend
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-28 animate-pulse rounded-md bg-muted"></div>
          ) : (
            value
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={`text-xs flex items-center mt-2 ${trend.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <span>{trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}