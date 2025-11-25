
import { CuisineConfig, IngredientType } from './types';

const SUSHI_INGREDIENTS = [
  // Bases
  { id: 'white-rice', name: 'White Sushi Rice', type: 'Base', price: 2.00 } as const,
  { id: 'brown-rice', name: 'Brown Rice', type: 'Base', price: 2.50 } as const,
  { id: 'no-rice', name: 'Cucumber Wrap', type: 'Base', price: 3.00, premium: true } as const,
  // Proteins
  { id: 'salmon', name: 'Fresh Salmon', type: 'Protein', price: 4.00 } as const,
  { id: 'tuna', name: 'Maguro Tuna', type: 'Protein', price: 4.50 } as const,
  { id: 'yellowtail', name: 'Hamachi', type: 'Protein', price: 5.00, premium: true } as const,
  { id: 'shrimp-tempura', name: 'Shrimp Tempura', type: 'Protein', price: 3.50 } as const,
  // Vegetables
  { id: 'avocado', name: 'Avocado', type: 'Vegetable', price: 1.50 } as const,
  { id: 'cucumber', name: 'Cucumber', type: 'Vegetable', price: 1.00 } as const,
  { id: 'jalapeno', name: 'Jalapeño', type: 'Vegetable', price: 1.00 } as const,
  // Toppings
  { id: 'tobiko', name: 'Tobiko', type: 'Topping', price: 2.00 } as const,
  { id: 'sesame', name: 'Sesame Seeds', type: 'Topping', price: 0.50 } as const,
  { id: 'crunch', name: 'Tempura Crunch', type: 'Topping', price: 0.50 } as const,
  // Sauces
  { id: 'spicy-mayo', name: 'Spicy Mayo', type: 'Sauce', price: 0.75 } as const,
  { id: 'eel-sauce', name: 'Eel Sauce', type: 'Sauce', price: 0.75 } as const,
];

const BURGER_INGREDIENTS = [
  // Bases (Buns)
  { id: 'brioche', name: 'Brioche Bun', type: 'Base', price: 2.00 } as const,
  { id: 'sesame-bun', name: 'Sesame Bun', type: 'Base', price: 1.50 } as const,
  { id: 'lettuce-wrap', name: 'Lettuce Wrap', type: 'Base', price: 1.00 } as const,
  // Proteins (Patties)
  { id: 'beef-patty', name: 'Angus Beef', type: 'Protein', price: 5.00 } as const,
  { id: 'wagyu-beef', name: 'Wagyu Beef', type: 'Protein', price: 8.00, premium: true } as const,
  { id: 'crispy-chicken', name: 'Crispy Chicken', type: 'Protein', price: 4.50 } as const,
  { id: 'plant-based', name: 'Plant-Based Patty', type: 'Protein', price: 5.50 } as const,
  // Vegetables
  { id: 'lettuce', name: 'Iceberg Lettuce', type: 'Vegetable', price: 0.50 } as const,
  { id: 'tomato', name: 'Heirloom Tomato', type: 'Vegetable', price: 1.00 } as const,
  { id: 'red-onion', name: 'Red Onion', type: 'Vegetable', price: 0.50 } as const,
  { id: 'pickles', name: 'House Pickles', type: 'Vegetable', price: 0.75 } as const,
  // Toppings (Cheese/Extras)
  { id: 'cheddar', name: 'Aged Cheddar', type: 'Topping', price: 1.50 } as const,
  { id: 'bacon', name: 'Applewood Bacon', type: 'Topping', price: 2.00, premium: true } as const,
  { id: 'egg', name: 'Fried Egg', type: 'Topping', price: 1.50 } as const,
  // Sauces
  { id: 'garlic-aioli', name: 'Garlic Aioli', type: 'Sauce', price: 0.75 } as const,
  { id: 'bbq', name: 'Smoky BBQ', type: 'Sauce', price: 0.75 } as const,
  { id: 'truffle-mayo', name: 'Truffle Mayo', type: 'Sauce', price: 1.50, premium: true } as const,
];

