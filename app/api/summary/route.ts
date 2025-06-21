import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    if (!month) {
      return NextResponse.json(
        { error: "Month parameter is required (YYYY-MM format)" },
        { status: 400 }
      );
    }
    
    const startDate = startOfMonth(parseISO(`${month}-01`));
    const endDate = endOfMonth(parseISO(`${month}-01`));
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    // Get all expenses for the month
    const expenses = await db
      .collection("expenses")
      .find({
        date: {
          $gte: format(startDate, 'yyyy-MM-dd'),
          $lte: format(endDate, 'yyyy-MM-dd')
        }
      })
      .toArray();
    
    // Get all income for the month
    const incomes = await db
      .collection("incomes")
      .find({
        date: {
          $gte: format(startDate, 'yyyy-MM-dd'),
          $lte: format(endDate, 'yyyy-MM-dd')
        }
      })
      .toArray();
    
    // Calculate totals by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate total income and expenses
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remainingBalance = totalIncome - totalExpenses;
    
    return NextResponse.json({
      month: format(startDate, 'MMMM yyyy'),
      totalIncome,
      totalExpenses,
      remainingBalance,
      categoryTotals,
      expenses,
      incomes
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch summary data" },
      { status: 500 }
    );
  }
}