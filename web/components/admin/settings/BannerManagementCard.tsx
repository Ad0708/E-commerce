"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useAddBanner,
  useDeleteBanner,
  useUpdateBanner,
} from "@/hooks/admin/store/useAdminStore";
import { cn } from "@/lib/utils";
import type { AdminStore, Banner, BannerFormFields } from "@/types/adminStore";
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Image as ImageIcon,
  Layers,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface Props {
  store: AdminStore;
}

export function BannerManagementCard({ store }: Props) {
  const { mutate: addBanner, isPending: isAdding } = useAddBanner();
  const { mutate: updateBanner, isPending: isUpdating } = useUpdateBanner();
  const { mutate: deleteBanner, isPending: isDeleting } = useDeleteBanner();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<BannerFormFields>({
      defaultValues: {
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        active: true,
        order: (store.banners?.length ?? 0) + 1,
      },
    });

  const isActive = watch("active");

  const openAdd = () => {
    setEditingBanner(null);
    reset({
      title: "",
      subtitle: "",
      buttonText: "",
      buttonLink: "",
      active: true,
      order: (store.banners?.length ?? 0) + 1,
    });
    setSelectedImage(null);
    setPreview("");
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    console.log("Editing banner:", banner);

    setEditingBanner(banner);

    reset({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      active: banner.active ?? true,
      order: banner.order ?? 0,
    });

    setSelectedImage(null);
    setPreview(banner.image || "");

    setDialogOpen(true);
  };

  const onSubmit = (data: BannerFormFields) => {
    if (editingBanner) {
      updateBanner(
        {
          bannerId: editingBanner._id,
          ...data,
          ...(selectedImage && { image: selectedImage }),
        },
        {
          onSuccess: () => {
            toast.success("Banner updated");
            setDialogOpen(false);
            setSelectedImage(null);
            setPreview("");
          },
          onError: () =>
            toast.error("Failed to update banner. Please try again."),
        },
      );

      return;
    }

    if (!selectedImage) {
      toast.error("Please select a banner image.");
      return;
    }

    addBanner(
      {
        ...data,
        image: selectedImage,
      },
      {
        onSuccess: () => {
          toast.success("Banner added");
          setDialogOpen(false);
          setSelectedImage(null);
          setPreview("");
        },
        onError: () => toast.error("Failed to add banner. Please try again."),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteBanner(id, {
      onSuccess: () => {
        toast.success("Banner deleted");
        setDeleteId(null);
      },
      onError: () => toast.error("Failed to delete banner. Please try again."),
    });
  };

  const handleMoveTop = (banner: Banner) => {
    updateBanner(
      {
        bannerId: banner._id,
        order: 1,
      },
      {
        onSuccess: () => toast.success("Banner moved to top"),
        onError: () => toast.error("Move failed"),
      },
    );
  };

  const handleMoveBottom = (banner: Banner) => {
    const max = Math.max(...(store.banners?.map((b) => b.order) ?? [1]));
    updateBanner(
      {
        bannerId: banner._id,
        order: max + 1,
      },
      {
        onSuccess: () => toast.success("Banner moved to bottom"),
        onError: () => toast.error("Move failed"),
      },
    );
  };

  const sortedBanners = [...(store.banners ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const isMutating = isAdding || isUpdating;
  return (
    <>
      {/* <Card className="rounded-xl border-border bg-card"> */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 transition-colors dark:bg-indigo-950/40">
                <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400 dark:fill-indigo-500/10 fill-indigo-600/10" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Banner Management
                </CardTitle>
                <CardDescription className="text-xs">
                  {sortedBanners.length} banner
                  {sortedBanners.length !== 1 ? "s" : ""} configured
                </CardDescription>
              </div>
            </div>
            <Button size="sm" onClick={openAdd}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Banner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedBanners.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-14 text-center">
              <Layers className="mb-3 h-9 w-9 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                No banners yet
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">
                Add a banner to promote your store
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-4"
                onClick={openAdd}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add your first banner
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedBanners.map((banner) => (
                <div
                  key={banner._id}
                  className={cn(
                    // Solid layout border fallbacks that match the upgraded Card primitives
                    "group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 select-none shadow-sm",
                    "hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700",
                  )}
                >
                  {/* Aspect Video Image Container */}
                  <div className="relative aspect-video w-full overflow-hidden border-b border-slate-100 bg-slate-100 dark:border-slate-900 dark:bg-slate-900">
                    {banner.image ? (
                      <Image
                        src={banner.image}
                        alt={banner.title || "Banner Preview"}
                        fill
                        sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    )}

                    {/* Modern Cinematic Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Banner Text Badge Details */}
                    <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                      <p className="truncate text-sm font-semibold text-white tracking-tight antialiased drop-shadow-sm">
                        {banner.title || "Untitled"}
                      </p>
                      {banner.subtitle && (
                        <p className="truncate text-xs text-slate-200/80 antialiased font-medium">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Meta Information Footer */}
                  <div className="p-3.5 space-y-3 bg-white dark:bg-slate-950">
                    <div className="flex items-center justify-between">
                      {/* Dynamic Status Indicator */}
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide border",
                          banner.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50"
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
                        )}
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </span>

                      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                        Order #{banner.order}
                      </span>
                    </div>

                    {/* Action Row Controllers */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-50 dark:border-slate-900">
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-md border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                          onClick={() => handleMoveTop?.(banner)}
                          title="Move to top"
                        >
                          <ChevronUp className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-md border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                          onClick={() => handleMoveBottom?.(banner)}
                          title="Move to bottom"
                        >
                          <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </Button>
                      </div>

                      <div className="flex-1" />

                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-md border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                          onClick={() => openEdit?.(banner)}
                          title="Edit Banner"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7 rounded-md border-slate-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                          onClick={() => setDeleteId?.(banner._id)}
                          title="Delete Banner"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? "Edit Banner" : "Add Banner"}
            </DialogTitle>
            <DialogDescription>
              {editingBanner
                ? "Update the banner details below."
                : "Fill in the details for the new banner."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
            {/* Modernized Drag/Drop & File Input Container */}
            <div className="space-y-2">
              <Label
                htmlFor="imageUrl"
                className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Banner Image
              </Label>
              <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/20 dark:hover:bg-slate-900/40">
                <Input
                  id="imageUrl"
                  type="file"
                  accept="image/*"
                  className="h-10 cursor-pointer border-slate-200 bg-white file:border-0 file:bg-transparent file:text-sm file:font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSelectedImage(file);
                    setPreview(URL.createObjectURL(file));
                  }}
                />

                {preview && (
                  <div className="relative mt-3 w-full overflow-hidden rounded-lg border border-slate-100 shadow-sm dark:border-slate-900">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-36 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Row 1: Title & Subtitle */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Summer Sale"
                  className="border-slate-200 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                  {...register("title")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="subtitle"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  placeholder="Up to 50% off"
                  className="border-slate-200 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                  {...register("subtitle")}
                />
              </div>
            </div>

            {/* Row 2: Button Text & Button Link */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="buttonText"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Button Text
                </Label>
                <Input
                  id="buttonText"
                  placeholder="Shop Now"
                  className="border-slate-200 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                  {...register("buttonText")}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="buttonLink"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Button Link
                </Label>
                <Input
                  id="buttonLink"
                  placeholder="/sale"
                  className="border-slate-200 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                  {...register("buttonLink")}
                />
              </div>
            </div>

            {/* Row 3: Display Order */}
            <div className="space-y-1.5">
              <Label
                htmlFor="order"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                min={1}
                className="max-w-[120px] border-slate-200 focus-visible:ring-slate-400 dark:border-slate-800 dark:bg-slate-950"
                {...register("order", { valueAsNumber: true })}
              />
            </div>

            {/* Status Active Toggle Bar */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/30">
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Active Status
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Show this banner on the storefront immediately
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={(val) => setValue("active", val)}
              />
            </div>

            {/* Form Control Submissions */}
            <DialogFooter className="border-t border-slate-100 pt-4 dark:border-slate-900">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating && (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                )}
                {editingBanner ? "Save Changes" : "Add Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The banner will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
