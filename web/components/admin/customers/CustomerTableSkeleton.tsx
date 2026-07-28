import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust import path as needed

interface CustomerTableSkeletonProps {
  rowCount?: number;
}

export default function CustomerTableSkeleton({
  rowCount = 5,
}: CustomerTableSkeletonProps) {
  return (
    <Table
      className="min-w-full"
      containerClassName="max-h-[calc(100vh-23.7rem)]"
    >
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-center">Orders</TableHead>
          <TableHead>Total Spent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {Array.from({ length: rowCount }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            {/* Customer Avatar + Name & Role */}
            <TableCell>
              <div className="flex items-center gap-3">
                {/* Circular Initial Avatar */}
                <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800" />

                {/* Name & Role Stack */}
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-16 rounded bg-zinc-100 dark:bg-zinc-800/60" />
                </div>
              </div>
            </TableCell>

            {/* Email */}
            <TableCell>
              <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Orders Badge */}
            <TableCell className="text-center">
              <div className="flex justify-center">
                <div className="h-6 w-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>

            {/* Total Spent */}
            <TableCell>
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Status Pill */}
            <TableCell>
              <div className="h-6 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Joined Date */}
            <TableCell>
              <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            </TableCell>

            {/* Action Buttons (View, Edit, Block/Unblock) */}
            <TableCell>
              <div className="flex justify-end gap-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
