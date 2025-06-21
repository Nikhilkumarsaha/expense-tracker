"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Expense } from "@/lib/types"
import { format, parseISO } from "date-fns"
import { formatCurrency } from "@/lib/utils"

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
]

interface ExpenseDetailsProps {
  expenses: Expense[]
  loading?: boolean
}

export function ExpenseDetails({
  expenses,
  loading = false
}: ExpenseDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Details</CardTitle>
        <CardDescription>
          All expenses for the selected month
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-96 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <DataTable
            columns={columns}
            data={expenses}
            searchColumn="title"
            placeholder="Search expenses..."
          />
        )}
      </CardContent>
    </Card>
  )
}