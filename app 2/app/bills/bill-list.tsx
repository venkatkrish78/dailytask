"use client";

import { useState, useEffect } from "react";
import { BillPayment } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Plus, 
  Search, 
  Filter, 
  CreditCard, 
  X, 
  SortAsc, 
  SortDesc,
  Calendar,
  Tag,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BillCard from "@/components/bill-card";
import BillForm from "@/components/bill-form";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface BillListProps {
  initialBills: BillPayment[];
}

type SortOption = "dueDate" | "amount" | "createdAt";
type SortDirection = "asc" | "desc";

export default function BillList({ initialBills }: BillListProps) {
  const [bills, setBills] = useState<BillPayment[]>(initialBills);
  const [filteredBills, setFilteredBills] = useState<BillPayment[]>(initialBills);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillPayment | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [recurringFilter, setRecurringFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    let result = [...bills];

    // Apply tab filter (all, pending, paid)
    if (activeTab === "pending") {
      result = result.filter((bill) => !bill.isPaid);
    } else if (activeTab === "paid") {
      result = result.filter((bill) => bill.isPaid);
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((bill) => bill.category === categoryFilter);
    }

    // Apply recurring filter
    if (recurringFilter !== "all") {
      if (recurringFilter === "recurring") {
        result = result.filter((bill) => bill.isRecurring);
      } else {
        result = result.filter((bill) => !bill.isRecurring);
      }
    }

    // Apply currency filter
    if (currencyFilter !== "all") {
      result = result.filter((bill) => bill.currency === currencyFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (bill) =>
          bill.title.toLowerCase().includes(query) ||
          (bill.notes && bill.notes.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        return sortDirection === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else {
        // createdAt
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredBills(result);
  }, [bills, searchQuery, activeTab, sortBy, sortDirection, categoryFilter, recurringFilter, currencyFilter]);

  const handleOpenForm = (bill: BillPayment | null = null) => {
    setSelectedBill(bill);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedBill(null);
    setIsFormOpen(false);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const pendingCount = bills.filter((bill) => !bill.isPaid).length;
  const paidCount = bills.filter((bill) => bill.isPaid).length;
  
  const totalPendingAmount = bills
    .filter((bill) => !bill.isPaid)
    .reduce((sum, bill) => sum + bill.amount, 0);

  const categories = Array.from(new Set(bills.map((bill) => bill.category)));
  const currencies = Array.from(new Set(bills.map((bill) => bill.currency)));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <CreditCard className="mr-2 h-8 w-8 text-primary" />
            Bill Payments
          </h1>
          <p className="text-muted-foreground">
            Track and manage your recurring and one-time bill payments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button onClick={() => handleOpenForm()} className="mt-4 md:mt-0">
            <Plus className="mr-2 h-4 w-4" /> Add New Bill
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center">
                All Bills
                <Badge variant="secondary" className="ml-2 bg-secondary">
                  {bills.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center">
                Pending
                <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  {pendingCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="paid" className="flex items-center">
                Paid
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  {paidCount}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-[200px] md:w-[300px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {activeTab === "pending" && (
            <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-amber-800 dark:text-amber-300 font-medium">Total Pending Amount:</span>
                </div>
                <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                  {formatCurrency(totalPendingAmount, "INR")}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={recurringFilter} onValueChange={setRecurringFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                  <SelectItem value="createdAt">Created Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleSortDirection}
              className="h-10 w-10"
            >
              {sortDirection === "asc" ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            {filteredBills.length > 0 ? (
              <div 
                ref={ref}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredBills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onEdit={handleOpenForm}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 bg-accent/30 rounded-lg">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No bills found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No bills match your search criteria"
                    : "You haven't created any bills yet"}
                </p>
                <Button onClick={() => handleOpenForm()}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Bill
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-0">
            {filteredBills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredBills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onEdit={handleOpenForm}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 bg-accent/30 rounded-lg">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No pending bills</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No pending bills match your search criteria"
                    : "You've paid all your bills!"}
                </p>
                <Button onClick={() => handleOpenForm()}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Bill
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paid" className="mt-0">
            {filteredBills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredBills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onEdit={handleOpenForm}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 bg-accent/30 rounded-lg">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No paid bills</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "No paid bills match your search criteria"
                    : "You haven't paid any bills yet"}
                </p>
                <Button onClick={() => handleOpenForm()}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Bill
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBill ? "Edit Bill" : "Create New Bill"}
            </DialogTitle>
          </DialogHeader>
          <BillForm bill={selectedBill} onClose={handleCloseForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
}