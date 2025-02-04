import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PawPrintIcon, Shield, Calendar, PhoneCall, Heart, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-24 px-4 bg-gradient-to-b from-accent/20 to-background overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block animate-bounce mb-4">
            <PawPrintIcon className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-primary">
            A Cozy Stay for Your Furry Friend
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Give your pet a safe, loving, and comfortable place to stay while youre away. Professional care tailored to
            your dogs needs. 🐾
          </p>
          <div className="space-x-4">
            <Button size="lg" className="text-lg bg-primary hover:bg-primary/90">
              Book a Stay Today
            </Button>
            <Button size="lg" variant="outline" className="text-lg border-primary text-primary hover:bg-primary/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">Why Choose Dog Hostel?</h2>
          <p className="text-center text-muted-foreground mb-12">Your dogs happiness is our priority! 🐕</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Trusted & Secure",
                description: "Verified pet owners & professional caregivers ensuring your dog's safety",
                color: "bg-primary/10",
              },
              {
                icon: PawPrintIcon,
                title: "Comfortable Boarding",
                description: "Cozy spaces with healthy meals & scheduled playtime",
                color: "bg-secondary/10",
              },
              {
                icon: Calendar,
                title: "Easy Booking",
                description: "Hassle-free online booking with instant confirmation",
                color: "bg-accent/10",
              },
              {
                icon: PhoneCall,
                title: "24/7 Support",
                description: "Always here to help with your pet's needs",
                color: "bg-primary/10",
              },
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-none">
                <CardContent className={`pt-6 ${feature.color} rounded-lg`}>
                  <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-secondary/10 to-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12">Three simple steps to happy tails! 🎉</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                icon: Heart,
                title: "Sign Up & Create Profile",
                description: "Register as an owner or caregiver",
              },
              {
                step: "2",
                icon: Star,
                title: "Find the Perfect Stay",
                description: "Choose a verified dog hostel near you",
              },
              {
                step: "3",
                icon: PawPrintIcon,
                title: "Drop Off & Relax",
                description: "Enjoy peace of mind while we care for your pup",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8" />
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-accent/10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">What Pet Parents Say</h2>
          <p className="text-center text-muted-foreground mb-12">Join our happy pack! 🐾</p>
          <div className="max-w-3xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full animate-spin" />
                    <Image
                      src="/placeholder.svg"
                      alt="Happy dog"
                      width={80}
                      height={80}
                      className="rounded-full relative"
                    />
                  </div>
                  <p className="text-lg mb-4 italic">
                    My dog had the best time! Safe, clean, and full of love. The staff was incredibly caring and sent
                    regular updates. Highly recommend!
                  </p>
                  <p className="font-semibold text-primary">Happy Pet Parent</p>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent stroke-accent" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Give Your Dog the Best Stay?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book now and join thousands of happy pet parents who trust Dog Hostel 🎉
          </p>
          <Button size="lg" variant="secondary" className="text-lg bg-background text-primary hover:bg-background/90">
            Get Started Today
          </Button>
        </div>
      </section>

      <div className="h-4 bg-gradient-to-r from-primary via-secondary to-accent" />
    </div>
  )
}

