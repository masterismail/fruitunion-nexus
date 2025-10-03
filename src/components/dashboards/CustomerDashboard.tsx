import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, Calendar, CreditCard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

interface CustomerDashboardProps {
  user: User;
}

interface Subscription {
  subscription_plan: string;
  subscription_status: string;
  next_payment_date: string;
  subscription_end_date: string;
}

interface Delivery {
  id: string;
  delivery_date: string;
  delivery_status: string;
  items: string;
  delivered_at: string | null;
}

const CustomerDashboard = ({ user }: CustomerDashboardProps) => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, [user.id]);

  const fetchCustomerData = async () => {
    try {
      const { data: customerData } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (customerData) {
        setSubscription(customerData);

        const { data: deliveriesData } = await supabase
          .from("deliveries")
          .select("*")
          .eq("customer_id", customerData.id)
          .order("delivery_date", { ascending: false });

        setDeliveries(deliveriesData || []);
      }
    } catch (error: any) {
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const completedDeliveries = deliveries.filter(d => d.delivery_status === "delivered").length;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="The Fruit Union" className="h-12 w-auto" />
            <div>
              <h1 className="text-2xl font-bold">My Dashboard</h1>
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
        {loading ? (
          <p>Loading...</p>
        ) : !subscription ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No active subscription found. Please contact support to set up your subscription.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{subscription.subscription_plan}</div>
                  <Badge className="mt-2" variant={
                    subscription.subscription_status === "active" ? "default" : "secondary"
                  }>
                    {subscription.subscription_status}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Date(subscription.next_payment_date).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Deliveries Received</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedDeliveries}</div>
                  <p className="text-sm text-muted-foreground">Total deliveries</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
              </CardHeader>
              <CardContent>
                {deliveries.length === 0 ? (
                  <p className="text-muted-foreground">No deliveries yet.</p>
                ) : (
                  <div className="space-y-4">
                    {deliveries.map((delivery) => (
                      <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{delivery.items}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(delivery.delivery_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          delivery.delivery_status === "delivered" ? "default" :
                          delivery.delivery_status === "in_transit" ? "secondary" :
                          "outline"
                        }>
                          {delivery.delivery_status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
