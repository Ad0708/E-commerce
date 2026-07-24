"use client";

import Link from "next/link";
import { WalletCards, ArrowDownLeft, ArrowUpRight, ArrowLeft } from "lucide-react";
import { useWallet } from "@/hooks/wallet/useWallet";

interface Transaction {
  _id: string;
  type: "CREDIT" | "DEBIT";
  reason: string;
  amount: number;
  createdAt: string;
}

export default function WalletPage() {
  const { data, isLoading } = useWallet();

  if (isLoading) {
    return <WalletSkeletonLoader />;
  }

  const wallet = data?.wallet;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      
      {/* Top Navigation Row */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </div>

      <div className="space-y-8">
        {/* Header Summary Section */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Account Wallet
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Manage your balance and track transaction histories
            </p>
          </div>
          
          {/* Minimalist Balance Box */}
          <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950 sm:w-64">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-50 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                <WalletCards size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
                  Available Balance
                </p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                  ₹{(wallet?.balance ?? 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div>
          <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800/80">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Recent Transactions
            </h2>
            <span className="text-[11px] text-zinc-400">
              {wallet?.transactions?.length ?? 0} total
            </span>
          </div>

          <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
            {wallet?.transactions?.length ? (
              wallet.transactions.map((transaction: Transaction) => {
                const isCredit = transaction.type === "CREDIT";
                return (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between py-4 transition-colors hover:bg-zinc-50/40 dark:hover:bg-zinc-900/20 px-2 rounded-lg -mx-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isCredit
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {transaction.reason}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                          {new Date(transaction.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="pl-3 text-right">
                      <p
                        className={`text-sm font-semibold tracking-tight ${
                          isCredit
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {isCredit ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-2xl mb-2">💸</span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  No activity found
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Your transaction ledger is currently empty.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Shimmer Skeleton UI matching the layout footprint
function WalletSkeletonLoader() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 animate-pulse">
      <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded mb-8" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
          <div className="h-3 w-56 bg-zinc-100 dark:bg-zinc-900 rounded" />
        </div>
        <div className="h-20 w-full sm:w-64 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200/40 dark:border-zinc-800/60" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-900 rounded pb-2 border-b" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900" />
              <div className="space-y-2 w-1/3">
                <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-2 w-1/2 bg-zinc-100 dark:bg-zinc-900 rounded" />
              </div>
            </div>
            <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}