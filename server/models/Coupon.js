import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ['percent', 'fixed'], required: true },
    value: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);



couponSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.expiresAt < new Date()) return false;
  if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;
  return true;
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
