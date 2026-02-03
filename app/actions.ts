"use server"

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

const prisma = new PrismaClient()

export async function submitReview(formData: FormData) {
    const businessId = formData.get("businessId") as string
    const rating = parseInt(formData.get("rating") as string)
    const text = formData.get("text") as string

    // Hardcoded user for demo
    // In real app, get session userId
    const demoUserId = (await prisma.user.findFirst({ where: { email: "demo@example.com" } }))?.id

    if (!demoUserId) throw new Error("User not found")

    await prisma.review.create({
        data: {
            businessId,
            userId: demoUserId,
            rating,
            text,
            status: "PENDING"
        }
    })

    revalidatePath(`/business/${businessId}`)
    return { success: true }
}

export async function getPendingReviews() {
    return prisma.review.findMany({
        where: { status: "PENDING" },
        include: {
            user: true,
            business: true
        },
        orderBy: { createdAt: "desc" }
    })
}

export async function approveReview(reviewId: string) {
    const review = await prisma.review.update({
        where: { id: reviewId },
        data: { status: "APPROVED" }
    })

    // Recalculate rating for the business
    const businessId = review.businessId
    const aggregates = await prisma.review.aggregate({
        where: { businessId, status: "APPROVED" },
        _avg: { rating: true },
        _count: { rating: true }
    })

    await prisma.business.update({
        where: { id: businessId },
        data: {
            rating: aggregates._avg.rating || 0,
            reviewCount: aggregates._count.rating || 0
        }
    })

    revalidatePath("/admin/dashboard")
    revalidatePath(`/business/${businessId}`)
}

export async function rejectReview(reviewId: string) {
    await prisma.review.update({
        where: { id: reviewId },
        data: { status: "REJECTED" }
    })
    revalidatePath("/admin/dashboard")
}

export async function registerBusiness(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const category = formData.get("category") as string
    const address = formData.get("address") as string
    const image = formData.get("image") as string || null

    if (!name || !description || !category || !address) {
        throw new Error("Missing required fields")
    }

    const business = await prisma.business.create({
        data: {
            name,
            description,
            category,
            address,
            image,
            rating: 0,
            reviewCount: 0
        }
    })

    revalidatePath("/search")
    return { success: true, businessId: business.id }
}
