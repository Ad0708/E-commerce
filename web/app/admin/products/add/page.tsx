"use client";

import ProductForm from "@/components/admin/products/ProductsForm";
import { useRouter } from "next/navigation";

import { useCreateProduct } from "@/hooks/product/useCreateProduct";
import { ProductFormValues } from "@/lib/validators/product.schema";
export default function AddProductPage() {
  const router = useRouter();

  const createProductMutation = useCreateProduct();

const handleSubmit = (
  data: ProductFormValues,
) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("category", data.category);
  formData.append("description", data.description);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());

  formData.append(
    "discountPrice",
    data.discountPrice?.toString() || "",
  );

  formData.append("brand", data.brand || "");
  formData.append("sku", data.sku || "");

  formData.append(
    "featured",
    String(data.featured),
  );

  formData.append("status", data.status);

  data.images.forEach((image) => {
    formData.append("images", image);
  });

  createProductMutation.mutate(formData);

  if (!createProductMutation.isError) {
    router.push("/admin/products");
  }
};
  return (
    <div className="space-y-8">
      <ProductForm
        mode="create"
        loading={createProductMutation.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
