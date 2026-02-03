import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// force dynamic
export const dynamic = 'force-dynamic'

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; q?: string }>;
}) {
    const { category: categoryFilter, q: query } = await searchParams;

    const where: any = {};
    if (categoryFilter) {
        where.category = categoryFilter;
    }
    if (query) {
        where.OR = [
            { name: { contains: query } }, // sqlite contains is simpler, casing might vary but sufficient for hackathon
            { description: { contains: query } }
        ]
    }

    const filteredBusinesses = await prisma.business.findMany({
        where,
        orderBy: { rating: 'desc' }
    });

    return (
        <div className="container py-8 mx-auto px-4">
            <div className="mb-8 space-y-4">
                <h1 className="text-3xl font-bold">
                    {categoryFilter ? `${categoryFilter} in your area` : query ? `Search results for "${query}"` : "All Businesses"}
                </h1>
                <div className="flex gap-2">
                    {["Restaurants", "Shopping", "Services"].map(cat => (
                        <Link key={cat} href={`/search?category=${cat}`}>
                            <Badge variant={categoryFilter === cat ? "default" : "secondary"} className="cursor-pointer px-4 py-1">
                                {cat}
                            </Badge>
                        </Link>
                    ))}
                    <Link href="/search">
                        <Badge variant={!categoryFilter && !query ? "default" : "secondary"} className="cursor-pointer px-4 py-1">
                            All
                        </Badge>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.length === 0 && (
                    <p className="text-muted-foreground col-span-3">No businesses found.</p>
                )}
                {filteredBusinesses.map((item) => (
                    <Link href={`/business/${item.id}`} key={item.id} className="group">
                        <Card className="glass-card hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden h-full flex flex-col">
                            <div className="aspect-video relative overflow-hidden bg-muted">
                                {item.image && (
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge variant="glass">{item.category}</Badge>
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <CardDescription className="flex items-center text-xs">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {item.address}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <StarRating rating={item.rating} size={16} />
                                        <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{item.reviewCount} reviews</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
