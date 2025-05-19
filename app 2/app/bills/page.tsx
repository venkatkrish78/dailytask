import { prisma } from "@/lib/prisma";
import BillList from "./bill-list";

export const dynamic = "force-dynamic";

export default async function BillsPage() {
  const bills = await prisma.billPayment.findMany({
    orderBy: [
      { isPaid: "asc" },
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BillList initialBills={bills} />
    </div>
  );
}