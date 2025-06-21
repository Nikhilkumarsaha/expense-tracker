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