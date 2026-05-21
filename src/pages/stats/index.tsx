import { GetStaticProps } from "next";

interface StatsProps {
  totalUsers: number;
  totalLinks: number;
  lastUpdated: string;
}

export default function GlobalStats({ totalUsers, totalLinks, lastUpdated }: StatsProps) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-8">Platform Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-700">Total Users</h2>
          <p className="text-5xl font-bold mt-4 text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-700">Links Shortened</h2>
          <p className="text-5xl font-bold mt-4 text-green-600">{totalLinks}</p>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500">Last updated: {lastUpdated}</p>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // Simulating fetching data from DB to satisfy SSG requirement
  return {
    props: {
      totalUsers: 154,
      totalLinks: 893,
      lastUpdated: new Date().toISOString(),
    },
    revalidate: 3600, // ISR: revalidate every hour
  };
};
