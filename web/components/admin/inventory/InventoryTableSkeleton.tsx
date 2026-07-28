import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust import path as needed

interface InventoryTableSkeletonProps {
  rowCount?: number;
}

export default function InventoryTableSkeleton({
  rowCount = 5,
}: InventoryTableSkeletonProps) {
  return (
    <Table containerClassName="w-full max-h-[calc(100vh-33rem)]!">
      <TableHeader>
        <TableRow>
          {/* Explicitly defined width distributions matching your main table */}
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
        {Array.from({ length: rowCount }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            {/* Product Info Column */}
            <TableCell>
              <div className="flex items-center gap-3 min-w-0">
                {/* Image Placeholder */}
                <div className="w-9 h-9 rounded-xl shrink-0 bg-zinc-200 dark:bg-zinc-800" />
                {/* Product Title Placeholder */}
                <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>

            {/* Brand Column */}
            <TableCell className="hidden sm:table-cell">
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Category Tag */}
            <TableCell className="hidden md:table-cell">
              <div className="h-5 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* SKU */}
            <TableCell className="hidden md:table-cell">
              <div className="h-3.5 w-14 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Price */}
            <TableCell className="text-right hidden md:table-cell">
              <div className="h-4 w-16 ml-auto rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Status Badge */}
            <TableCell className="text-center">
              <div className="flex justify-center items-center h-full">
                <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>

            {/* Stock Editor */}
            <TableCell className="text-right">
              <div className="flex justify-end items-center h-full">
                <div className="h-8 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
