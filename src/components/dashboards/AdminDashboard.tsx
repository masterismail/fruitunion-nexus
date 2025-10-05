import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Users, Package, Truck, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

interface AdminDashboardProps {
  user: User;
}

interface Customer {
  id: string;
  user_id: string;
  subscription_plan: string;
  subscription_status: string;
  next_payment_date: string;
  profiles: {
    full_name: string;
    phone: string | null;
  };
}

interface Delivery {
  id: string;
  delivery_date: string;
  delivery_status: string;
  items: string;
  delivery_address: string;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalDeliveries: 0,
    totalPartners: 0,
    activeDeliveries: 0
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDeliveries, setCustomerDeliveries] = useState<Delivery[]>([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    password: '',
    full_name: '',
    phone: '',
    subscription_plan: 'basic'
  });

  useEffect(() => {
    fetchStats();
    fetchCustomers();
  }, []);

  const fetchStats = async () => {
    try {
      const [customers, deliveries, partners] = await Promise.all([
        supabase.from("customers").select("*", { count: "exact" }),
        supabase.from("deliveries").select("*", { count: "exact" }),
        supabase.from("delivery_partners").select("*", { count: "exact" })
      ]);

      const activeDeliveries = await supabase
        .from("deliveries")
        .select("*", { count: "exact" })
        .in("delivery_status", ["pending", "assigned", "in_transit"]);

      setStats({
        totalCustomers: customers.count || 0,
        totalDeliveries: deliveries.count || 0,
        totalPartners: partners.count || 0,
        activeDeliveries: activeDeliveries.count || 0
      });
    } catch (error: any) {
      toast.error("Failed to fetch statistics");
    }
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from("customers")
      .select(`
        *,
        profiles (
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
      return;
    }

    setCustomers(data || []);
  };

  const fetchCustomerDeliveries = async (customerId: string) => {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("customer_id", customerId)
      .order("delivery_date", { ascending: false });

    if (error) {
      console.error("Error fetching deliveries:", error);
      return;
    }

    setCustomerDeliveries(data || []);
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.username || !newCustomer.password || !newCustomer.full_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    const { error } = await supabase.rpc('create_customer_account', {
      p_username: newCustomer.username,
      p_password: newCustomer.password,
      p_full_name: newCustomer.full_name,
      p_phone: newCustomer.phone || null,
      p_subscription_plan: newCustomer.subscription_plan,
    });

    if (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer account");
      return;
    }

    toast.success(`Customer created! Login: ${newCustomer.username}@internal.local`);

    setIsAddCustomerOpen(false);
    setNewCustomer({
      username: '',
      password: '',
      full_name: '',
      phone: '',
      subscription_plan: 'basic'
    });
    fetchCustomers();
    fetchStats();
  };

  const handleUpdateSubscription = async (customerId: string, status: string) => {
    const { error } = await supabase
      .from("customers")
      .update({ subscription_status: status })
      .eq("id", customerId);

    if (error) {
      console.error("Error updating subscription:", error);
      toast.error("Failed to update subscription");
      return;
    }

    toast.success("Subscription updated successfully");
    fetchCustomers();
    if (selectedCustomer && selectedCustomer.id === customerId) {
      const updated = customers.find(c => c.id === customerId);
      if (updated) setSelectedCustomer(updated);
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerDeliveries(customer.id);
    setIsCustomerDetailsOpen(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="The Fruit Union" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDeliveries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Delivery Partners</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPartners}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Management</CardTitle>
            <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Customer Account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username (for login)</Label>
                    <Input
                      id="username"
                      value={newCustomer.username}
                      onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                      placeholder="e.g., john_doe"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Login will be: {newCustomer.username}@internal.local
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newCustomer.password}
                      onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={newCustomer.full_name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, full_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan">Subscription Plan</Label>
                    <Select
                      value={newCustomer.subscription_plan}
                      onValueChange={(value) => setNewCustomer({ ...newCustomer, subscription_plan: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddCustomer} className="w-full">
                    Create Customer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Payment</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.profiles?.full_name}</TableCell>
                    <TableCell>{customer.profiles?.phone || 'N/A'}</TableCell>
                    <TableCell className="capitalize">{customer.subscription_plan}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        customer.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.subscription_status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(customer.next_payment_date).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewCustomer(customer)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant={customer.subscription_status === 'active' ? 'destructive' : 'default'}
                        onClick={() => handleUpdateSubscription(
                          customer.id,
                          customer.subscription_status === 'active' ? 'inactive' : 'active'
                        )}
                      >
                        {customer.subscription_status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isCustomerDetailsOpen} onOpenChange={setIsCustomerDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Customer Details - {selectedCustomer?.profiles?.full_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Subscription Plan</Label>
                  <p className="text-sm capitalize">{selectedCustomer?.subscription_plan}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p className="text-sm capitalize">{selectedCustomer?.subscription_status}</p>
                </div>
                <div>
                  <Label>Next Payment</Label>
                  <p className="text-sm">{selectedCustomer && new Date(selectedCustomer.next_payment_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedCustomer?.profiles?.phone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Delivery History</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerDeliveries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No deliveries yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      customerDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                          <TableCell>{delivery.items}</TableCell>
                          <TableCell>{delivery.delivery_address}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs ${
                              delivery.delivery_status === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {delivery.delivery_status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminDashboard;
