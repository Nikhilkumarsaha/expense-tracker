"use client"

import { useEffect, useState } from "react"
import { MonthlySummaryCard } from "@/components/summary/MonthlySummaryCard"
import { ExpenseDetails } from "@/components/summary/ExpenseDetails"
import { Expense } from "@/lib/types"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [summaryData, setSummaryData] = useState<{
    month: string;
    totalIncome: number;
    totalExpenses: number;
    remainingBalance: number;
    categoryTotals: Record<string, number>;
    expenses: Expense[];
    incomes: any[];
  }>({
    month: "",
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    categoryTotals: {},
    expenses: [],
    incomes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Generate last 12 months for the select dropdown
    const months = []
    const today = new Date()
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      months.push(format(date, 'yyyy-MM'))
    }
    
    setAvailableMonths(months)
    
  }, [])

  useEffect(() => {
    fetchSummaryData(selectedMonth)
  }, [selectedMonth])

  const fetchSummaryData = async (month: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/summary?month=${month}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch summary data')
      }
      
      const data = await response.json()
      setSummaryData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load summary data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monthly Summary</h1>
        <p className="text-muted-foreground mt-1">
          View your financial summary by month
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="month-select" className="min-w-24">
              Select Month:
            </Label>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger id="month-select" className="w-full max-w-xs">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {format(new Date(`${month}-01`), 'MMMM yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-8 grid-cols-1">
        <MonthlySummaryCard 
          month={summaryData.month}
          totalIncome={summaryData.totalIncome}
          totalExpenses={summaryData.totalExpenses}
          remainingBalance={summaryData.remainingBalance}
          categoryTotals={summaryData.categoryTotals}
          loading={loading}
        />
        
        <ExpenseDetails 
          expenses={summaryData.expenses}
          loading={loading}
        />
      </div>
    </div>
  )
}