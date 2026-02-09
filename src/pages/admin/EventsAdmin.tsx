import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Eye } from "lucide-react";
import { adminGetEvents, adminDeleteEvent } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function EventsAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    adminGetEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await adminDeleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Event deleted" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    draft: "secondary",
    published: "default",
    upcoming: "default",
    past: "outline",
    cancelled: "destructive",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display font-bold">Events</h2>
          <Badge variant="secondary">{events.length} total</Badge>
        </div>
        <Link to="/admin/events/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No events yet.</p>
            <Link to="/admin/events/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {e.titleEn || e.titleVi}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{e.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{e.date}</TableCell>
                  <TableCell>
                    <Badge variant={(statusColor[e.status] || "secondary") as any}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{e.isFeatured ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/events/${e.id}/registrations`}>
                        <Button variant="ghost" size="icon" title="View Registrations">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/events/${e.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => handleDelete(e.id, e.titleEn || e.titleVi)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
