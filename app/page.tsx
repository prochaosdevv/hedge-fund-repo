import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { TrendingUp, Shield, Zap, Users, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          {/* Gradient background effect */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Decentralized Fund Management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">
              Create & Invest in
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}
                DeFi Hedge Funds
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto leading-relaxed">
              Build your own hedge fund with custom asset allocations and commission structures. Invest in
              top-performing funds with automated stop-loss and take-profit protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-base group">
                <Link href="/create">
                  Create Your Fund
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent">
                <Link href="/explore">Explore Funds</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Custom Allocations</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Create funds with your own asset allocation strategy from whitelisted tokens
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Set stop-loss and take-profit levels to protect your investments automatically
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Performance Fees</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Fund managers earn commission only on profits, aligning incentives
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/10">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Transparent & Trustless</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All transactions on-chain with full transparency and no intermediaries
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
