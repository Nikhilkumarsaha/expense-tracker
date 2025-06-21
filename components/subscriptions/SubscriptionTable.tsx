"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Subscription } from "@/lib/types"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

interface SubscriptionTableProps {
  subscriptions: Subscription[]
  onToggle: (id: string, isSubscribed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function SubscriptionTable({ 
  subscriptions, 
  onToggle,
  onDelete 
}: SubscriptionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      await onDelete(deleteId)
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subscription",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const handleToggle = async (id: string, isSubscribed: boolean) => {
    setIsToggling(id)
    try {
      await onToggle(id, isSubscribed)
      toast({
        title: isSubscribed ? "Subscription activated" : "Subscription paused",
        description: isSubscribed 
          ? "Automatic payments are now enabled" 
          : "Automatic payments are now disabled",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update subscription status",
        variant: "destructive",
      })
    } finally {
      setIsToggling(null)
    }
  }

  const columns: ColumnDef<Subscription>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="font-medium text-right">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Due Date",
      cell: ({ row }) => `${row.original.date}${getOrdinalSuffix(row.original.date)} of each month`,
    },
    {
      accessorKey: "isSubscribed",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Switch
            checked={row.original.isSubscribed}
            onCheckedChange={(checked) => 
              handleToggle(row.original._id || "", checked)
            }
            disabled={isToggling === row.original._id}
          />
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original._id || "")}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={subscriptions}
        searchColumn="title"
        placeholder="Search subscriptions..."
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscription. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}