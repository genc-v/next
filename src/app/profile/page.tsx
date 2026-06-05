import { redirect } from "next/navigation";
import ProfileClient from "@/components/ProfileClient";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  await dbConnect();
  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <ProfileClient
      initialUser={{
        name: user.name,
        email: user.email,
        role: user.role,
        hasPassword: !!user.hashedPassword,
      }}
    />
  );
}
