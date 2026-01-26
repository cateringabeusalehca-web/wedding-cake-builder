import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  RefreshCw,
  Calendar,
  Users,
  DollarSign,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import type { User } from "@supabase/supabase-js";

interface CakeOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  event_date: string | null;
  guest_count: number;
  estimated_price: number | null;
  special_requests: string | null;
  reference_images: string[] | null;
  cake_config: unknown;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-500/20 text-yellow-600", icon: <Clock className="h-3 w-3" /> },
  reviewed: { label: "Reviewed", color: "bg-blue-500/20 text-blue-600", icon: <Eye className="h-3 w-3" /> },
  confirmed: { label: "Confirmed", color: "bg-green-500/20 text-green-600", icon: <CheckCircle className="h-3 w-3" /> },
  completed: { label: "Completed", color: "bg-purple-500/20 text-purple-600", icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-600", icon: <XCircle className="h-3 w-3" /> },
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<CakeOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CakeOrder | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        } else {
          // Check admin role after auth state changes
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      
      if (data) {
        fetchOrders();
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("cake_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("cake_orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order:", error);
        toast({
          title: "Error",
          description: "Failed to update order status.",
          variant: "destructive",
        });
        return;
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast({
        title: "Status updated",
        description: `Order status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from("cake_orders")
        .delete()
        .eq("id", orderId);

      if (error) {
        console.error("Error deleting order:", error);
        toast({
          title: "Error",
          description: "Failed to delete order.",
          variant: "destructive",
        });
        return;
      }

      setOrders(orders.filter(order => order.id !== orderId));
      setDeleteOrderId(null);

      toast({
        title: "Order deleted",
        description: "The order has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-8 w-8 border-2 border-secondary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="heading-display text-2xl mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. Please contact the system administrator
            to request access.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Site
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Logged in as: {user?.email}
          </p>
        </motion.div>
      </div>
    );
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
    revenue: orders
      .filter(o => o.status === "confirmed" || o.status === "completed")
      .reduce((sum, o) => sum + (o.estimated_price || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="heading-display text-xl">Order Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-display font-bold">{stats.total}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-display font-bold">{stats.pending}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-display font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Revenue</p>
                <p className="text-2xl font-display font-bold">${stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">Recent Orders</h2>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground">
              Orders will appear here once customers submit requests.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Estimate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.event_date
                          ? format(new Date(order.event_date), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>{order.guest_count}</TableCell>
                      <TableCell>
                        {order.estimated_price
                          ? `$${order.estimated_price.toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[130px] h-8">
                            <SelectValue>
                              <Badge className={`${statusConfig[order.status]?.color} flex items-center gap-1`}>
                                {statusConfig[order.status]?.icon}
                                {statusConfig[order.status]?.label}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {Object.entries(statusConfig).map(([value, config]) => (
                              <SelectItem key={value} value={value}>
                                <div className="flex items-center gap-2">
                                  {config.icon}
                                  {config.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(order.created_at), "MMM d, h:mm a")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteOrderId(order.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order from {selectedOrder?.customer_name}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="font-medium">
                    {selectedOrder.event_date
                      ? format(new Date(selectedOrder.event_date), "MMMM d, yyyy")
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Order Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{selectedOrder.guest_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Price</p>
                    <p className="font-medium text-secondary">
                      ${selectedOrder.estimated_price?.toLocaleString() || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusConfig[selectedOrder.status]?.color}>
                      {statusConfig[selectedOrder.status]?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Cake Config */}
              {selectedOrder.cake_config && Object.keys(selectedOrder.cake_config).length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Cake Configuration</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(selectedOrder.cake_config, null, 2)}
                  </pre>
                </div>
              )}

              {/* Special Requests */}
              {selectedOrder.special_requests && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Special Requests</h4>
                  <p className="text-muted-foreground">{selectedOrder.special_requests}</p>
                </div>
              )}

              {/* Reference Images */}
              {selectedOrder.reference_images && selectedOrder.reference_images.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Reference Images</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedOrder.reference_images.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={url}
                          alt={`Reference ${i + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrderId && deleteOrder(deleteOrderId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
