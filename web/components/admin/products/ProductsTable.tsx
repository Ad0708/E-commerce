"use client";

import Image from "next/image";

import { Edit, Eye, ImageIcon, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { Product } from "@/types/product";
import Link from "next/link";

interface ProductsTableProps {
  productsList: Product[];
  isUpdating: boolean;
  handleStatusToggle: (product: Product) => void;
  handleFeaturedToggle: (product: Product) => void;
  handleDeleteClick: (productId: string) => void;
}

export default function ProductsTable({
  productsList,
  isUpdating,
  handleStatusToggle,
  handleFeaturedToggle,
  handleDeleteClick,
}: ProductsTableProps) {
  return (
    <Table containerClassName="max-h-[calc(100vh-23rem)]">
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status (Active/Draft)</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {productsList.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="py-12 text-center text-slate-500 dark:text-slate-400"
            >
              No products found matching your filter criteria.
            </TableCell>
          </TableRow>
        ) : (
          productsList.map((product) => {
            const isActive = product.status === "active";
            const isFeatured = Boolean(product.featured);
            const imageUrl = product.images?.[0];

            return (
              <TableRow key={product._id}>
                {/* PRODUCT */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon size={18} className="text-slate-400" />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <span className="max-w-50 truncate font-semibold text-slate-900 dark:text-slate-100">
                        {product.name}
                      </span>

                      <span className="text-xs text-slate-400">
                        {product.sku
                          ? `SKU: ${product.sku}`
                          : `ID: ${product._id.substring(0, 8)}...`}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* CATEGORY */}
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {product.category || "Uncategorized"}
                  </span>
                </TableCell>

                {/* PRICE */}
                <TableCell>
                  <div className="flex flex-col">
                    {product.discountPrice ? (
                      <>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          ₹
                          {Number(
                            product.discountPrice || product.price || 0,
                          ).toFixed(2)}
                        </span>

                        <span className="text-xs text-emerald-600 line-through dark:text-emerald-400">
                          ₹{Number(product.price).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        ₹{Number(product.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* STOCK */}
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      (product.stock ?? 0) > 10
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                        : (product.stock ?? 0) > 0
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                    }`}
                  >
                    {product.stock ?? 0} in stock
                  </span>
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isActive}
                      disabled={isUpdating}
                      onClick={() => handleStatusToggle(product)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                        isActive
                          ? "bg-blue-600"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    <span className="text-xs font-medium capitalize text-slate-600 dark:text-slate-400">
                      {product.status}
                    </span>
                  </div>
                </TableCell>

                {/* FEATURED */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={isFeatured}
                      disabled={isUpdating}
                      onClick={() => handleFeaturedToggle(product)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 ${
                        isFeatured
                          ? "bg-cyan-500"
                          : "bg-slate-300 dark:bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                          isFeatured ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {isFeatured ? "Featured" : "Standard"}
                    </span>
                  </div>
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/product/${product._id}`}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/admin/products/edit/${product._id}`}
                      title="Edit product"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                    >
                      <Edit size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(product._id)}
                      title="Delete product"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
