"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BillPayment } from "@prisma/client";
import { Calendar as CalendarIcon, DollarSign, RefreshCw, Tag } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const billSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("INR"),
  dueDate: z.date(),
  isPaid: z.boolean().default(false),
  isRecurring: z.boolean().default(false),
  recurringType: z.string().optional(),
  category: z.string().default("utility"),
  notes: z.string().optional(),
});

type BillFormValues = z.infer<typeof billSchema>;

interface BillFormProps {
  bill?: BillPayment | null;
  onClose: () => void;
}

const categories = [
  "utility",
  "insurance",
  "medical",
  "subscription",
  "rent",
  "loan",
  "other"
];

const recurringTypes = [
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "yearly"
];

const currencies = [
  "INR",
  "USD",
  "EUR",
  "GBP"
];

export default function BillForm({ bill, onClose }: BillFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<BillFormValues> = {
    title: bill?.title || "",
    amount: bill?.amount || 0,
    currency: bill?.currency || "INR",
    dueDate: bill?.dueDate ? new Date(bill.dueDate) : new Date(),
    isPaid: bill?.isPaid || false,
    isRecurring: bill?.isRecurring || false,
    recurringType: bill?.recurringType || "monthly",
    category: bill?.category || "utility",
    notes: bill?.notes || "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues,
  });

  const watchDueDate = watch("dueDate");
  const watchIsRecurring = watch("isRecurring");
  const watchRecurringType = watch("recurringType");
  const watchCategory = watch("category");
  const watchCurrency = watch("currency");

  const onSubmit = async (data: BillFormValues) => {
    try {
      setIsSubmitting(true);
      
      const url = bill ? `/api/bills/${bill.id}` : "/api/bills";
      const method = bill ? "PATCH" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save bill");
      }

      toast.success(bill ? "Bill updated successfully" : "Bill created successfully");
      router.refresh();
      onClose();
    } catch (error) {
      console.error("Error saving bill:", error);
      toast.error("Failed to save bill");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Bill Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          placeholder="Enter bill title"
          {...register("title")}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
              className={cn("pl-9", errors.amount ? "border-red-500" : "")}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Currency</label>
          <Select
            value={watchCurrency}
            onValueChange={(value) => setValue("currency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Due Date <span className="text-red-500">*</span></label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !watchDueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watchDueDate ? format(watchDueDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={watchDueDate}
              onSelect={(date) => date && setValue("dueDate", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.dueDate && (
          <p className="text-xs text-red-500">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          value={watchCategory}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-blue-500" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPaid"
          checked={watch("isPaid")}
          onCheckedChange={(checked) => setValue("isPaid", !!checked)}
        />
        <label
          htmlFor="isPaid"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Mark as paid
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isRecurring"
          checked={watchIsRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", !!checked)}
        />
        <label
          htmlFor="isRecurring"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          This is a recurring bill
        </label>
      </div>

      {watchIsRecurring && (
        <div className="space-y-2 pl-6">
          <label className="text-sm font-medium">Recurring Type</label>
          <Select
            value={watchRecurringType || "monthly"}
            onValueChange={(value) => setValue("recurringType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recurring type" />
            </SelectTrigger>
            <SelectContent>
              {recurringTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes
        </label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes (optional)"
          {...register("notes")}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : bill ? "Update Bill" : "Create Bill"}
        </Button>
      </div>
    </form>
  );
}