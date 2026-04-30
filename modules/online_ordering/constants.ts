export const COLORS = {
  cream: "#FDEFDE",
  offWhite: "#FEFDFA",
  brandYellow: "#FECE04",
  midGray: "#737373",
  pureBlack: "#000000",
  successGreen: "#7ED957",
  deepMaroon: "#811920",
};

export const CATEGORIES = [
  { id: "popular", name: "Popular", emoji: "🔥" },
  { id: "pizzas", name: "Pizzas", emoji: "🍕" },
  { id: "burgers", name: "Burgers", emoji: "🍔" },
  { id: "starters", name: "Starters", emoji: "🍗" },
  { id: "sandwiches", name: "Sandwiches & Platters", emoji: "🥪" },
  { id: "sides", name: "Side Orders", emoji: "🍟" },
  { id: "addons", name: "Add-ons", emoji: "🥗" },
  { id: "drinks", name: "Soft Drinks", emoji: "🥤" },
];

export const DISHES = [
  { 
    id: "d1", 
    name: "Crown Crust Pizza", 
    price: 1430, 
    rating: 4.1, 
    category: "pizzas", 
    description: "Scrumptious Pizza with a yummy blend of Grilled Chicken, Olives, Onion, Capsicum and Special Sauce.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    badge: "Hot",
    variations: [
      { name: "Regular", price: 1430 },
      { name: "Large", price: 1980 },
      { name: "Party", price: 3050 }
    ]
  },
  { 
    id: "d2", 
    name: "Beef Pepperoni Thin Crust", 
    price: 1430, 
    rating: 4.1, 
    category: "pizzas", 
    description: "A crispy thin crust topped with beef pepperoni, mozzarella cheese, and rich marinara sauce.",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop",
    badge: "Best Seller",
    variations: [
      { name: "Regular", price: 1430 },
      { name: "Large", price: 1980 },
      { name: "Party", price: 3050 }
    ]
  },
  { 
    id: "d3", 
    name: "Behari Kabab", 
    price: 1430, 
    rating: 4.2, 
    category: "starters", 
    description: "Enjoy Special Chicken Behari Kabab, Grilled Chicken with Onion, Jalapeno and Ginger Garnish.",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop"
  },
  { 
    id: "d4", 
    name: "Chicken Tandoori", 
    price: 660, 
    rating: 4.5, 
    category: "starters", 
    description: "Our traditionally developed Tandoori Chicken with Onion, Olives, Jalapeno and Tomato Sauce.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=400&h=300&fit=crop"
  },
  { 
    id: "d5", 
    name: "Calzone Chunks", 
    price: 1200, 
    rating: 4.3, 
    category: "starters", 
    description: "4 Pcs Stuffed Calzone Chunks Served With Sauce & Sauce",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop"
  },
  { 
    id: "d6", 
    name: "Bazinga Burger", 
    price: 850, 
    rating: 4.4, 
    category: "burgers", 
    description: "Crispy fried to perfection boneless thigh with signature sauce and lettuce",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    badge: "Classic"
  },
  { 
    id: "d7", 
    name: "Special Roasted", 
    price: 1500, 
    rating: 4.6, 
    category: "starters", 
    description: "4 Pcs Bihari Rolls, 8 Pcs Wings Served With Fries & Sauce",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop"
  },
  { 
    id: "d8", 
    name: "Soft Drink", 
    price: 99, 
    rating: 4.0, 
    category: "drinks", 
    description: "500ml chilled soft drink",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop"
  },
];

export const DEALS = [
  { id: "deal1", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
  { id: "deal2", name: "Bazinga Burger", price: 850, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "deal3", name: "Special Roasted", price: 1500, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop" },
  { id: "deal4", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
  { id: "deal5", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
  { id: "deal6", name: "Bazinga Burger", price: 850, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "deal7", name: "Special Roasted", price: 1500, image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop" },
  { id: "deal8", name: "Calzone Chunks", price: 1200, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop" },
];
