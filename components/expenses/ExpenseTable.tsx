"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Expense } from "@/lib/types"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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

interface ExpenseTableProps {
  expenses: Expense[]
  remainingBalance: number
  onDelete: (id: string) => Promise<void>
}

export function ExpenseTable({ 
  expenses, 
  remainingBalance,
  onDelete 
}: ExpenseTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    
    setIsDeleting(true)
    try {
      await onDelete(deleteId)
      toast({
        title: "Expense deleted",
        description: "The expense entry has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => format(parseISO(row.original.date), "MMM dd, yyyy"),
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
        <div className="font-medium text-destructive text-right">
          {formatCurrency(row.original.amount)}
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

  return (
    <>
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-medium">Remaining Balance</h3>
        <p className={`text-2xl font-bold ${remainingBalance < 0 ? 'text-destructive' : 'text-green-500'}`}>
          {formatCurrency(remainingBalance)}
        </p>
      </div>
      
      <DataTable
        columns={columns}
        data={expenses}
        searchColumn="title"
        placeholder="Search expenses..."
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense entry. This action cannot be undone.
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