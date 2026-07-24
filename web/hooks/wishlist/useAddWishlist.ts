// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { addToWishlist } from "@/api/wishlist";
// import { useWishlistStore } from "@/store/wishlist.store";

// export const useAddWishlist = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: addToWishlist,

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["wishlist"],
//       });
//     },
//   });
// };