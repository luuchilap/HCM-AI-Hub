import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { adminGetSubscribers, adminDeleteSubscriber } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    adminGetSubscribers().then(setSubscribers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const remove = async (id: string) => {
    await adminDeleteSubscriber(id);
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Subscriber removed" });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Newsletter Subscribers</h2>
        <Badge variant="secondary">{subscribers.length} subscribers</Badge>
      </div>

      {subscribers.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No subscribers yet.</CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell>{s.name || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(s.subscribedAt).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant={s.isActive ? "default" : "secondary"}>{s.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => remove(s.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
