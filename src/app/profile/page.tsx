import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Card from "@/components/Card";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card title="User Profile">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-gray-700">Name:</span> {session.user.name}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Email:</span> {session.user.email}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Role:</span> {session.user.role}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Profile editing functionality will be available in future updates.
          </p>
        </div>
      </Card>
    </div>
  );
}
