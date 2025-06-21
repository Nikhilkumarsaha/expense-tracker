import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { Expense, Subscription } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const activeSubscriptions = await db.collection<Subscription>("subscriptions").find({ 
      isSubscribed: true 
    }).toArray();
    
    let processedCount = 0;
    
    for (const sub of activeSubscriptions) {
      const lastProcessed = sub.lastProcessedDate ? new Date(sub.lastProcessedDate) : null;
      const dueDay = sub.date;

      let shouldProcess = false;

      if (!lastProcessed) {
        // If never processed, check if due date has passed this month
        if (today.getDate() >= dueDay) {
          shouldProcess = true;
        }
      } else {
        const lastProcessedMonth = lastProcessed.getMonth();
        const lastProcessedYear = lastProcessed.getFullYear();

        // Check if it was processed in a previous month, or previous year
        if (lastProcessedYear < currentYear || (lastProcessedYear === currentYear && lastProcessedMonth < currentMonth)) {
          if (today.getDate() >= dueDay) {
            shouldProcess = true;
          }
        }
      }
      
      if (shouldProcess) {
        // Create a new expense
        const expense: Expense = {
          title: `Subscription: ${sub.title}`,
          amount: sub.amount,
          date: new Date(currentYear, currentMonth, dueDay).toISOString().split('T')[0],
          category: sub.category,
          createdAt: new Date(),
        };
        
        const { _id, ...expenseToInsert } = expense;
        await db.collection("expenses").insertOne(expenseToInsert);
        
        // Update the subscription's lastProcessedDate
        await db.collection("subscriptions").updateOne(
          { _id: new ObjectId(sub._id) },
          { $set: { lastProcessedDate: new Date() } }
        );
        
        processedCount++;
      }
    }
    
    return NextResponse.json({ 
      message: `Processed ${processedCount} subscriptions.`,
      processedCount 
    });
    
  } catch (error) {
    console.error("Failed to process subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to process subscriptions" },
      { status: 500 }
    );
  }
} 