import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUrl extends Document {
  _id: mongoose.Types.ObjectId;
  code: string;
  originalUrl: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UrlSchema = new Schema<IUrl>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Url: Model<IUrl> =
  mongoose.models.Url || mongoose.model<IUrl>("Url", UrlSchema);

export default Url;
