import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Shield, ShieldOff } from "lucide-react";
import { adminGetUsers, adminUpdateUserRole } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    adminGetUsers().then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    try {
      const updated = await adminUpdateUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: updated.role } : u)));
      toast({ title: `Role updated to ${newRole}` });
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Users</h2>
        <Badge variant="secondary">{users.length} users</Badge>
      </div>

      {users.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No users yet.</CardContent></Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name || "—"}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {u.id !== currentUser?.id && (
                      <Button variant="ghost" size="icon" onClick={() => toggleRole(u.id, u.role)} title={u.role === "admin" ? "Remove admin" : "Make admin"}>
                        {u.role === "admin" ? <ShieldOff className="w-4 h-4 text-orange-500" /> : <Shield className="w-4 h-4 text-green-500" />}
                      </Button>
                    )}
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
