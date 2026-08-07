import express from "express";

import {
  getStoreBasic,
  getStoreContact,
  getStoreAddress,
  getStoreBusiness,
  getStoreTax,
  getStoreShipping,
  getStoreCurrency,
  getStoreSocialLinks,
  getStoreSeo,
  getStoreMaintenance,
  getStoreReturns,
  getStoreBanners,
} from "../controllers/store.controller.js";

const router = express.Router();

router.get("/basic", getStoreBasic);
router.get("/contact", getStoreContact);
router.get("/address", getStoreAddress);
router.get("/business", getStoreBusiness);
router.get("/tax", getStoreTax);
router.get("/shipping", getStoreShipping);
router.get("/currency", getStoreCurrency);
router.get("/social-links", getStoreSocialLinks);
router.get("/seo", getStoreSeo);
router.get("/maintenance", getStoreMaintenance);
router.get("/returns", getStoreReturns);
router.get("/banners", getStoreBanners);

import mongoose from "mongoose";
import User from "../models/User.js";
import Review from "../models/Review.js";
import { updateProductReviewStats } from "../utils/review.js";

router.get("/seed-reviews", async (req, res) => {
  try {
    const productId = "6a686d2187700a31a266d25c";

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
        order: new mongoose.Types.ObjectId(),
        rating: 5,
        comment: comments[i],
        verifiedPurchase: true
      });
    }

    await updateProductReviewStats(productId);
    
    res.json({ success: true, message: "Successfully seeded 6 reviews!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;