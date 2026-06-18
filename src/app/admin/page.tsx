"use client";

import { useEffect, useState } from "react";
import { statsService, type DashboardStats } from "@/services/statsService";
import { Card, CardBody } from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";

const statCards = [
  { key: "userCount", label: "Total Users", icon: "👥", color: "text-blue-600" },
  { key: "postCount", label: "Total Posts", icon: "📝", color: "text-green-600" },
  { key: "commentCount", label: "Total Comments", icon: "💬", color: "text-purple-600" },
] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService.getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ key, label, icon, color }) => (
          <Card key={key}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${color}`}>
                    {stats?.[key] ?? "—"}
                  </p>
                </div>
                <span className="text-4xl" aria-hidden="true">{icon}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
