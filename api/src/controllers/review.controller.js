import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

import { updateProductReviewStats } from "../utils/review.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      orderId,
      productId,
      rating,
      comment,
    } = req.body;

    // Validate required fields
    if (!orderId || !productId || !rating || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate rating
    if (![1, 2, 3, 4, 5].includes(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Find order
    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Order must be delivered
    if (order.status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "You can only review delivered orders.",
      });
    }

    // Product must belong to this order
    const purchased = order.items.some(
      (item) => item.productId.toString() === productId
    );

    if (!purchased) {
      return res.status(400).json({
        success: false,
        message: "This product was not purchased in this order.",
      });
    }

    // Prevent duplicate review
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // Create review
    await Review.create({
      user: userId,
      order: orderId,
      product: productId,
      rating,
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    // Update product rating
    await updateProductReviewStats(productId);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
    });
  } catch (error) {
    console.error("Create Review:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sort = req.query.sort || "latest";

    // Check product exists
    const product = await Product.findById(productId).select(
      "averageRating totalReviews"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "highest":
        sortOption = { rating: -1, createdAt: -1 };
        break;

      case "lowest":
        sortOption = { rating: 1, createdAt: -1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Review.countDocuments({
      product: productId,
    });

    const reviews = await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,

      rating: {
        averageRating: product.averageRating,
        totalReviews: product.totalReviews,
      },

      reviews,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error("Get Product Reviews:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
};

export const getReviewableOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId,
      status: "Delivered",
    }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Delivered order not found.",
      });
    }

    const reviews = await Review.find({
      user: userId,
      product: {
        $in: order.items.map((item) => item.productId),
      },
    })
      .select("product")
      .lean();

    const reviewedProducts = new Set(
      reviews.map((review) => review.product.toString())
    );

    const products = order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      category: item.category,
      quantity: item.quantity,
      alreadyReviewed: reviewedProducts.has(item.productId.toString()),
    }));

    return res.status(200).json({
      success: true,
      orderId: order._id,
      orderNumber: order.orderNumber,
      products,
    });
  } catch (error) {
    console.error("Get Reviewable Order:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviewable products.",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required.",
      });
    }

    if (![1, 2, 3, 4, 5].includes(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.rating = Number(rating);
    review.comment = comment.trim();

    await review.save();

    await updateProductReviewStats(review.product);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    console.error("Update Review:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review.",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    await updateProductReviewStats(productId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review.",
    });
  }
};