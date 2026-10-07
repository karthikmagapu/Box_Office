export type Snack = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Combos' | 'Popcorn' | 'Drinks' | 'Appetizers';
  image: string;
  tags?: string[];
};

export const SNACKS: Snack[] = [
  {
    id: 's-c1',
    name: 'Gold Class VIP Combo',
    description: '1 Large Tub of Salted Popcorn, 1 Large Pepsi, and 1 Nachos with Hot Cheese Sauce. Serves 1-2.',
    price: 450,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=300&auto=format&fit=crop',
    tags: ['Best Seller', 'Value Deal']
  },
  {
    id: 's-c2',
    name: "Couple's Delight Combo",
    description: '1 Large Tub of Caramel Popcorn, 2 Medium Pepsis, and 1 Crispy Fries. Serves 2.',
    price: 580,
    category: 'Combos',
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=300&auto=format&fit=crop',
    tags: ['Couple Special']
  },
  {
    id: 's-p1',
    name: 'Classic Salted Popcorn (Large)',
    description: 'Freshly popped corn tossed in classic sea-salt butter. Crisp & warm.',
    price: 220,
    category: 'Popcorn',
    image: 'https://images.unsplash.com/photo-1578496479914-723b74c351f8?q=80&w=300&auto=format&fit=crop',
    tags: ['Gluten Free', 'Classic']
  },
  {
    id: 's-p2',
    name: 'Gourmet Cheese Popcorn (Large)',
    description: 'Warm popcorn coated with rich, savory cheddar cheese dust.',
    price: 260,
    category: 'Popcorn',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=300&auto=format&fit=crop',
    tags: ['Cheese Lover']
  },
  {
    id: 's-p3',
    name: 'Signature Caramel Popcorn (Large)',
    description: 'Crunchy glazed popcorn infused with rich sweet caramel sugar coating.',
    price: 280,
    category: 'Popcorn',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=300&auto=format&fit=crop',
    tags: ['Sweet Spot']
  },
  {
    id: 's-d1',
    name: 'Pepsi Gold (Large)',
    description: 'Chilled Pepsi served with a slice of lemon to wash down your popcorn.',
    price: 130,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop',
    tags: ['Chilled']
  },
  {
    id: 's-d2',
    name: 'Cold Brew Coffee',
    description: 'Premium organic coffee brewed slow over cold water, served with ice.',
    price: 180,
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=300&auto=format&fit=crop',
    tags: ['Caffeine Kick']
  },
  {
    id: 's-a1',
    name: 'Classic Nachos with Cheese',
    description: 'Crispy salted tortilla chips served with warm melted jalapeno cheddar cheese dip.',
    price: 190,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=300&auto=format&fit=crop',
    tags: ['Warm Dip']
  },
  {
    id: 's-a2',
    name: 'Gourmet VIP Burger',
    description: 'Juicy vegetable patty with crisp lettuce, fresh tomatoes, and special secret sauce in brioche bun.',
    price: 240,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop',
    tags: ['Filling']
  }
];
