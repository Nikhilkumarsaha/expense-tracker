import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { Income } from "@/lib/types";
import { ObjectId } from "mongodb";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const incomes = await db
      .collection("incomes")
      .find({})
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json(
      { error: "Failed to fetch incomes", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const income: Income = await request.json();
    
    if (!income.name || !income.amount || !income.date) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("incomes").insertOne({
      ...income,
      amount: Number(income.amount),
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      message: "Income added successfully",
      id: result.insertedId 
    });
  } catch (error) {
    console.error('Error adding income:', error);
    return NextResponse.json(
      { error: "Failed to add income", details: error instanceof Error ? error.message : 'Unknown error' },
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
        { error: "Income ID is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("incomes").deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Income not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json(
      { error: "Failed to delete income", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}