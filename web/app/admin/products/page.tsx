"use client";

import Link from "next/link";
import { categories } from "@/constants/categories";
import { useallProducts } from "@/hooks/product/useAllProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import SearchInput from "@/components/common/Search";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/common/Table";
import Image from "next/image";
import { Product } from "@/types/product";
import Modal from "@/components/common/Modal";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [limit, setLimit] = useState(10);

  // State to manage modal visibility and target product ID
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  // Fetch products query hook
  const {
    data: productsData,
    isLoading,
    error,
  } = useallProducts({
    page,
    search: debouncedSearch,
    category,
    limit,
    status,
  });

  // Update product mutation hook
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // Local state array for optimistic rendering
  const [productsList, setProductsList] = useState<Product[]>([]);

  // Sync API response with local state when query completes/refetches
  useEffect(() => {
    if (productsData?.products) {
      setProductsList(productsData.products);
    }
  }, [productsData]);

  const apiData = productsData || {
    pagination: {
      total: 0,
      totalPages: 1,
      page: 1,
      limit: 10,
    },
  };

  const handleStatusToggle = (product: Product) => {
    const nextStatus: Product["status"] =
      product.status === "active" ? "draft" : "active";

    // 1. Optimistic UI update so switch slides immediately
    setProductsList((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, status: nextStatus } : p,
      ),
    );

    // 2. Build complete FormData instance to satisfy Zod validation
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("description", product.description || "");
    formData.append("price", String(product.price));
    formData.append("stock", String(product.stock));
    formData.append("featured", String(product.featured));
    formData.append("status", nextStatus);

    if (product.brand) formData.append("brand", product.brand);
    if (product.sku) formData.append("sku", product.sku);
    if (product.discountPrice !== undefined) {
      formData.append("discountPrice", String(product.discountPrice));
    }

    // 3. Pass FormData object directly to the hook
    updateProduct(
      { id: product._id, data: formData },
      {
        onError: () => {
          // Revert local state if request fails
          setProductsList((prev) =>
            prev.map((p) =>
              p._id === product._id ? { ...p, status: product.status } : p,
            ),
          );
        },
      },
    );
  };

  // FEATURED TOGGLE (boolean)
  const handleFeaturedToggle = (product: Product) => {
    const nextFeatured = !product.featured;

    // 1. Optimistic UI update
    setProductsList((prev) =>
      prev.map((p) =>
        p._id === product._id ? { ...p, featured: nextFeatured } : p,
      ),
    );

    // 2. Build complete FormData instance
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("description", product.description || "");
    formData.append("price", String(product.price));
    formData.append("stock", String(product.stock));
    formData.append("featured", String(nextFeatured));
    formData.append("status", product.status);

    if (product.brand) formData.append("brand", product.brand);
    if (product.sku) formData.append("sku", product.sku);
    if (product.discountPrice !== undefined) {
      formData.append("discountPrice", String(product.discountPrice));
    }

    // 3. Pass FormData object directly to the hook
    updateProduct(
      { id: product._id, data: formData },
      {
        onError: () => {
          // Revert local state if request fails
          setProductsList((prev) =>
            prev.map((p) =>
              p._id === product._id ? { ...p, featured: product.featured } : p,
            ),
          );
        },
      },
    );
  };

  // 1. Triggered when clicking the trash icon
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  // 2. Triggered when clicking "Delete Product" in Modal
  const confirmDelete = async () => {
    if (!productToDelete) return;

    // Optimistic local state update
    setProductsList((prev) => prev.filter((p) => p._id !== productToDelete));

    // TODO: Trigger your delete mutation here if available
    // deleteProduct({ id: productToDelete });

    // Close the Modal
    setProductToDelete(null);
  };

  // 3. Triggered when closing or canceling the Modal
  const cancelDelete = () => {
    setProductToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium text-slate-500 animate-pulse">
        Loading admin products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium text-red-500">
        Failed to load products. Please check server connections.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-10rem)] min-h-124 text-slate-900 dark:text-slate-50">
        {/* ============ FIXED TOP WRAPPER (Header + Filters) ============ */}
        <div className="shrink-0 space-y-4 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Products</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your store products and inventory status
              </p>
            </div>

            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-md shadow-blue-500/10 transition hover:opacity-95 active:scale-95 text-sm"
            >
              <Plus size={16} /> Add Product
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 w-full">
              <SearchInput
                value={search}
                onChange={(e) => {
                  setSearch(e);
                  setPage(1);
                }}
                placeholder="Search by name or SKU..."
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <div className="relative flex-1 md:min-w-[160px] md:flex-initial">
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Status Filter */}
              <div className="relative flex-1 md:min-w-[140px] md:flex-initial">
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============ MIDDLE LAYER (TABLE) ============ */}
        <div className="flex-1 overflow-hidden">
          <Table>
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
                    className="text-center py-12 text-slate-500 dark:text-slate-400"
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
                      {/* Image & Title */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-center">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <ImageIcon size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
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

                      {/* Category */}
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {product.category || "Uncategorized"}
                        </span>
                      </TableCell>

                      {/* Price */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            ${Number(product.price || 0).toFixed(2)}
                          </span>
                          {product.discountPrice && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 line-through">
                              ${Number(product.discountPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Stock */}
                      <TableCell>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
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

                      {/* ACTIVE / DRAFT TOGGLE SWITCH */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isActive}
                            disabled={isUpdating}
                            onClick={() => handleStatusToggle(product)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                              isActive
                                ? "bg-blue-600"
                                : "bg-slate-300 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 capitalize">
                            {product.status}
                          </span>
                        </div>
                      </TableCell>

                      {/* FEATURED TOGGLE SWITCH */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isFeatured}
                            disabled={isUpdating}
                            onClick={() => handleFeaturedToggle(product)}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 ${
                              isFeatured
                                ? "bg-cyan-500"
                                : "bg-slate-300 dark:bg-slate-700"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
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
                            href={`/products/${product._id}`}
                            target="_blank"
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            title="View product"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/products/edit/${product._id}`}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                            title="Edit product"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(product._id)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                            title="Delete product"
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
        </div>

        {/* ============ FOOTER PAGINATION ============ */}
        {apiData.pagination && (
          <div>
            <Pagination
              page={apiData.pagination.page}
              total={apiData.pagination.total}
              limit={apiData.pagination.limit}
              totalPages={apiData.pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              onLimitChange={(newLimit) => setLimit(newLimit)}
              hasNextPage={apiData.pagination.hasNextPage}
              hasPreviousPage={apiData.pagination.hasPreviousPage}
            />
          </div>
        )}
      </div>

      {/* ============ BUILT-IN MODAL COMPONENT ============ */}
      <Modal
        isOpen={Boolean(productToDelete)}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone and will remove it permanently from your store inventory."
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}