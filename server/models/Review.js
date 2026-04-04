import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    qualityRating: { type: Number, min: 1, max: 5 },
    comfortRating: { type: Number, min: 1, max: 5 },
    sizingRating: { type: Number, min: 1, max: 5 },
    lengthRating: { type: Number, min: 1, max: 5 },
    reviewerAge: String,
    reviewerHeight: String,
    activityLevel: String,
    usualSize: String,
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    helpfulVotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

reviewSchema.statics.calcAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isApproved: true } },
    {
      $group: {
        _id: '$product',
        average: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratings: {
        average: Math.round(stats[0].average * 10) / 10,
        count: stats[0].count,
      },
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratings: { average: 0, count: 0 },
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) doc.constructor.calcAverageRating(doc.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
