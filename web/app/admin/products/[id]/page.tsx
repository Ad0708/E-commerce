"use client";

import { useParams, useRouter } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";

export default function AdminProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const { mutate: deleteProduct } = useDeleteProduct();


  return (
    <ProductDetails
      id={id as string}
      isAdmin={true}
      actions={(product) => (
        <div className="flex gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
          >
            Edit
          </button>

          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={() =>
              deleteProduct(product._id, {
                onSuccess: () => router.push("/admin/products"),
              })
            }
          >
            Delete
          </button>
        </div>
      )}
    />
  );
}
