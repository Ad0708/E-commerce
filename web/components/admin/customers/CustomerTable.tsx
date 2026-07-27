"use client";

import Link from "next/link";
import { Edit3, Eye, ShieldBan, ShieldCheck } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

import { Customer } from "@/api/admin/customer";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onBlock: (customer: Customer) => void;
  onUnblock: (customer: Customer) => void;
}

export default function CustomerTable({
  customers,
  onEdit,
  onBlock,
  onUnblock,
}: CustomerTableProps) {
  return (
    <Table className="min-w-full ">
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-center">Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="py-12 text-center text-zinc-500">
              No customers found.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((customer) => (
            <TableRow key={customer._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {customer.name}
                    </p>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {customer.role}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell>{customer.email}</TableCell>

              <TableCell className="text-center">
                <span className="inline-flex rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800">
                  {customer.orderCount}
                </span>
              </TableCell>

              <TableCell className="font-semibold">
                ₹{customer.totalSpent.toLocaleString()}
              </TableCell>

              <TableCell>
                {customer.isBlocked ? (
                  <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    Blocked
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                )}
              </TableCell>

              <TableCell>
                {new Date(customer.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>

              <TableCell>
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/customers/${customer._id}`}
                    className="rounded-lg border border-zinc-200 p-2 transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    title="View"
                  >
                    <Eye size={16} />
                  </Link>

                  <button
                    onClick={() => onEdit(customer)}
                    className="rounded-lg border border-zinc-200 p-2 transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>

                  {customer.isBlocked ? (
                    <button
                      onClick={() => onUnblock(customer)}
                      className="rounded-lg border border-green-200 p-2 text-green-600 transition hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20"
                      title="Unblock"
                    >
                      <ShieldCheck size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onBlock(customer)}
                      className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      title="Block"
                    >
                      <ShieldBan size={16} />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
