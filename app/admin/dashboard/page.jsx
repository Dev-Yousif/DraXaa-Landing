"use client";

import DashboardLayout from "@/layouts/components/DashboardLayout";
import StatsCard from "@/layouts/components/StatsCard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome to your admin dashboard
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value="1,234"
              trend="up"
              trendValue="12%"
              color="blue"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
            />

            <StatsCard
              title="Revenue"
              value="$45,231"
              trend="up"
              trendValue="8%"
              color="green"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <StatsCard
              title="Active Projects"
              value="24"
              trend="up"
              trendValue="3%"
              color="purple"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />

            <StatsCard
              title="Pending Tasks"
              value="12"
              trend="down"
              trendValue="5%"
              color="orange"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[
                {
                  action: "New user registered",
                  user: "john@example.com",
                  time: "2 minutes ago",
                },
                {
                  action: "Project completed",
                  user: "Landing Page Redesign",
                  time: "1 hour ago",
                },
                {
                  action: "Payment received",
                  user: "$1,250 from Client XYZ",
                  time: "3 hours ago",
                },
                {
                  action: "New task created",
                  user: "Update documentation",
                  time: "5 hours ago",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500">{item.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  + Add New User
                </button>
                <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  + Create Project
                </button>
                <button className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  + Generate Report
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                System Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600"></span>
                    Operational
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}
