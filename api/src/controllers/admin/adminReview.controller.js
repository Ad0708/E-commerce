import Review from "../../models/Review.js";
import Product from "../../models/Product.js";

// Fetch products that have reviews
export const getAdminReviewedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    const query = { totalReviews: { $gt: 0 } };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .select("name images category averageRating totalReviews")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total: totalProducts,
        totalPages,
        page,
        limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAdminReviewedProducts:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Fetch specific reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { rating, search } = req.query;

    const query = { product: productId };

    if (rating && rating !== "all") {
      query.rating = parseInt(rating);
    }

    if (search) {
      query.comment = { $regex: search, $options: "i" };
    }

    const reviews = await Review.find(query)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        total: totalReviews,
        totalPages,
        page,
        limit,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getProductReviews:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a review and update product averages
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const productId = review.product;

    await Review.findByIdAndDelete(id);

    // Recalculate average rating for the product
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
