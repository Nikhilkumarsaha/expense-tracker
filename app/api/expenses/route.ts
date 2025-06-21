import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { Expense } from "@/lib/types";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const expenses = await db
      .collection("expenses")
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const expense: Expense = await request.json();
    
    if (!expense.title || !expense.amount || !expense.date || !expense.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("expenses").insertOne({
      ...expense,
      amount: Number(expense.amount),
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      message: "Expense added successfully",
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("expenses").deleteOne({
      _id: id
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}