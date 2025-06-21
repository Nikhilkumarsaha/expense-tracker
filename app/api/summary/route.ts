import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { format, parseISO, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    
    if (!month && !year) {
      return NextResponse.json(
        { error: "Either year or month parameter is required (year: YYYY, month: YYYY-MM)" },
        { status: 400 }
      );
    }

    let startDate: Date, endDate: Date, label: string;
    if (month && month !== 'all') {
      startDate = startOfMonth(parseISO(`${month}-01`));
      endDate = endOfMonth(parseISO(`${month}-01`));
      label = format(startDate, 'MMMM yyyy');
    } else if (year) {
      startDate = startOfYear(parseISO(`${year}-01-01`));
      endDate = endOfYear(parseISO(`${year}-01-01`));
      label = format(startDate, 'yyyy');
    } else {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("expense-tracker");

    // Get all expenses for the period
    const expenses = await db
      .collection("expenses")
      .find({
        date: {
          $gte: format(startDate, 'yyyy-MM-dd'),
          $lte: format(endDate, 'yyyy-MM-dd')
        }
      })
      .toArray();

    // Get all income for the period
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
      month: label,
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