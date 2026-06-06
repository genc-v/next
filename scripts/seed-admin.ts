/**
 * Seed script to create or promote the first admin user.
 *
 * Usage:
 *   npx tsx scripts/seed-admin.ts
 *
 * Environment:
 *   Reads MONGODB_URI from .env.local
 *
 * If no admin exists, creates one with:
 *   Email:    admin@shorty.local
 *   Password: admin123
 *   Name:     Admin
 *
 * You can also pass a custom email to promote an existing user:
 *   npx tsx scripts/seed-admin.ts user@example.com
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Inline schema to avoid import issues with path aliases
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    hashedPassword: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const targetEmail = process.argv[2];

  if (targetEmail) {
    const user = await User.findOne({ email: targetEmail.toLowerCase() });
    if (!user) {
      console.error(`User with email "${targetEmail}" not found.`);
      process.exit(1);
    }
    user.role = "admin";
    await user.save();
    console.log(`User "${user.name}" (${user.email}) has been promoted to admin.`);
  } else {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(`An admin already exists: ${existingAdmin.name} (${existingAdmin.email})`);
      console.log("To promote another user, run: npx tsx scripts/seed-admin.ts <email>");
    } else {
      const password = "admin123";
      const hashedPassword = await bcrypt.hash(password, 12);

      const admin = await User.create({
        name: "Admin",
        email: "admin@shorty.local",
        hashedPassword,
        role: "admin",
      });

      console.log("Admin user created:");
      console.log(`  Email:    ${admin.email}`);
      console.log(`  Password: ${password}`);
      console.log(`  Name:     ${admin.name}`);
      console.log("\nPlease change the password after first login.");
    }
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
