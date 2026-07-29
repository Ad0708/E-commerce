"use client";

import ProductsTable from "@/components/admin/products/ProductsTable";
import ProductTableSkeleton from "@/components/admin/products/ProductTableSkeleton";
import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/Search";
import { categories } from "@/constants/categories";
import { useallProducts } from "@/hooks/product/useAllProduct";
// import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/types/product";
import { ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const [productsList, setProductsList] = useState<Product[]>([]);

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
  // const { mutateAsync: deleteProduct } = useDeleteProduct();
  // 2. Triggered when clicking "Delete Product" in Modal
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      // await deleteProduct(productToDelete);

      // Optimistic UI
      setProductsList((prev) => prev.filter((p) => p._id !== productToDelete));

      setProductToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Triggered when closing or canceling the Modal
  const cancelDelete = () => {
    setProductToDelete(null);
  };

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
              <div className="relative flex-1 md:min-w-40 md:flex-initial">
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
              <div className="relative flex-1 md:min-w-35 md:flex-initial">
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
          {isLoading && <ProductTableSkeleton />}
          {!isLoading && (
            <ProductsTable
              productsList={productsList}
              isUpdating={isUpdating}
              handleStatusToggle={handleStatusToggle}
              handleFeaturedToggle={handleFeaturedToggle}
              handleDeleteClick={handleDeleteClick}
            />
          )}
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
