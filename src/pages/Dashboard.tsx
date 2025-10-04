import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import DeliveryPartnerDashboard from "@/components/dashboards/DeliveryPartnerDashboard";
import CustomerDashboard from "@/components/dashboards/CustomerDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    // THEN check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      // Default to 'customer' if no role found
      setUserRole(roleData?.role || 'customer');
      
      setLoading(false);
    };

    checkUser();

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Setting up your account...</p>
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }

  switch (userRole) {
    case "admin":
      return <AdminDashboard user={user} />;
    case "delivery_partner":
      return <DeliveryPartnerDashboard user={user} />;
    case "customer":
      return <CustomerDashboard user={user} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Invalid user role. Please contact support.</p>
        </div>
      );
  }
};

export default Dashboard;
