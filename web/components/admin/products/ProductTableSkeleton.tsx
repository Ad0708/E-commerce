import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust import path according to your structure

interface ProductTableSkeletonProps {
  rowCount?: number;
}

export default function ProductTableSkeleton({
  rowCount = 5,
}: ProductTableSkeletonProps) {
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
        {Array.from({ length: rowCount }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            {/* PRODUCT */}
            <TableCell>
              <div className="flex items-center gap-3">
                {/* Thumbnail Skeleton */}
                <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800" />
                {/* Title & SKU/ID Skeleton */}
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="h-4 w-36 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-20 rounded-md bg-slate-100 dark:bg-slate-800/60" />
                </div>
              </div>
            </TableCell>

            {/* CATEGORY */}
            <TableCell>
              <div className="h-6 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
            </TableCell>

            {/* PRICE */}
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="h-4 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-12 rounded-md bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </TableCell>

            {/* STOCK */}
            <TableCell>
              <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
            </TableCell>

            {/* STATUS */}
            <TableCell>
              <div className="flex items-center gap-2">
                {/* Switch Toggle Skeleton */}
                <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-12 rounded-md bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </TableCell>

            {/* FEATURED */}
            <TableCell>
              <div className="flex items-center gap-2">
                {/* Switch Toggle Skeleton */}
                <div className="h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-3.5 w-14 rounded-md bg-slate-100 dark:bg-slate-800/60" />
              </div>
            </TableCell>

            {/* ACTIONS */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <div className="h-7 w-7 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
