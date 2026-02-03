import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPendingReviews, approveReview, rejectReview } from "@/app/actions";
import { Check, X } from "lucide-react";

// Force dynamic to fetch latest reviews
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const reviews = await getPendingReviews();

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Reviews ({reviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {reviews.length === 0 ? (
                            <p className="text-muted-foreground">No pending reviews.</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="flex flex-col md:flex-row items-start md:items-center justify-between border p-4 rounded-lg bg-card/50">
                                        <div className="space-y-1 mb-4 md:mb-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{review.user.name}</span>
                                                <span className="text-muted-foreground">reviewed</span>
                                                <span className="font-semibold text-indigo-400">{review.business.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-yellow-500">
                                                <span>{'★'.repeat(review.rating)}</span>
                                                <span className="text-muted-foreground">({review.rating}/5)</span>
                                            </div>
                                            <p className="text-sm">{review.text}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={async () => {
                                                'use server'
                                                await approveReview(review.id)
                                            }}>
                                                <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                                                    <Check className="mr-1 h-4 w-4" /> Approve
                                                </Button>
                                            </form>
                                            <form action={async () => {
                                                'use server'
                                                await rejectReview(review.id)
                                            }}>
                                                <Button size="sm" variant="destructive">
                                                    <X className="mr-1 h-4 w-4" /> Reject
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
