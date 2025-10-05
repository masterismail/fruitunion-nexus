import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, LogOut, CheckCircle, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

interface DeliveryPartnerDashboardProps {
  user: User;
}

interface Customer {
  id: string;
  subscription_plan: string;
  subscription_status: string;
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
  customer_id: string;
  delivered_at: string | null;
}

const DeliveryPartnerDashboard = ({ user }: DeliveryPartnerDashboardProps) => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerDeliveries, setCustomerDeliveries] = useState<Delivery[]>([]);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
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

      if (error) throw error;
      setCustomers(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
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

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerDeliveries(customer.id);
    setIsCustomerDetailsOpen(true);
  };

  const handleMarkDelivered = async (deliveryId: string, customerId: string) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .update({
          delivery_status: "delivered",
          delivered_at: new Date().toISOString()
        })
        .eq("id", deliveryId);

      if (error) throw error;

      toast.success("Delivery marked as delivered!");
      fetchCustomerDeliveries(customerId);
    } catch (error: any) {
      toast.error("Failed to update delivery status");
    }
  };

  const handleMarkNotDelivered = async (deliveryId: string, customerId: string) => {
    try {
      const { error } = await supabase
        .from("deliveries")
        .update({
          delivery_status: "pending",
          delivered_at: null
        })
        .eq("id", deliveryId);

      if (error) throw error;

      toast.success("Delivery marked as not delivered");
      fetchCustomerDeliveries(customerId);
    } catch (error: any) {
      toast.error("Failed to update delivery status");
    }
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
              <h1 className="text-2xl font-bold">Delivery Partner Dashboard</h1>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading customers...</p>
            ) : customers.length === 0 ? (
              <p className="text-muted-foreground">No customers found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
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
                        <Badge variant={
                          customer.subscription_status === "active" ? "default" : "secondary"
                        }>
                          {customer.subscription_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          View Deliveries
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isCustomerDetailsOpen} onOpenChange={setIsCustomerDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Deliveries for {selectedCustomer?.profiles?.full_name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedCustomer?.profiles?.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subscription</p>
                  <p className="font-medium capitalize">{selectedCustomer?.subscription_plan}</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerDeliveries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No deliveries for this customer
                      </TableCell>
                    </TableRow>
                  ) : (
                    customerDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                        <TableCell>{delivery.items}</TableCell>
                        <TableCell>{delivery.delivery_address}</TableCell>
                        <TableCell>
                          <Badge variant={
                            delivery.delivery_status === "delivered" ? "default" :
                            delivery.delivery_status === "in_transit" ? "secondary" :
                            "outline"
                          }>
                            {delivery.delivery_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          {delivery.delivery_status !== "delivered" ? (
                            <Button 
                              size="sm"
                              onClick={() => handleMarkDelivered(delivery.id, selectedCustomer!.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Delivered
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkNotDelivered(delivery.id, selectedCustomer!.id)}
                            >
                              Mark Not Delivered
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default DeliveryPartnerDashboard;
