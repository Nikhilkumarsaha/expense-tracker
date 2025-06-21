import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { format, parseISO, subMonths, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await clientPromise;
    console.log('Connected to MongoDB successfully');
    
    const db = client.db("expense-tracker");
   
    
    // Get current date and calculate dates for last 6 months
    const currentDate = new Date();
    const monthlyData = [];
    
    // Get data for last 6 months
    for (let i = 0; i < 6; i++) {
      const date = subMonths(currentDate, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthFormatted = format(date, 'yyyy-MM');
      const monthName = format(date, 'MMM yyyy');
      
      
      // Get expenses for the month
      const expenses = await db
        .collection("expenses")
        .find({
          date: {
            $gte: format(monthStart, 'yyyy-MM-dd'),
            $lte: format(monthEnd, 'yyyy-MM-dd')
          }
        })
        .toArray();
      
      // Get income for the month
      const incomes = await db
        .collection("incomes")
        .find({
          date: {
            $gte: format(monthStart, 'yyyy-MM-dd'),
            $lte: format(monthEnd, 'yyyy-MM-dd')
          }
        })
        .toArray();
      
      // Calculate totals
      const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
      const savings = totalIncome - totalExpenses;
      
      // Calculate expenses by category
      const categoryTotals = expenses.reduce((acc: Record<string, number>, expense) => {
        const category = expense.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += expense.amount;
        return acc;
      }, {});
      
      monthlyData.push({
        month: monthName,
        expenses: totalExpenses,
        income: totalIncome,
        savings,
        categoryTotals
      });
    }
    

    
    // Get overall totals
    const totalIncome = await db
      .collection("incomes")
      .aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
      .toArray();
    
    const totalExpenses = await db
      .collection("expenses")
      .aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
      .toArray();
    
    // Get current month data for the summary
    const currentMonth = format(currentDate, 'yyyy-MM');
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    
    
    const currentMonthExpenses = await db
      .collection("expenses")
      .find({
        date: {
          $gte: format(currentMonthStart, 'yyyy-MM-dd'),
          $lte: format(currentMonthEnd, 'yyyy-MM-dd')
        }
      })
      .toArray();
    
    const currentMonthIncome = await db
      .collection("incomes")
      .find({
        date: {
          $gte: format(currentMonthStart, 'yyyy-MM-dd'),
          $lte: format(currentMonthEnd, 'yyyy-MM-dd')
        }
      })
      .toArray();
    
    const currentMonthTotalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const currentMonthTotalIncome = currentMonthIncome.reduce((sum, income) => sum + income.amount, 0);
    const currentMonthBalance = currentMonthTotalIncome - currentMonthTotalExpenses;
    
    const currentMonthCategoryTotals = currentMonthExpenses.reduce((acc: Record<string, number>, expense) => {
      const category = expense.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += expense.amount;
      return acc;
    }, {});
    
    return NextResponse.json({
      monthlyData: monthlyData.reverse(), // Most recent month first
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      remainingBalance: (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0),
      currentMonth: {
        name: format(currentDate, 'MMMM yyyy'),
        totalExpenses: currentMonthTotalExpenses,
        totalIncome: currentMonthTotalIncome,
        remainingBalance: currentMonthBalance,
        expenses: currentMonthExpenses,
        categoryTotals: currentMonthCategoryTotals
      }
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}