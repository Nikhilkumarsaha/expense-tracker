"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { Expense } from "@/lib/types"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { Trash2, Pencil } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { ExpenseForm } from "./ExpenseForm"

interface ExpenseTableProps {
  expenses: Expense[]
  remainingBalance: number
  onDelete: (id: string) => Promise<void>
  onUpdate: (expense: Expense) => Promise<void>
}

export function ExpenseTable({ 
  expenses, 
  remainingBalance,
  onDelete,
  onUpdate
}: ExpenseTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

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

  const handleUpdate = async (expense: Expense) => {
    try {
      await onUpdate(expense);
      setEditingExpense(null);
    } catch (error) {
      // Toast is handled in the form
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
      header: () => <div className="text-center">Date</div>,
      cell: ({ row }) => <div className="text-center">{format(parseISO(row.original.date), "MMM dd, yyyy")}</div>,
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
        <div className="font-medium text-destructive text-center">
          {formatCurrency(row.original.amount)}
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
            onClick={() => setEditingExpense(row.original)}
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

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSubmit={handleUpdate} expense={editingExpense} />
        </DialogContent>
      </Dialog>
    </>
  )
}