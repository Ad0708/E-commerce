import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import User from "./src/models/User.js";
import Review from "./src/models/Review.js";
import Product from "./src/models/Product.js";
import { updateProductReviewStats } from "./src/utils/review.js";

// Bypass Node DNS SRV bug on Windows
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load environment variables from .env
dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    
    const productId = "6a686d2187700a31a266d25c";
    console.log("Seeding reviews for product:", productId);

    // Create 6 dummy users named "abc" to bypass the unique constraint
    const users = [];
    for (let i = 0; i < 6; i++) {
      const u = await User.create({
        name: "abc",
        email: `abc_seeder_${Date.now()}_${i}@example.com`,
        password: "password12345"
      });
      users.push(u);
    }

    const comments = [
      "Absolutely brilliant product. The quality is top notch and it feels incredibly premium. Would highly recommend!",
      "I was skeptical at first, but this exceeded all my expectations. Fast shipping and fantastic build quality.",
      "Just perfect. Looks exactly like the pictures and works flawlessly.",
      "Very happy with this purchase. The packaging was secure and it's exactly what I needed.",
      "This is a must-buy. I've bought similar products before but nothing compares to this one.",
      "5 stars all the way! Amazing customer support and a phenomenal product."
    ];

    for (let i = 0; i < 6; i++) {
      await Review.create({
        user: users[i]._id,
        product: productId,
        order: new mongoose.Types.ObjectId(), // Fake order ID
        rating: 5,
        comment: comments[i],
        verifiedPurchase: true
      });
    }

    // Update the average rating and total reviews on the Product document
    await updateProductReviewStats(productId);
    
    console.log("Successfully seeded 6 reviews!");
  } catch (err) {
    console.error("Error seeding reviews:", err);
  }
  process.exit();
};

run();
