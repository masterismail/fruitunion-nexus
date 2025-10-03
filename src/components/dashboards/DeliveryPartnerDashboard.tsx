import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Package, LogOut, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

interface DeliveryPartnerDashboardProps {
  user: User;
}

interface Delivery {
  id: string;
  delivery_date: string;
  delivery_status: string;
  items: string;
  delivery_address: string;
  customer_id: string;
}

const DeliveryPartnerDashboard = ({ user }: DeliveryPartnerDashboardProps) => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, [user.id]);

  const fetchDeliveries = async () => {
    try {
      const { data: partnerData } = await supabase
        .from("delivery_partners")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!partnerData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .eq("delivery_partner_id", partnerData.id)
        .order("delivery_date", { ascending: false });

      if (error) throw error;
      setDeliveries(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch deliveries");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (deliveryId: string) => {
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
      fetchDeliveries();
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading deliveries...</p>
            ) : deliveries.length === 0 ? (
              <p className="text-muted-foreground">No deliveries assigned yet.</p>
            ) : (
              <div className="space-y-4">
                {deliveries.map((delivery) => (
                  <Card key={delivery.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              delivery.delivery_status === "delivered" ? "default" :
                              delivery.delivery_status === "in_transit" ? "secondary" :
                              "outline"
                            }>
                              {delivery.delivery_status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(delivery.delivery_date).toLocaleDateString()}
                            </span>
                          </div>
                          <p><strong>Items:</strong> {delivery.items}</p>
                          <p><strong>Address:</strong> {delivery.delivery_address}</p>
                        </div>
                        {delivery.delivery_status !== "delivered" && (
                          <Button 
                            size="sm"
                            onClick={() => handleMarkDelivered(delivery.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DeliveryPartnerDashboard;
