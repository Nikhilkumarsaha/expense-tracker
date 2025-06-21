"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTable } from "@/components/income/IncomeTable"
import { IncomeForm } from "@/components/income/IncomeForm"
import { Income } from "@/lib/types"
import { toast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/income')
      
      if (!response.ok) {
        throw new Error('Failed to fetch incomes')
      }
      
      const data = await response.json()
      setIncomes(data)
      
      // Calculate total income
      const total = data.reduce((sum: number, income: Income) => sum + income.amount, 0)
      setTotalIncome(total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load income data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddIncome = async (income: Income) => {
    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(income),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add income')
      }
      
      fetchIncomes() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleDeleteIncome = async (id: string) => {
    try {
      const response = await fetch(`/api/income?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete income')
      }
      
      fetchIncomes() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Income</h1>
        <p className="text-muted-foreground mt-1">
          Manage your income sources
        </p>
      </div>
      
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-medium">Total Income</h3>
        <p className="text-2xl font-bold text-green-500">
          {loading ? "Loading..." : formatCurrency(totalIncome)}
        </p>
      </div>
      
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Income List</TabsTrigger>
          <TabsTrigger value="add">Add Income</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading income data...</p>
            </div>
          ) : (
            <IncomeTable 
              incomes={incomes} 
              onDelete={handleDeleteIncome} 
            />
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Income</CardTitle>
              <CardDescription>
                Add a new income entry to your records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IncomeForm onSubmit={handleAddIncome} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}