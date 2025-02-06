import { Product, Category, Image } from "../../lib/types";

const images: Image[] = [
  {
    id: 1,
    filename: "/img/products/smoothie-bowl.png",
    description: "Morning Boost Smoothie Bowl",
  },
  {
    id: 2,
    filename: "/img/products/eggcellent-wrap.png",
    description: "Eggcellent Wrap",
  },
  {
    id: 3,
    filename: "/img/products/peanut-butter-toast.png",
  },
  {
    id: 4,
    filename: "/img/breakfast.png",
  },
  {
    id: 5,
    filename: "/img/lunch.png",
  },
  {
    id: 6,
    filename: "/img/sides.png",
  },
];

export const categories: Category[] = [
  {
    id: 0,
    name: "Breakfast",
    image: images[3],
  },
  {
    id: 1,
    name: "Lunch & Dinner",
    image: images[4],
  },
  {
    id: 2,
    name: "Sides",
    image: images[5],
  },
];

export const products: Product[] = [
  {
    id: 1,
    category: categories[0],
    description:
      "A blend of acai, banana, and mixed berries topped with granola, chia seeds, and coconut flakes.",
    title: "Morning Boost Smoothie Bowl",
    available: true,
    image: images[0],
    kcal: 300,
    price: 4.5,
  },
  {
    id: 2,
    category: categories[0],
    description:
      "Whole-grain wrap filled with scrambled eggs, spinach, and a light yogurt-based sauce.",
    title: "Eggcellent Wrap",
    available: true,
    image: images[1],
    kcal: 250,
    price: 3.5,
  },
  {
    id: 3,
    category: categories[0],
    available: true,
    kcal: 220,
    price: 2.8,
    image: images[2],
    description:
      "Whole-grain toast with natural peanut butter and banana slices.",
    title: "Peanut Butter Toast",
  },
];
