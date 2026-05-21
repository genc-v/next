import Card from "@/components/Card";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card title="About This Project">
        <div className="space-y-4 text-gray-700">
          <p>
            Welcome to the Next URL Shortener. This project was built as part of a 
            university assignment for &quot;Zhvillim i Ueb-it në Anën e Klientit&quot;.
          </p>
          <p>
            It uses modern web technologies including Next.js, NextAuth, MongoDB, 
            and Tailwind CSS to provide a fast, secure, and user-friendly experience 
            for shortening and managing URLs.
          </p>
          <h4 className="font-semibold text-black mt-4">Features:</h4>
          <ul className="list-disc pl-5">
            <li>User Authentication (Credentials & Google)</li>
            <li>Role-based Access (Admin & User)</li>
            <li>URL Shortening & Management</li>
            <li>Responsive Design</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
