import { Link } from "react-router-dom";
import { CheckCircle2, Leaf, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import heroFruits from "@/assets/hero-fruits.jpg";

const Home = () => {
  const pricingPlans = [
    {
      name: "Weekly Plan",
      price: "₹299",
      period: "/week",
      features: [
        "Fresh fruits delivery every week",
        "Seasonal variety selection",
        "Free delivery within city",
        "Cancel anytime"
      ]
    },
    {
      name: "Bi-Weekly Plan",
      price: "₹549",
      period: "/2 weeks",
      features: [
        "Fresh fruits delivery twice a month",
        "Premium seasonal fruits",
        "Free delivery",
        "Flexible scheduling"
      ],
      popular: true
    },
    {
      name: "Monthly Plan",
      price: "₹999",
      period: "/month",
      features: [
        "Weekly fresh fruit deliveries",
        "Premium exotic fruits included",
        "Priority delivery slots",
        "Dedicated support"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroFruits})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Fresh Fruits, Delivered to Your Door
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Skip the market hassle. Get farm-fresh, organic fruits delivered straight to your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg">
                <Link to="/auth">Start Your Subscription</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Video Preview Section */}
        <div className="absolute bottom-20 right-10 hidden lg:block">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-64 h-auto rounded-lg shadow-xl border-2 border-primary"
          >
            <source src="/videos/fresh-fruits-promo.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose The Fruit Union?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <CardTitle>100% Organic</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our fruits are sourced from certified organic farms, ensuring you get the freshest and healthiest produce.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Same-day delivery available! Your fruits are picked fresh and delivered straight to your doorstep.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mb-4" />
                <CardTitle>Trusted by Thousands</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join our growing community of health-conscious customers who trust us for their daily fruit needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Learn About Our Fruits</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <video controls className="w-full">
                <source src="/videos/ash-gourd-benefits.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-lg">Benefits of Ash Gourd</h3>
                <p className="text-sm text-muted-foreground">Discover the amazing health benefits</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <video controls className="w-full">
                <source src="/videos/fresh-fruits-promo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="p-4 bg-card">
                <h3 className="font-semibold text-lg">Fresh Fruits Delivery</h3>
                <p className="text-sm text-muted-foreground">See how we deliver farm-fresh fruits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                    P
                  </div>
                  <div>
                    <CardTitle className="text-lg">Priya Sharma</CardTitle>
                    <CardDescription>Customer since 2024</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "The quality of fruits is exceptional! Always fresh and delivered on time. My family loves the variety in the subscription."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl">
                    R
                  </div>
                  <div>
                    <CardTitle className="text-lg">Rahul Mehta</CardTitle>
                    <CardDescription>Customer since 2024</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Best decision to subscribe! No more rushing to the market. Fresh organic fruits delivered right to my door every week."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                    A
                  </div>
                  <div>
                    <CardTitle className="text-lg">Anita Desai</CardTitle>
                    <CardDescription>Customer since 2023</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  "Amazing service! The fruits are always perfectly ripe and the delivery partner is very professional. Highly recommend!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Flexible subscription plans to suit your needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? "border-primary border-2 relative" : ""}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link to="/auth">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Healthy Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying fresh, organic fruits delivered to their homes.
          </p>
          <Button size="lg" asChild className="text-lg">
            <Link to="/auth">Subscribe Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <img src={heroFruits} alt="The Fruit Union" className="h-16 w-auto mb-4 rounded-full object-cover" />
            <p className="text-muted-foreground mb-4">
              Fresh fruits, delivered with love.
            </p>
            <div className="flex gap-4 mb-4">
              <a 
                href="https://www.instagram.com/thefruitunion/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 The Fruit Union. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
