"use client"

import { useEffect, useState } from "react"
import { BalanceCards } from "@/components/dashboard/BalanceCards"
import { MonthlyExpenseChart } from "@/components/dashboard/MonthlyExpenseChart"
import { CategoryChart } from "@/components/dashboard/CategoryChart"
import { RecentExpenses } from "@/components/dashboard/RecentExpenses"
import { Expense, MonthlyData } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<{
    monthlyData: MonthlyData[];
    totalIncome: number;
    totalExpenses: number;
    remainingBalance: number;
    currentMonth: {
      name: string;
      totalExpenses: number;
      totalIncome: number;
      remainingBalance: number;
      expenses: Expense[];
      categoryTotals: Record<string, number>;
    };
  }>({
    monthlyData: [],
    totalIncome: 0,
    totalExpenses: 0,
    remainingBalance: 0,
    currentMonth: {
      name: "",
      totalExpenses: 0,
      totalIncome: 0,
      remainingBalance: 0,
      expenses: [],
      categoryTotals: {}
    }
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard')
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const data = await response.json()
        setDashboardData(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your finances
        </p>
      </div>
      
      {/* Stats Cards */}
      <BalanceCards
        totalIncome={dashboardData.totalIncome}
        totalExpenses={dashboardData.totalExpenses}
        remainingBalance={dashboardData.remainingBalance}
        loading={loading}
      />
      
      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-6">
        <div className="lg:col-span-3">
          <MonthlyExpenseChart 
            data={dashboardData.monthlyData}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-3">
          <CategoryChart 
            data={dashboardData.currentMonth.categoryTotals}
            loading={loading}
          />
        </div>
      </div>
      
      {/* Recent Expenses */}
      <div className="grid gap-6 grid-cols-1">
        <RecentExpenses 
          expenses={dashboardData.currentMonth.expenses} 
          loading={loading}
        />
      </div>
    </div>
  )
}