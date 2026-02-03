import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Cleanup
    await prisma.reviewImage.deleteMany()
    await prisma.review.deleteMany()
    await prisma.business.deleteMany()
    await prisma.user.deleteMany()

    // Create User
    const user = await prisma.user.create({
        data: {
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'USER',
        }
    })

    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'ADMIN'
        }
    })

    // Create Businesses
    const businesses = [
        {
            name: "The Artisan Coffee House",
            description: "A cozy spot for coffee lovers featuring single-origin beans and homemade pastries. Perfect for working remotely or catching up with friends.",
            category: "Restaurants",
            rating: 4.8,
            reviewCount: 124,
            image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop",
            address: "123 Market St, Downtown"
        },
        {
            name: "Urban Boutique",
            description: "Trendy fashion for the modern soul.",
            category: "Shopping",
            rating: 4.5,
            reviewCount: 89,
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop",
            address: "45 Fashion Ave"
        },
        {
            name: "Tech Fix Pro",
            description: "Expert device repair and diagnostics.",
            category: "Services",
            rating: 4.9,
            reviewCount: 215,
            image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600&auto=format&fit=crop",
            address: "88 Tech Blvd"
        },
        {
            name: "Green Garden Bistro",
            description: "Farm to table freshness.",
            category: "Restaurants",
            rating: 4.2,
            reviewCount: 45,
            image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop",
            address: "22 Garden Lane"
        },
        {
            name: "Quick Cuts Barber",
            description: "Fast and professional cuts.",
            category: "Services",
            rating: 4.6,
            reviewCount: 78,
            image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=600&auto=format&fit=crop",
            address: "101 Main St"
        }
    ]

    for (const b of businesses) {
        await prisma.business.create({
            data: b
        })
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
