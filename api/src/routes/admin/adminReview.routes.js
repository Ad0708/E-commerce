import express from "express";
import {
  getAdminReviewedProducts,
  getProductReviews,
  deleteReview,
} from "../../controllers/admin/adminReview.controller.js";
import { verifyAdminToken } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyAdminToken);

// Fetch products that have reviews
router.get("/", getAdminReviewedProducts);

// Fetch reviews for a specific product
router.get("/:productId", getProductReviews);

// Delete a specific review
router.delete("/:id", deleteReview);

export default router;
