"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Subscription } from "@/lib/types"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Pencil } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { SubscriptionForm } from "./SubscriptionForm"

interface SubscriptionTableProps {
  subscriptions: Subscription[]
  onToggle: (id: string, isSubscribed: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onUpdate: (subscription: Subscription) => Promise<void>
}

export function SubscriptionTable({ 
  subscriptions, 
  onToggle,
  onDelete,
  onUpdate
}: SubscriptionTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

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

  const handleUpdate = async (subscription: Subscription) => {
    try {
      await onUpdate(subscription);
      setEditingSubscription(null);
    } catch (error) {
      // Error is handled in the form
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
      header: () => <div className="text-center">Category</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant="outline">{row.original.category}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount</div>,
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">Due Date</div>,
      cell: ({ row }) => <div className="text-center">{`${row.original.date}${getOrdinalSuffix(row.original.date)} of each month`}</div>,
    },
    {
      accessorKey: "isSubscribed",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
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
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
           <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingSubscription(row.original)}
          >
            <Pencil className="h-4 w-4 text-yellow-700 hover:text-yellow-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(row.original._id || "")}
          >
            <Trash2 className="h-4 w-4 text-destructive hover:text-red-600" />
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

      <Dialog open={!!editingSubscription} onOpenChange={(open) => !open && setEditingSubscription(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>
          <SubscriptionForm onSubmit={handleUpdate} subscription={editingSubscription} />
        </DialogContent>
      </Dialog>
    </>
  )
}