"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseTable } from "@/components/expenses/ExpenseTable"
import { ExpenseForm } from "@/components/expenses/ExpenseForm"
import { Expense } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [remainingBalance, setRemainingBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch expenses
      const expensesResponse = await fetch('/api/expenses')
      if (!expensesResponse.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const expensesData = await expensesResponse.json()
      setExpenses(expensesData)
      
      // Calculate total expenses
      const expensesTotal = expensesData.reduce((sum: number, expense: Expense) => sum + expense.amount, 0)
      setTotalExpenses(expensesTotal)
      
      // Fetch incomes to calculate remaining balance
      const incomesResponse = await fetch('/api/income')
      if (!incomesResponse.ok) {
        throw new Error('Failed to fetch incomes')
      }
      const incomesData = await incomesResponse.json()
      
      // Calculate total income
      const incomeTotal = incomesData.reduce((sum: number, income: any) => sum + income.amount, 0)
      setTotalIncome(incomeTotal)
      
      // Calculate remaining balance
      setRemainingBalance(incomeTotal - expensesTotal)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expense: Expense) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add expense')
      }
      
      fetchData() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleUpdateExpense = async (expense: Expense) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update expense')
      }
      
      fetchData() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleDeleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }
      
      fetchData() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground mt-1">
          Track and manage your expenses
        </p>
      </div>
      
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Expense List</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading expense data...</p>
            </div>
          ) : (
            <ExpenseTable 
              expenses={expenses} 
              remainingBalance={remainingBalance}
              onDelete={handleDeleteExpense} 
              onUpdate={handleUpdateExpense}
            />
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>
                Add a new expense entry to your records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseForm onSubmit={handleAddExpense} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}