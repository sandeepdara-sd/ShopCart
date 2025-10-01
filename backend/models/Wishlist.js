import mongoose from 'mongoose';

const WishlistItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    rating: {
      rate: { type: Number },
      count: { type: Number },
    },
  },
  { _id: false }
);

const WishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [WishlistItemSchema], default: [] },
  },
  { timestamps: true }
);

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;