export const CUISINES: Record<string, CuisineConfig> = {
  sushi: {
    id: 'sushi',
    name: 'Sushi',
    label: 'Sakura Sushi Bar',
    description: 'Exquisite Japanese flavors customized by you.',
    themeColor: 'sushi-red',
    ingredients: SUSHI_INGREDIENTS,
    portionSizes: ['Hand Roll (1pc)', 'Half Roll (4pcs)', 'Full Roll (8pcs)'],
    presets: [
      // Builder Placeholder (handled in UI, but good to have ID if needed)
      
      // Take-away drank
      {
        id: 'cola',
        name: 'Cola Blikje',
        description: '33cl',
        price: 1.50,
        category: 'Take-away drank',
        image: 'https://picsum.photos/800/600?random=1',
        ingredients: { baseId: '', proteinIds: [], vegetableIds: [], toppingIds: [], sauceId: '' }
      },
      {
        id: 'cola-zero',
        name: 'Cola Zero Blikje',
        description: '33cl',
        price: 1.50,
        category: 'Take-away drank',
        image: 'https://picsum.photos/800/600?random=1',
        ingredients: { baseId: '', proteinIds: [], vegetableIds: [], toppingIds: [], sauceId: '' }
      },
      {
        id: 'sake-bottle',
        name: 'Sake 180 ml',
        description: 'Traditional Japanese Rice Wine',
        price: 4.80,
        category: 'Take-away drank',
        image: 'https://picsum.photos/800/600?random=2',
        ingredients: { baseId: '', proteinIds: [], vegetableIds: [], toppingIds: [], sauceId: '' }
      },

      // Salades
      {
        id: 'wakame-salad',
        name: 'Wakame Salade',
        description: 'Seaweed salad with sesame',
        price: 5.50,
        category: 'Salades',
        image: 'https://picsum.photos/800/600?random=3',
        ingredients: { baseId: '', proteinIds: [], vegetableIds: ['cucumber'], toppingIds: ['sesame'], sauceId: '' }
      },
      {
        id: 'chicken-salad',
        name: 'Kip Salade',
        description: 'Fresh salad with grilled chicken',
        price: 7.50,
        category: 'Salades',
        image: 'https://picsum.photos/800/600?random=4',
        ingredients: { baseId: '', proteinIds: ['crispy-chicken'], vegetableIds: ['lettuce', 'tomato'], toppingIds: [], sauceId: 'spicy-mayo' }
      },

      // Sashimi
      {
        id: 'sashimi-salmon',
        name: 'Sashimi Zalm (5st)',
        description: 'Fresh slices of raw salmon',
        price: 8.50,
        category: 'Sashimi',
        image: 'https://picsum.photos/800/600?random=5',
        ingredients: { baseId: '', proteinIds: ['salmon'], vegetableIds: [], toppingIds: [], sauceId: '' }
      },
      {
        id: 'sashimi-tuna',
        name: 'Sashimi Tonijn (5st)',
        description: 'Fresh slices of raw tuna',
        price: 9.50,
        category: 'Sashimi',
        image: 'https://picsum.photos/800/600?random=6',
        ingredients: { baseId: '', proteinIds: ['tuna'], vegetableIds: [], toppingIds: [], sauceId: '' }
      },

      // Nigiri
      {
        id: 'nigiri-salmon',
        name: 'Nigiri Zalm (2st)',
        description: 'Salmon on pressed rice',
        price: 4.00,
        category: 'Nigiri',
        image: 'https://picsum.photos/800/600?random=7',
        ingredients: { baseId: 'white-rice', proteinIds: ['salmon'], vegetableIds: [], toppingIds: [], sauceId: '' }
      },
      {
        id: 'nigiri-unagi',
        name: 'Nigiri Unagi (2st)',
        description: 'Grilled eel on pressed rice',
        price: 5.00,
        category: 'Nigiri',
        image: 'https://picsum.photos/800/600?random=8',
        ingredients: { baseId: 'white-rice', proteinIds: [], vegetableIds: [], toppingIds: [], sauceId: 'eel-sauce' }
      },

      // Hoso Maki
      {
        id: 'hoso-cucumber',
        name: 'Hoso Komkommer (6st)',
        description: 'Small roll with cucumber',
        price: 4.50,
        category: 'Hoso Maki',
        image: 'https://picsum.photos/800/600?random=6',
        ingredients: { baseId: 'white-rice', proteinIds: [], vegetableIds: ['cucumber'], toppingIds: [], sauceId: '' }
      },
      {
        id: 'hoso-salmon',
        name: 'Hoso Zalm (6st)',
        description: 'Small roll with salmon',
        price: 5.50,
        category: 'Hoso Maki',
        image: 'https://picsum.photos/800/600?random=7',
        ingredients: { baseId: 'white-rice', proteinIds: ['salmon'], vegetableIds: [], toppingIds: [], sauceId: '' }
      },

      // Inside Out Roll
      {
        id: 'california-roll',
        name: 'California Roll (8st)',
        description: 'Crab, avocado, cucumber, tobiko',
        price: 11.00,
        category: 'Inside Out Roll',
        image: 'https://picsum.photos/800/600?random=9',
        ingredients: { baseId: 'white-rice', proteinIds: [], vegetableIds: ['avocado', 'cucumber'], toppingIds: ['tobiko'], sauceId: '' }
      },
      {
        id: 'spicy-tuna-roll',
        name: 'Spicy Tuna Roll (8st)',
        description: 'Spicy tuna, cucumber, spicy mayo',
        price: 12.00,
        category: 'Inside Out Roll',
        image: 'https://picsum.photos/800/600?random=10',
        ingredients: { baseId: 'white-rice', proteinIds: ['tuna'], vegetableIds: ['cucumber'], toppingIds: ['sesame'], sauceId: 'spicy-mayo' }
      },

      // Sushi a la carte (Special Rolls)
      {
        id: 'dragon-roll',
        name: 'Golden Dragon',
        description: 'Luxurious eel and tempura shrimp.',
        price: 16.00,
        category: 'Sushi a la carte',
        image: 'https://picsum.photos/800/600?random=8',
        ingredients: {
          baseId: 'white-rice',
          proteinIds: ['shrimp-tempura'],
          vegetableIds: ['avocado'],
          toppingIds: ['tobiko'],
          sauceId: 'eel-sauce'
        }
      },
      {
        id: 'gemini-3d-special',
        name: 'Gemini 3D Special',
        description: 'Experience our custom 3D model in AR!',
        price: 15.00,
        category: 'Sushi a la carte',
        image: 'https://picsum.photos/800/600?random=11',
        modelUrl: '/23.11.2025.glb',
        ingredients: {
          baseId: 'white-rice',
          proteinIds: ['salmon'],
          vegetableIds: ['cucumber'],
          toppingIds: ['sesame'],
          sauceId: 'spicy-mayo'
        }
      },

      // Wok
      {
        id: 'wok-chicken',
        name: 'Wok Kip',
        description: 'Stir-fried noodles with chicken and veg',
        price: 13.50,
        category: 'Wok',
        image: 'https://picsum.photos/800/600?random=12',
        ingredients: { baseId: '', proteinIds: ['crispy-chicken'], vegetableIds: ['red-onion'], toppingIds: [], sauceId: '' }
      },
      {
        id: 'pad-thai-shrimp',
        name: 'Pad Thai Scampi',
        description: 'Rice noodles with shrimp, egg, peanuts',
        price: 14.50,
        category: 'Pad Thai',
        image: 'https://picsum.photos/800/600?random=13',
        ingredients: { baseId: '', proteinIds: ['shrimp-tempura'], vegetableIds: [], toppingIds: ['crunch'], sauceId: '' }
      },

      // Curry
      {
        id: 'red-curry',
        name: 'Red Curry Chicken',
        description: 'Spicy coconut curry with bamboo shoots',
        price: 14.00,
        category: 'Curry',
        image: 'https://picsum.photos/800/600?random=14',
        ingredients: { baseId: 'white-rice', proteinIds: ['crispy-chicken'], vegetableIds: [], toppingIds: [], sauceId: '' }
      }
    ]
  },
  burger: {
    id: 'burger',
    name: 'Burger',
    label: 'Iron Grill Bistro',
    description: 'Gourmet burgers crafted with premium ingredients.',
    themeColor: 'orange-500',
    ingredients: BURGER_INGREDIENTS,
    portionSizes: ['Single Patty', 'Double Stack', 'Slider Trio'],
    presets: [
      {
        id: 'classic-stack',
        name: 'The Classic Stack',
        description: 'Timeless taste with premium angus.',
        price: 14.00,
        image: 'https://picsum.photos/800/600?random=15',
        ingredients: {
          baseId: 'brioche',
          proteinIds: ['beef-patty'],
          vegetableIds: ['lettuce', 'tomato', 'pickles'],
          toppingIds: ['cheddar'],
          sauceId: 'garlic-aioli'
        }
      },
      {
        id: 'royal-wagyu',
        name: 'Royal Wagyu',
        description: 'Decadence in every bite.',
        price: 22.00,
        image: 'https://picsum.photos/800/600?random=16',
        ingredients: {
          baseId: 'sesame-bun',
          proteinIds: ['wagyu-beef'],
          vegetableIds: ['red-onion'],
          toppingIds: ['bacon', 'egg'],
          sauceId: 'truffle-mayo'
        }
      }
    ]
  }
};
