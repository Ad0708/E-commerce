import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust import path as needed

interface CouponTableSkeletonProps {
  rowCount?: number;
}

export default function CouponTableSkeleton({
  rowCount = 5,
}: CouponTableSkeletonProps) {
  return (
    <Table
      className="min-w-full min-h-40"
      containerClassName="max-h-[calc(100vh-23.7rem)]"
    >
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-950">
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Type & Value</TableHead>
          <TableHead>Applies To</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Valid Until</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rowCount }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            {/* Code Box Placeholder */}
            <TableCell>
              <div className="h-8 w-28 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Type & Value */}
            <TableCell>
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Applies To */}
            <TableCell>
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Usage */}
            <TableCell>
              <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Valid Until */}
            <TableCell>
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Status Badge */}
            <TableCell>
              <div className="h-6 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Actions (Edit & Delete Buttons) */}
            <TableCell className="text-right">
              <div className="inline-flex gap-3 justify-end items-center">
                <div className="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
