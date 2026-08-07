import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { Loader2, Star, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ReviewsTableProps {
  data: any;
  isLoading: boolean;
}

export default function ReviewsTable({ data, isLoading }: ReviewsTableProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <Table containerClassName="max-h-[calc(100vh-23rem)]">
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Average Rating</TableHead>
            <TableHead>Total Reviews</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center">
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
              </TableCell>
            </TableRow>
          ) : data?.products?.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-64 text-center text-slate-500 dark:text-slate-400"
              >
                No products found with reviews.
              </TableCell>
            </TableRow>
          ) : (
            data?.products?.map((product: any) => (
              <TableRow key={product._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <Star size={16} />
                        </div>
                      )}
                    </div>
                    <span
                      className="font-medium text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-[250px] md:max-w-[300px]"
                      title={product.name}
                    >
                      {product.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {product.category}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.averageRating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {product.totalReviews} reviews
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/admin/reviews/${product._id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
