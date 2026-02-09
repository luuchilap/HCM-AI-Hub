import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, Calendar, Newspaper, Handshake, Loader2 } from "lucide-react";
import { adminGetStats } from "@/lib/api";

export default function DashboardHome() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = [
    { title: "Contact Messages", value: stats?.contacts?.total ?? 0, sub: `${stats?.contacts?.unread ?? 0} unread`, icon: Mail, color: "text-blue-500" },
    { title: "Collaborations", value: stats?.collaborations?.total ?? 0, sub: `${stats?.collaborations?.unread ?? 0} unread`, icon: Handshake, color: "text-indigo-500" },
    { title: "Newsletter Subscribers", value: stats?.subscribers ?? 0, sub: "active", icon: Newspaper, color: "text-green-500" },
    { title: "Events", value: stats?.events ?? 0, sub: "total", icon: Calendar, color: "text-purple-500" },
    { title: "Registrations", value: stats?.registrations ?? 0, sub: "total", icon: Calendar, color: "text-orange-500" },
    { title: "Users", value: stats?.users ?? 0, sub: "registered", icon: Users, color: "text-teal-500" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
