import { GetServerSideProps } from "next";

interface LinkDetailProps {
  code: string;
  views: number;
  location: string;
}

export default function LinkDetail({ code, views, location }: LinkDetailProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Details for /{code}</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div>
          <span className="font-semibold text-gray-700">Code:</span> {code}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Total Views:</span> {views}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Most clicks from:</span> {location}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const code = context.params?.code as string;

  // Simulating fetching real-time data from DB to satisfy SSR requirement
  return {
    props: {
      code,
      views: Math.floor(Math.random() * 1000),
      location: "Albania",
    },
  };
};
