import { prisma } from "@/lib/prisma";
import CalendarView from "./calendar-view";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        not: null,
      },
    },
  });

  const bills = await prisma.billPayment.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <CalendarView initialTasks={tasks} initialBills={bills} />
    </div>
  );
}