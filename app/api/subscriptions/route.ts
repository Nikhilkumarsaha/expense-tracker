import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { Subscription } from "@/lib/types";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const subscriptions = await db
      .collection("subscriptions")
      .find({})
      .sort({ title: 1 })
      .toArray();
    
    return NextResponse.json(subscriptions);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const subscription: Omit<Subscription, '_id'> = await request.json();
    
    if (!subscription.title || !subscription.amount || !subscription.date || !subscription.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("subscriptions").insertOne({
      ...subscription,
      amount: Number(subscription.amount),
      date: Number(subscription.date),
      isSubscribed: Boolean(subscription.isSubscribed),
      createdAt: new Date(),
    });
    
    return NextResponse.json({ 
      message: "Subscription added successfully",
      id: result.insertedId 
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add subscription" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const subscription: Subscription = await request.json();
    const { _id, ...updateData } = subscription;
    
    if (!_id) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("subscriptions").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Subscription updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update subscription" },
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
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("expense-tracker");
    
    const result = await db.collection("subscriptions").deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: "Subscription deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}