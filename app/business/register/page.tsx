"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { registerBusiness } from "@/app/actions"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function RegisterBusinessPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            const result = await registerBusiness(formData)
            if (result.success) {
                router.push(`/business/${result.businessId}`)
            }
        } catch (error) {
            alert("Failed to register business. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-2xl py-24 mx-auto px-4">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Register Your Business</CardTitle>
                    <CardDescription>
                        Join our community and reach thousands of local customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Business Name</Label>
                            <Input id="name" name="name" required placeholder="e.g. The Coffee House" className="bg-white/5 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                name="category"
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="Restaurants">Restaurants</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Services">Services</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" required placeholder="e.g. 123 Main St, New York, NY" className="bg-white/5 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                required
                                placeholder="Tell us about your business..."
                                className="min-h-[100px] bg-white/5 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL (Optional)</Label>
                            <Input id="image" name="image" placeholder="https://..." className="bg-white/5 border-white/10" />
                            <p className="text-xs text-muted-foreground">Provide a link to a high-quality image of your business.</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                "Register Business"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
