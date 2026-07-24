// app/admin/customers/[customerId]/page.tsx
"use client";

import React from "react";

import { use } from "react";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { useCustomer } from "@/hooks/admin/customers/useCustomers";
import { CustomerStatusBadge } from "@/components/admin/customers/CustomerStatusBadge";
import Link from "next/link";
import { useParams } from "next/navigation";



export default function CustomerDetailPage() {
  const params = useParams<{ customerId: string }>();

  const { data, isLoading } = useCustomer(params.customerId);

  if (!data) {
    return <div>Customer not found.</div>;
  }

  const { customer, statistics, orders, addresses } = data;

  console.log("statistics", statistics);
  console.log("addresses", addresses);
  console.log("orders", orders);
  console.log("customer", customer);

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-pulse">
        <div className="h-4 w-24 bg-slate-200 dark:bg-zinc-800 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-zinc-800 rounded-2xl lg:col-span-1" />
          <div className="h-64 bg-slate-200 dark:bg-zinc-800 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6 text-slate-900 dark:text-zinc-100">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Profile Information */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xl text-slate-600 dark:text-zinc-300 overflow-hidden mb-3">
              {customer?.avatar ? (
                <img
                  src={customer.avatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8" />
              )}
            </div>
            <h2 className="text-lg font-bold">{customer?.name}</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {customer?.email}
            </p>
            <div className="mt-3">
              <CustomerStatusBadge isBlocked={customer?.isBlocked} />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Joined
              </span>
              <span className="font-medium text-slate-900 dark:text-zinc-200">
                {customer?.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString("en-IN")
                  : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Total Orders
              </span>
              <span className="font-medium text-slate-900 dark:text-zinc-200">
                {statistics?.totalOrders ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Total Spent
              </span>
              <span className="font-medium text-slate-900 dark:text-zinc-200">
                ₹{(statistics?.totalSpent ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Detailed metrics and tables */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Last Order Date
              </span>
              <p className="text-lg font-bold mt-1">
                {statistics?.lastOrderDate
                  ? new Date(statistics.lastOrderDate).toLocaleDateString(
                      "en-IN",
                    )
                  : "No Orders Yet"}
              </p>
            </div>
            <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Saved Addresses
              </span>
              <p className="text-lg font-bold mt-1">
                {addresses?.length ?? 0} Address(es)
              </p>
            </div>
          </div>

          {/* Addresses Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" /> Saved Addresses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses && addresses.length > 0 ? (
                addresses.map((addr: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm relative"
                  >
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                        Default
                      </span>
                    )}
                    <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                      {addr.fullName || customer?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
                      {addr.postalCode}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2">
                      Phone: {addr.phone || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center text-sm text-slate-400">
                  No addresses saved.
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-400" /> Recent Orders
            </h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      <th className="p-4 pl-5">Order ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 pr-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-zinc-300">
                    {orders && orders.length > 0 ? (
                      orders.map((order: any) => (
                        <tr
                          key={order.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="p-4 pl-5 font-semibold text-slate-900 dark:text-zinc-100">
                            {order.orderNumber}
                          </td>
                          <td className="p-4 text-slate-500 dark:text-zinc-400">
                            {new Date(order.date).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-4">{order.itemCount} item(s)</td>
                          <td className="p-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200">
                              {order.status}
                            </span>
                          </td>
                          <td className="p-4 font-semibold">
                            ₹{order.summary.total.toLocaleString()}
                          </td>
                          <td className="p-4 pr-5 text-right">
                            <Link
                              href={`/admin/orders/${order._id}`}
                              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              View Order
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-8 text-center text-slate-400"
                        >
                          No recent orders registered for this customer.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
