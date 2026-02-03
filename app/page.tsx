import { Button } from "@/components/ui/button";
import { Hero } from "@/components/hero";
import { BusinessCard } from "@/components/business-card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const prisma = new PrismaClient();
// force dynamic
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Fetch top 3 rated businesses
  const featured = await prisma.business.findMany({
    orderBy: { rating: 'desc' },
    take: 3
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Featured Section */}
      <section className="container py-24 px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">Top Rated Businesses</h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Explore the highest-rated local spots as voted by our community this week.
            </p>
          </div>
          <Link href="/search">
            <Button variant="ghost" className="group rounded-full px-6 hover:bg-white/5">
              View all
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item) => (
            <BusinessCard key={item.id} business={item} />
          ))}
        </div>
      </section>

      {/* Gradient embellishments */}
      <div className="fixed bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-background to-transparent -z-10 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-20 pointer-events-none" />
    </div>
  );
}
