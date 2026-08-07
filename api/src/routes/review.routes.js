import express from "express";

import {
  createReview,
  getProductReviews,
  getReviewableOrder,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

import { verifyAnyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create Review
router.post("/", verifyAnyToken, createReview);

// Get Product Reviews
router.get("/product/:productId", getProductReviews);

// Get Reviewable Products for an Order
router.get("/order/:orderId", verifyAnyToken, getReviewableOrder);

// Update Review
router.put("/:reviewId", verifyAnyToken, updateReview);

// Delete Review
router.delete("/:reviewId", verifyAnyToken, deleteReview);

export default router;