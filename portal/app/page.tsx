import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-3xl font-semibold mb-4 text-black dark:text-white">
          Morning Pulse
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Schedule your wake-up calls
        </p>
        <Link
          href="/alarm"
          className="inline-block px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          Set Alarm
        </Link>
      </main>
    </div>
  );
}
