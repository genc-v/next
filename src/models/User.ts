import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "user" | "admin";

export interface ILink {
  code: string;
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  hashedPassword?: string;
  image?: string;
  role: UserRole;
  links: ILink[];
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema = new Schema<ILink>(
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
  },
  {
    timestamps: true,
    _id: false, // Don't create separate ObjectIds for each link
  }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    links: {
      type: [LinkSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
