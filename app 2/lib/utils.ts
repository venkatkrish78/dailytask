import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday, isTomorrow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "No date";
  
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) {
    return `Today, ${format(dateObj, "h:mm a")}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday, ${format(dateObj, "h:mm a")}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow, ${format(dateObj, "h:mm a")}`;
  } else {
    return format(dateObj, "MMM d, yyyy 'at' h:mm a");
  }
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const currencyOptions: { [key: string]: { style: string, currency: string, minimumFractionDigits: number, maximumFractionDigits: number } } = {
    'USD': {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    'INR': {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    'EUR': {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    },
    'GBP': {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  };

  const options = currencyOptions[currency] || currencyOptions['INR'];
  
  return new Intl.NumberFormat('en-IN', options).format(amount);
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'text-red-500 dark:text-red-400';
    case 'medium':
      return 'text-amber-500 dark:text-amber-400';
    case 'low':
      return 'text-green-500 dark:text-green-400';
    default:
      return 'text-blue-500 dark:text-blue-400';
  }
}

export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'personal':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'official':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'utility':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'insurance':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
    case 'medical':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}