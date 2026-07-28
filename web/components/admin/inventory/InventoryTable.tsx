"use client";

import { useUpdateStock } from "@/hooks/admin/inventory/useInventory";
import React, { useRef, useState } from "react";
import { InventoryProduct } from "@/types/inventory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";

interface InventoryTableProps {
  data: any;
}

export default function InventoryTable({
  data,
}: InventoryTableProps) {
  function StockBadge({ stock }: { stock: number }) {
    if (stock === 0)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Out of stock
        </span>
      );
    if (stock <= 10)
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Low stock
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        In stock
      </span>
    );
  }

  function StockEditor({ product }: { product: InventoryProduct }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(String(product.stock));
    const [saved, setSaved] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutate, isPending } = useUpdateStock();

    const open = () => {
      setValue(String(product.stock));
      setEditing(true);
      setTimeout(() => inputRef.current?.select(), 0);
    };

    const cancel = () => {
      setEditing(false);
      setValue(String(product.stock));
    };

    const save = () => {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed) || parsed < 0) return;
      if (parsed === product.stock) {
        setEditing(false);
        return;
      }
      mutate(
        { productId: product._id, stock: parsed },
        {
          onSuccess: (data) => {
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          },
        },
      );
    };

    const onKey = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") save();
      if (e.key === "Escape") cancel();
    };

    if (editing) {
      return (
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            disabled={isPending}
            className="w-20 text-sm text-right rounded-lg border border-blue-400 dark:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
          />
          <button
            onClick={save}
            disabled={isPending}
            className="p-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            aria-label="Save stock"
          >
            {isPending ? (
              <span className="block w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  d="M3 8l3.5 3.5L13 4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
          <button
            onClick={cancel}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cancel"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={open}
        className="group flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <span className={saved ? "text-green-600 dark:text-green-400" : ""}>
          {product.stock}
        </span>
        <svg
          className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors opacity-0 group-hover:opacity-100"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            d="M11 2.5l2.5 2.5-8 8H3v-2.5l8-8z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }


  if (!data?.products?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-64 text-slate-400 dark:text-slate-500">
        <svg
          className="w-8 h-8 opacity-40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M8 3v18M16 3v18M2 9h20M2 15h20" />
        </svg>
        <span className="text-sm">No products found</span>
      </div>
    );
  }

  return (
    <Table containerClassName="w-full max-h-[calc(100vh-33rem)]!">
      <TableHeader>
        <TableRow>
          {/* Explicitly defined width distributions */}
          <TableHead className="w-[30%]">Product</TableHead>
          <TableHead className="w-[15%] hidden sm:table-cell">Brand</TableHead>
          <TableHead className="w-[15%] hidden md:table-cell">
            Category
          </TableHead>
          <TableHead className="w-[12%] hidden md:table-cell">SKU</TableHead>
          <TableHead className="w-[13%] text-right hidden md:table-cell">
            Price
          </TableHead>
          <TableHead className="w-[15%] text-center">Status</TableHead>
          <TableHead className="w-[15%] text-right">Stock</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.products.map((product: any) => (
          <TableRow key={product._id}>
            {/* Product Info Column */}
            <TableCell>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-700/50">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 dark:text-zinc-600">
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <rect
                          x="1"
                          y="1"
                          width="14"
                          height="14"
                          rx="2"
                          fillOpacity={0.3}
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {/* 'truncate' prevents long names from expanding the row height */}
                <span className="font-medium text-zinc-900 dark:text-white truncate max-w-50">
                  {product.name}
                </span>
              </div>
            </TableCell>

            {/* Brand Column */}
            <TableCell className="text-zinc-500 dark:text-slate-400 hidden sm:table-cell truncate">
              {product.brand}
            </TableCell>

            {/* Category tag */}
            <TableCell className="hidden md:table-cell truncate">
              {product.category ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {product.category}
                </span>
              ) : (
                <span className="text-slate-300 dark:text-slate-600">—</span>
              )}
            </TableCell>

            {/* SKU */}
            <TableCell className="hidden md:table-cell font-mono text-xs text-zinc-400 dark:text-zinc-500 truncate">
              {product.sku ?? "—"}
            </TableCell>

            {/* Price */}
            <TableCell className="text-right font-medium text-zinc-900 dark:text-white hidden md:table-cell">
              ₹
              {(product.discountPrice ?? product.price).toLocaleString("en-IN")}
            </TableCell>

            {/* Status Badge */}
            <TableCell className="text-center">
              <div className="flex justify-center items-center h-full">
                <StockBadge stock={product.stock} />
              </div>
            </TableCell>

            {/* Stock Inline Editor */}
            <TableCell className="text-right">
              <div className="flex justify-end items-center h-full">
                <StockEditor product={product} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
