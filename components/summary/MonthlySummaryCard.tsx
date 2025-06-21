"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { CategoryTotal } from "@/lib/types"
import { 
  ArrowDown,
  ArrowUp,
  IndianRupee
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface MonthlySummaryCardProps {
  month: string
  totalIncome: number
  totalExpenses: number
  remainingBalance: number
  categoryTotals: Record<string, number>
  loading?: boolean
}

export function MonthlySummaryCard({
  month,
  totalIncome,
  totalExpenses,
  remainingBalance,
  categoryTotals,
  loading = false
}: MonthlySummaryCardProps) {
  const categories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ 
      category, 
      amount, 
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{month}</CardTitle>
        <CardDescription>Monthly summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
            <ArrowUp className="h-5 w-5 text-green-500 mb-1" />
            <span className="text-sm text-muted-foreground">Income</span>
            <span className="text-xl font-bold">
              {loading ? (
                <div className="h-7 w-20 animate-pulse rounded-md bg-muted-foreground/20"></div>
              ) : (
                formatCurrency(totalIncome)
              )}
            </span>
          </div>
          
          <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
            <ArrowDown className="h-5 w-5 text-red-500 mb-1" />
            <span className="text-sm text-muted-foreground">Expenses</span>
            <span className="text-xl font-bold">
              {loading ? (
                <div className="h-7 w-20 animate-pulse rounded-md bg-muted-foreground/20"></div>
              ) : (
                formatCurrency(totalExpenses)
              )}
            </span>
          </div>
          
          <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
            <IndianRupee className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className={`text-xl font-bold ${remainingBalance < 0 ? 'text-destructive' : 'text-green-500'}`}>
              {loading ? (
                <div className="h-7 w-20 animate-pulse rounded-md bg-muted-foreground/20"></div>
              ) : (
                formatCurrency(remainingBalance)
              )}
            </span>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          {loading ? (
            <div className="space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-16 animate-pulse rounded-md bg-muted"></div>
                  </div>
                  <div className="h-2 w-full animate-pulse rounded-md bg-muted"></div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-4">
              {categories.map(({ category, amount, percentage }) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{category}</span>
                    <span>{formatCurrency(amount)} <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span></span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              No expenses recorded for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}