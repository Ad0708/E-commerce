import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Review = mongoose.model("Review", new mongoose.Schema({ product: mongoose.Schema.Types.ObjectId, rating: Number }));
const Product = mongoose.model("Product", new mongoose.Schema({ averageRating: Number, totalReviews: Number }));

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const stats = await Review.aggregate([
    { $group: { _id: "$product", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
  ]);
  
  for (const stat of stats) {
    await Product.findByIdAndUpdate(stat._id, { averageRating: stat.averageRating, totalReviews: stat.totalReviews });
    console.log("Updated product", stat._id);
  }
  console.log("Done");
  process.exit(0);
});
