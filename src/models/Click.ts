import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClick extends Document {
  urlCode: string;
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
  referrer: string;
  device: string;
  os: string;
  browser: string;
  ip: string;
}

const ClickSchema = new Schema<IClick>({
  urlCode: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User", index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  referrer: { type: String, default: "" },
  device: { type: String, default: "unknown" },
  os: { type: String, default: "Other" },
  browser: { type: String, default: "Other" },
  ip: { type: String, default: "" },
});

const Click: Model<IClick> =
  mongoose.models.Click || mongoose.model<IClick>("Click", ClickSchema);

export default Click;
