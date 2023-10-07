"use client";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div
            className={`bg-white w-64 flex flex-col lg:block ${
              isSidebarOpen || "sm:block block"
            } hidden`}
          >
            <div className="h-16 bg-blue-500 text-white flex items-center justify-center">
              Logo
            </div>
            <ul className="flex-1 mt-4">
              <li className="mb-2 px-4">
                <a
                  href="/dashboard"
                  className="text-gray-700 hover:bg-gray-200 block py-2 rounded-lg"
                >
                  Dashboard
                </a>
              </li>
              <li className="mb-2 px-4">
                <a
                  href="/dashboard/users"
                  className="text-gray-700 hover:bg-gray-200 block py-2 rounded-lg"
                >
                  Users
                </a>
              </li>
              <li className="mb-2 px-4">
                <a
                  href="/dashboard/orders"
                  className="text-gray-700 hover:bg-gray-200 block py-2 rounded-lg"
                >
                  Orders
                </a>
              </li>
              {/* Add more sidebar items here */}
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Top Navbar */}
            <div className="h-16 bg-white shadow-md flex items-center justify-between px-8">
              <div className="lg:hidden">
                <button
                  onClick={() => {
                    console.log("click icon");
                    setIsSidebarOpen(!isSidebarOpen);
                  }}
                  className="text-gray-700 focus:outline-none"
                >
                  {/* Add a hamburger icon here */}☰
                </button>
              </div>
              <div className="text-gray-700 hidden lg:block">
                Welcome, User!
              </div>
              <div>
                <button
                  onClick={() => {
                    localStorage.setItem("watchwonder_token", "");
                    router.push("/login");
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
