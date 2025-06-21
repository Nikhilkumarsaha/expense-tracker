"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionTable } from "@/components/subscriptions/SubscriptionTable"
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm"
import { Subscription } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function SubscriptionsPage() {
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [totalMonthly, setTotalMonthly] = useState(0)

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscriptions')
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions')
      }
      
      const data = await response.json()
      setSubscriptions(data)
      
      // Calculate total monthly cost of active subscriptions
      const total = data
        .filter((sub: Subscription) => sub.isSubscribed)
        .reduce((sum: number, sub: Subscription) => sum + sub.amount, 0)
      
      setTotalMonthly(total)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSubscriptions()
  }, [fetchSubscriptions])

  const handleProcessSubscriptions = async () => {
    setProcessing(true);
    try {
      const response = await fetch('/api/subscriptions/process', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process subscriptions');
      }
      
      toast({
        title: "Subscriptions Processed",
        description: `${result.processedCount} subscriptions were processed and added to expenses.`,
      });
      
      fetchSubscriptions(); // Refresh the list to show any updates
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      toast({
        title: "Error Processing Subscriptions",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }

  const handleAddSubscription = async (subscription: Omit<Subscription, '_id'>) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add subscription')
      }
      
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleUpdateSubscription = async (subscription: Subscription) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      fetchSubscriptions();
    } catch (error) {
      throw error;
    }
  };

  const handleToggleSubscription = async (id: string, isSubscribed: boolean) => {
    try {
      const subscription = subscriptions.find(sub => sub._id === id)
      if (!subscription) return
      
      const response = await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...subscription,
          isSubscribed
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }
      
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  const handleDeleteSubscription = async (id: string) => {
    try {
      const response = await fetch(`/api/subscriptions?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete subscription')
      }
      
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      throw error
    }
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">
          Manage your recurring payments
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-6 p-4 bg-muted rounded-lg">
        <div>
          <h3 className="text-lg font-medium">Total Monthly Subscriptions</h3>
          <p className="text-2xl font-bold">
            {loading ? "Loading..." : formatCurrency(totalMonthly)}
          </p>
        </div>
        <Button onClick={handleProcessSubscriptions} disabled={processing}>
          {processing ? 'Processing...' : 'Process Subscriptions'}
        </Button>
      </div>
      
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Subscription List</TabsTrigger>
          <TabsTrigger value="add">Add Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p>Loading subscription data...</p>
            </div>
          ) : (
            <SubscriptionTable 
              subscriptions={subscriptions} 
              onToggle={handleToggleSubscription}
              onDelete={handleDeleteSubscription} 
              onUpdate={handleUpdateSubscription}
            />
          )}
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Subscription</CardTitle>
              <CardDescription>
                Add a new recurring payment to your records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionForm onSubmit={handleAddSubscription} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}