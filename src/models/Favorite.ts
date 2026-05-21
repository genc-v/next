import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  productSlug: string;
  productName: string;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    productSlug: { type: String, required: true },
    productName: { type: String, required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, productSlug: 1 }, { unique: true });

const Favorite: Model<IFavorite> =
  mongoose.models.Favorite || mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export default Favorite;
