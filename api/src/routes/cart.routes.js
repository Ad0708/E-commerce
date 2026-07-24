import express from "express";
const router = express.Router();

import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { verifyAnyToken } from "../middlewares/auth.middleware.js"; // your auth middleware

// GET    /api/cart                — fetch current user's cart

// All cart routes are protected
router.use(verifyAnyToken);

// GET    /api/cart                — fetch current user's cart
// POST   /api/cart                — add item (or increment if already in cart)
// DELETE /api/cart                — clear entire cart
router.route("/").get(getCart).post(addToCart).delete(clearCart);

// PATCH  /api/cart/:productId     — update quantity of one item
// DELETE /api/cart/:productId     — remove one item
router.route("/:productId").patch(updateCartItem).delete(removeCartItem);

export default router;
