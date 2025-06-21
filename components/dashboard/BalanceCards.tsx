"use client"

import { ArrowDown, ArrowUp, IndianRupee } from "lucide-react"
import { StatsCard } from "./StatsCard"
import { formatCurrency } from "@/lib/utils"

interface BalanceCardsProps {
  totalIncome: number
  totalExpenses: number
  remainingBalance: number
  loading?: boolean
}

export function BalanceCards({
  totalIncome,
  totalExpenses,
  remainingBalance,
  loading = false
}: BalanceCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Current Balance"
        value={formatCurrency(remainingBalance)}
        icon={<IndianRupee className="h-4 w-4 text-muted-foreground" />}
        description="Total remaining balance"
        loading={loading}
      />
      <StatsCard
        title="Total Income"
        value={formatCurrency(totalIncome)}
        icon={<ArrowUp className="h-4 w-4 text-green-500" />}
        description="All time income"
        loading={loading}
      />
      <StatsCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={<ArrowDown className="h-4 w-4 text-red-500" />}
        description="All time expenses"
        loading={loading}
      />
    </div>
  )
}