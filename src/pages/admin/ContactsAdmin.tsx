import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, CheckCircle, Mail } from "lucide-react";
import { adminGetContacts, adminMarkContactRead, adminDeleteContact } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    adminGetContacts().then(setContacts).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await adminMarkContactRead(id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
    toast({ title: "Marked as read" });
  };

  const remove = async (id: string) => {
    await adminDeleteContact(id);
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Deleted" });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Contact Messages</h2>
        <Badge variant="secondary">{contacts.length} total</Badge>
      </div>

      {contacts.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No contact messages yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <Card key={c.id} className={!c.isRead ? "border-blue-200 bg-blue-50/30" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{c.name}</span>
                      {!c.isRead && <Badge variant="default" className="text-xs">New</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">{c.email} &middot; {new Date(c.createdAt).toLocaleString()}</div>
                    {c.subject && <div className="text-sm font-medium mb-1">{c.subject}</div>}
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{c.message}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {!c.isRead && (
                      <Button variant="ghost" size="icon" onClick={() => markRead(c.id)} title="Mark as read">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`mailto:${c.email}?subject=Re: ${c.subject || ''}`} title="Reply"><Mail className="w-4 h-4" /></a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c.id)} title="Delete">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
