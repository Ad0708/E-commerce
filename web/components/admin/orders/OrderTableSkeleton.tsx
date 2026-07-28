import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust import path according to your structure

interface OrderTableSkeletonProps {
  rowCount?: number;
}

export default function OrderTableSkeleton({
  rowCount = 5,
}: OrderTableSkeletonProps) {
  return (
    <Table containerClassName="min-h-50 md:min-h-0 max-h-[calc(100vh-25rem)]">
      <TableHeader>
        <TableRow>
          <TableHead>Order Reference</TableHead>
          <TableHead>Customer info</TableHead>
          <TableHead className="text-center">Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Payment Strategy</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rowCount }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            {/* Order Reference */}
            <TableCell>
              <div className="h-4 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Customer Info */}
            <TableCell>
              <div className="space-y-1.5">
                <div className="h-4 w-28 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-36 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
              </div>
            </TableCell>

            {/* Items Counter Badge */}
            <TableCell className="text-center">
              <div className="mx-auto h-5 w-12 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Total Amount */}
            <TableCell>
              <div className="h-4 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Payment Details */}
            <TableCell>
              <div className="space-y-1.5">
                <div className="h-3.5 w-14 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-2.5 w-12 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
              </div>
            </TableCell>

            {/* Order Status */}
            <TableCell>
              <div className="h-6 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Created Date */}
            <TableCell>
              <div className="h-3.5 w-20 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
