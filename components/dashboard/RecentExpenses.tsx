"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Expense } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface RecentExpensesProps {
  expenses: Expense[]
  loading?: boolean
}

export function RecentExpenses({
  expenses,
  loading = false
}: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 5)

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle>Recent Expenses</CardTitle>
        <CardDescription>
          Your latest expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded-md bg-muted"></div>
                  <div className="h-3 w-20 animate-pulse rounded-md bg-muted"></div>
                </div>
                <div className="h-5 w-16 animate-pulse rounded-md bg-muted"></div>
              </div>
            ))}
          </div>
        ) : recentExpenses.length > 0 ? (
          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <div 
                key={expense._id || index} 
                className="flex justify-between items-center p-2 hover:bg-accent rounded-md transition-colors"
              >
                <div>
                  <p className="font-medium">{expense.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {expense.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(expense.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <span className="font-medium text-destructive">{formatCurrency(expense.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-muted-foreground">
            No expenses recorded yet
          </div>
        )}
      </CardContent>
    </Card>
  )
}