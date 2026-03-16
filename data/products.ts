export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  rating: number;
  reviews: number;
  category: string;
  image_url: string;
  weight_unit: "kg" | "g" | "pc";
  weight_options: string[];
  is_featured: boolean;
  stock: number;
  tags: string[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Luxury Kaju Katli",
    description: "Traditional diamond-shaped cashew fudge topped with pure silver varq. Made with 100% premium cashews. Slow-cooked to ensure a smooth, velvety texture that melts in your mouth.",
    price: 1200,
    discount_price: 1400,
    rating: 4.8,
    reviews: 124,
    category: "",
    image_url: "/images/products/kaju_katli.jpg",
    weight_unit: "kg",
    weight_options: ["250g", "500g", "1kg", "2kg"],
    is_featured: true,
    stock: 50,
    tags: ["Best Seller", "Pure Cashew", "Festive"]
  },
  {
    id: 2,
    name: "Pure Desi Ghee Besan Laddu",
    description: "Gram flour roasted to perfection in aromatic desi ghee, infused with green cardamom and crunchy almonds. A timeless  passed down through generations.",
    price: 850,
    discount_price: 950,
    rating: 4.9,
    reviews: 89,
    category: "Ghee Special",
    image_url: "/images/products/besan_laddu.jpg",
    weight_unit: "kg",
    weight_options: ["500g", "1kg", "5kg"],
    is_featured: true,
    stock: 30,
    tags: ["Handmade", "Pure Ghee"]
  },
  {
    id: 3,
    name: "Saffron Infused Rasgulla",
    description: "Soft, spongy cottage cheese balls soaked in a delicate saffron-flavored sugar syrup. Each bite releases a burst of floral sweetness.",
    price: 600,
    discount_price: 750,
    rating: 4.7,
    reviews: 212,
    category: "Syrup Base",
    image_url: "/images/products/rasgulla.jpg",
    weight_unit: "pc",
    weight_options: ["6 Pcs", "12 Pcs", "24 Pcs"],
    is_featured: true,
    stock: 100,
    tags: ["Soft", "Saffron"]
  },
  {
    id: 4,
    name: "Motichoor Premium Laddu",
    description: "Fine pearls of gram flour deep-fried in ghee and soaked in cardamom syrup. Perfectly round and incredibly flavorful.",
    price: 750,
    discount_price: 800,
    rating: 5.0,
    reviews: 450,
    category: "Ghee Special",
    image_url: "/images/products/besan_laddu.jpg",
    weight_unit: "kg",
    weight_options: ["500g", "1kg", "2kg"],
    is_featured: false,
    stock: 45,
    tags: ["Customer Favorite"]
  },
  {
    id: 5,
    name: "Premium Gulab Jamun",
    description: " milk-solid balls deep fried and soaked in rose water scented syrup. Soft, juicy, and perfect for every celebration.",
    price: 550,
    discount_price: 650,
    rating: 4.9,
    reviews: 320,
    category: "",
    image_url: "/images/products/gulab_jamun.jpg",
    weight_unit: "kg",
    weight_options: ["500g", "1kg", "2.5kg"],
    is_featured: false,
    stock: 80,
    tags: ["Best Served Warm"]
  },
  {
    id: 6,
    name: "Rose & Nut Barfi",
    description: "Layered barfi with real rose petals and a blend of crushed pistachios and almonds. A modern twist on traditional barfi.",
    price: 1100,
    discount_price: 1300,
    rating: 4.6,
    reviews: 67,
    category: "Signature",
    image_url: "/images/products/rose_barfi.jpg",
    weight_unit: "kg",
    weight_options: ["250g", "500g", "1kg"],
    is_featured: false,
    stock: 25,
    tags: ["Gift Choice"]
  },
  {
    id: 7,
    name: "Saffron Ghee Jalebi",
    description: "Intricately swirled, crispy jalebis made with pure desi ghee and dunked in a rich saffron-infused syrup. Served hot and fresh.",
    price: 500,
    discount_price: 600,
    rating: 4.9,
    reviews: 156,
    category: "Syrup Base",
    image_url: "/images/products/jalebi.jpg",
    weight_unit: "kg",
    weight_options: ["250g", "500g", "1kg"],
    is_featured: true,
    stock: 40,
    tags: ["Hot", "Pure Ghee"]
  },
  {
    id: 8,
    name: "Heritage Mysore Pak",
    description: "The pride of South India. A porous, melt-in-the-mouth delicacy cooked with premium besan, sugar, and an abundance of aromatic desi ghee.",
    price: 900,
    discount_price: 1050,
    rating: 4.8,
    reviews: 92,
    category: "Signature Heritage",
    image_url: "/images/products/Heritage_Mysore_Pak.jpg",
    weight_unit: "kg",
    weight_options: ["500g", "1kg"],
    is_featured: true,
    stock: 35,
    tags: ["Signature Heritage Mysore", "Saffron Ghee", "Ghee Rich", "Heritage"]
  },
  {
    id: 9,
    name: " Mathura Peda",
    description: "Caramelized milk solids kneaded with cardamom and nutmeg. A traditional temple sweet with a rich, profound flavor and authentic texture.",
    price: 700,
    discount_price: 800,
    rating: 4.7,
    reviews: 110,
    category: "",
    image_url: "/images/products/Classic_Mathura_Peda.jpg",
    weight_unit: "kg",
    weight_options: ["250g", "500g", "1kg"],
    is_featured: false,
    stock: 60,
    tags: ["Traditional", "Milk Based"]
  }
];
