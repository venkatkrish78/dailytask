import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bills = await prisma.billPayment.findMany({
      orderBy: [
        { isPaid: "asc" },
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
    });
    
    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const bill = await prisma.billPayment.create({
      data: {
        title: data.title,
        amount: data.amount,
        currency: data.currency || "INR",
        dueDate: data.dueDate,
        isPaid: data.isPaid || false,
        isRecurring: data.isRecurring || false,
        recurringType: data.recurringType,
        category: data.category || "utility",
        notes: data.notes,
      },
    });
    
    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error("Error creating bill:", error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    );
  }
}