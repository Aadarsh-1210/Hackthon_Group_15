import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
    rating: number
    max?: number
    size?: number
    className?: string
}

export function StarRating({ rating, max = 5, size = 16, className }: StarRatingProps) {
    return (
        <div className={cn("flex space-x-0.5", className)}>
            {Array.from({ length: max }).map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={cn(
                        "transition-colors",
                        i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < rating
                                ? "fill-yellow-400/50 text-yellow-400"
                                : "fill-muted text-muted-foreground"
                    )}
                />
            ))}
        </div>
    )
}
