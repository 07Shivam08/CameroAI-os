"use client";

import { useTheme } from "next-themes";
import Link from "next/link";

export default function Page() {

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-800/10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to{" "}
          <span className="text-emerald-600 dark:text-emerald-400">Camero</span>
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
          Don't have an account?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
          Sign up below or apply for a trial account to experience all of our
          premium features.
        </p>
        <Link
          href="/form/create"
          className="inline-block px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg mb-8 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-gray-900"
        >
          Apply for Trial Account
        </Link>
      </div>
    </div>
  );
}
