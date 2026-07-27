"use client";

import { useMemo, useState } from "react";

import CustomerEditModal from "@/components/admin/customers/CustomerEditModal";
import CustomerStats from "@/components/admin/customers/CustomerStats";
import CustomerTable from "@/components/admin/customers/CustomerTable";

import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/Search";

import {
  useBlockCustomer,
  useCustomers,
  useUnblockCustomer,
} from "@/hooks/admin/customers/useCustomers";

import { Customer } from "@/api/admin/customer";
import Modal from "@/components/common/Modal";
import { useDebounce } from "@/hooks/useDebounce";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useCustomers({
    page,
    limit,
    search: debouncedSearch,
  });

  const { mutate: blockCustomer } = useBlockCustomer();
  const { mutate: unblockCustomer } = useUnblockCustomer();

  const customers = data?.customers ?? [];
  const pagination = data?.pagination;

  const activeCustomers = useMemo(
    () => customers.filter((customer) => !customer.isBlocked).length,
    [customers],
  );

  const blockedCustomers = useMemo(
    () => customers.filter((customer) => customer.isBlocked).length,
    [customers],
  );

  const newCustomers = useMemo(() => {
    const now = new Date();

    return customers.filter((customer) => {
      const joined = new Date(customer.createdAt);

      return (
        joined.getMonth() === now.getMonth() &&
        joined.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [customers]);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditOpen(true);
  };

  const [confirmation, setConfirmation] = useState<{
    isOpen: boolean;
    type: "block" | "unblock" | null;
    customer: Customer | null;
  }>({
    isOpen: false,
    type: null,
    customer: null,
  });

  const handleBlock = (customer: Customer) => {
    setConfirmation({
      isOpen: true,
      type: "block",
      customer,
    });
  };

  const handleUnblock = (customer: Customer) => {
    setConfirmation({
      isOpen: true,
      type: "unblock",
      customer,
    });
  };

  const handleConfirm = () => {
    if (!confirmation.customer) return;

    if (confirmation.type === "block") {
      blockCustomer(confirmation.customer._id);
    }

    if (confirmation.type === "unblock") {
      unblockCustomer(confirmation.customer._id);
    }

    setConfirmation({
      isOpen: false,
      type: null,
      customer: null,
    });
  };

  return (
    /* Main wrapper container filling out the dashboard area */
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-125 text-slate-900 dark:text-slate-50 space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Customers
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage customers, edit profiles and control account access.
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <CustomerStats
        total={pagination?.total ?? 0}
        active={activeCustomers}
        blocked={blockedCustomers}
        newCustomers={newCustomers}
      />

      {/* FIXED POSITION SEARCH BAR: Sit outside the conditional matrix container completely */}
      <div className="w-full max-w-sm shrink-0">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search customers..."
        />
      </div>

      {/* Operational Matrix Rendering Wrapper */}
      <div className="w-full flex-1 flex flex-col justify-between min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 my-auto">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : customers.length === 0 ? (
          /* Centers empty states flawlessly since the search component is decoupled */
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md mx-auto bg-zinc-50/40 dark:bg-zinc-900/10 my-auto w-full">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-xl">
              👥
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
              No customers found
            </h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-63 text-center">
              {search
                ? `No execution parameters match "${search}"`
                : "Try changing your search or check back later."}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between min-h-100 space-y-4">
            <CustomerTable
              customers={customers}
              onEdit={handleEdit}
              onBlock={handleBlock}
              onUnblock={handleUnblock}
            />

            {pagination && (
              <div className="shrink-0">
                <Pagination
                  page={pagination.page}
                  total={pagination.total}
                  limit={pagination.limit}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Layers Context Injection */}
      <CustomerEditModal
        open={editOpen}
        customer={selectedCustomer}
        onClose={() => {
          setEditOpen(false);
          setSelectedCustomer(null);
        }}
      />
      <Modal
        isOpen={confirmation.isOpen}
        onClose={() =>
          setConfirmation({
            isOpen: false,
            type: null,
            customer: null,
          })
        }
        onConfirm={handleConfirm}
        title={
          confirmation.type === "block"
            ? "Block Customer?"
            : "Unblock Customer?"
        }
        description={
          confirmation.type === "block"
            ? `Are you sure you want to block "${confirmation.customer?.name}"? They won't be able to login.`
            : `Are you sure you want to unblock "${confirmation.customer?.name}"?`
        }
        confirmText={
          confirmation.type === "block" ? "Block Customer" : "Unblock Customer"
        }
      />
    </div>
  );
}
