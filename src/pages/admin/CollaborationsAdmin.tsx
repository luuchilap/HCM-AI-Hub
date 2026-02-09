import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, CheckCircle, Mail, Lightbulb, Target, Handshake } from "lucide-react";
import {
  adminGetCollaborations,
  adminMarkCollaborationRead,
  adminDeleteCollaboration,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const typeLabels: Record<string, { label: string; icon: any; color: string }> = {
  "use-case": { label: "Use Case", icon: Lightbulb, color: "bg-amber-100 text-amber-700" },
  "problem-statement": { label: "Problem Statement", icon: Target, color: "bg-blue-100 text-blue-700" },
  "partnership": { label: "Partnership", icon: Handshake, color: "bg-green-100 text-green-700" },
};

export default function CollaborationsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    adminGetCollaborations()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await adminMarkCollaborationRead(id);
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)));
    toast({ title: "Marked as read" });
  };

  const remove = async (id: string) => {
    await adminDeleteCollaboration(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
    toast({ title: "Deleted" });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Collaboration Requests</h2>
        <Badge variant="secondary">{items.length} total</Badge>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No collaboration requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((c) => {
            const typeInfo = typeLabels[c.type] || { label: c.type, icon: Lightbulb, color: "bg-gray-100 text-gray-700" };
            const TypeIcon = typeInfo.icon;

            return (
              <Card key={c.id} className={!c.isRead ? "border-blue-200 bg-blue-50/30" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-sm">{c.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </span>
                        {!c.isRead && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {c.email} &middot; {c.organization}
                        {c.phone && <> &middot; {c.phone}</>}
                        {" "}&middot; {new Date(c.createdAt).toLocaleString()}
                      </div>
                      <div className="text-sm font-medium mb-1">{c.title}</div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {c.description}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {!c.isRead && (
                        <Button variant="ghost" size="icon" onClick={() => markRead(c.id)} title="Mark as read">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`mailto:${c.email}?subject=Re: ${c.title || ""}`} title="Reply">
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(c.id)} title="Delete">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
