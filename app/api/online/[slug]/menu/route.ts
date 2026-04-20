import { NextResponse } from "next/server";

// Mock database for menu categories and dishes
const MOCK_MENU = {
  categories: [
    { id: "bakery", name: "Bakery", icon: "🥐" },
    { id: "seafood", name: "Seafood", icon: "🦀" },
    { id: "pizza", name: "Pizza", icon: "🍕" },
    { id: "chicken", name: "Chicken", icon: "🍗" },
    { id: "beverages", name: "Beverages", icon: "☕" },
    { id: "burgers", name: "Burgers", icon: "🍔" },
  ],
  dishes: [
    { id: "d1", name: "Fish Burger", price: 350, rating: 4.8, category: "seafood", image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=300&h=300&auto=format&fit=crop" },
    { id: "d2", name: "Beef Burger", price: 550, rating: 4.5, category: "burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&auto=format&fit=crop" },
    { id: "d3", name: "Chicken Burger", price: 250, rating: 4.2, category: "chicken", image: "https://images.unsplash.com/photo-1543353071-087092ec393a?w=300&h=300&auto=format&fit=crop" },
    { id: "d4", name: "Cheese Burger", price: 550, rating: 4.7, category: "burgers", image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=300&h=300&auto=format&fit=crop" },
  ]
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  
  // In a real scenario, we would query the database using the slug
  // const restaurant = await db.restaurants.findUnique({ where: { slug } });
  
  return NextResponse.json({
    restaurantName: slug.replace("-", " ").toUpperCase(),
    menu: MOCK_MENU
  });
}
