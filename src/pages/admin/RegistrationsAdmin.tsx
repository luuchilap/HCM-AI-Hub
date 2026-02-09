import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowLeft } from "lucide-react";
import { adminGetRegistrations } from "@/lib/api";

export default function RegistrationsAdmin() {
  const { eventId } = useParams<{ eventId: string }>();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    adminGetRegistrations(eventId).then(setRegistrations).catch(() => {}).finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  const statusColor: Record<string, string> = {
    pending: "secondary", confirmed: "default", cancelled: "destructive",
  };

  return (
    <div>
      <Link to="/admin/events">
        <Button variant="ghost" size="sm" className="mb-4"><ArrowLeft className="w-4 h-4 mr-1" />Back to Events</Button>
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Event Registrations</h2>
        <Badge variant="secondary">{registrations.length} registrations</Badge>
      </div>

      {registrations.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No registrations for this event.</CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.fullName}</TableCell>
                  <TableCell>{r.email}</TableCell>
                  <TableCell>{r.phone || "—"}</TableCell>
                  <TableCell>{r.organization}</TableCell>
                  <TableCell><Badge variant="outline">{r.organizationType || "—"}</Badge></TableCell>
                  <TableCell><Badge variant={(statusColor[r.status] || "secondary") as any}>{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
