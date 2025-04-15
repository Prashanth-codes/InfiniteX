const { db } = require("./db");
const { products } = require("@shared/schema");

async function seedDatabase() {
  console.log("Seeding database with initial data...");

  try {
    // Check if products already exist
    const existingProducts = await db.select().from(products);

    if (existingProducts.length > 0) {
      console.log(`Database already has ${existingProducts.length} products, skipping seed`);
      return;
    }

    // Product seed data
    const productData = [
      {
        name: "Classic White Button-Down Shirt",
        description: "A timeless white button-down shirt perfect for any formal occasion.",
        category: "shirts",
        gender: "male",
        type: "formal",
        brand: "InfiniteX",
        occasion: "formal",
        fabric: "cotton",
        price: 249900,
        sizes: JSON.stringify(["S", "M", "L", "XL", "XXL"]),
        colors: JSON.stringify([{ name: "White", code: "#FFFFFF" }]),
        mainImageUrl: "https://i.imgur.com/2UZ0Yon.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/oWpyeUs.jpg",
          "https://i.imgur.com/1O3cxtC.jpg"
        ]),
        modelUrl: "https://i.imgur.com/2UZ0Yon.jpg",
        stockAvailable: 100,
        isFeatured: true
      },
      {
        name: "Slim Fit Blue Casual Shirt",
        description: "A stylish blue casual shirt with a contemporary slim fit design.",
        category: "shirts",
        gender: "male",
        type: "casual",
        brand: "InfiniteX",
        occasion: "casual",
        fabric: "cotton",
        price: 189900,
        sizes: JSON.stringify(["S", "M", "L", "XL"]),
        colors: JSON.stringify([{ name: "Blue", code: "#1E3A8A" }]),
        mainImageUrl: "https://i.imgur.com/H75nJT5.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/H75nJT5.jpg",
          "https://i.imgur.com/mHlePs9.jpg"
        ]),
        modelUrl: "https://i.imgur.com/H75nJT5.jpg",
        stockAvailable: 80,
        isFeatured: true
      },
      {
        name: "Elegant Wedding Sherwani",
        description: "A luxurious sherwani for wedding ceremonies and special occasions.",
        category: "ethnic",
        gender: "male",
        type: "traditional",
        brand: "InfiniteX",
        occasion: "wedding",
        fabric: "silk",
        price: 1299900,
        sizes: JSON.stringify(["38", "40", "42", "44"]),
        colors: JSON.stringify([
          { name: "Gold", code: "#D4AF37" },
          { name: "Maroon", code: "#800000" }
        ]),
        mainImageUrl: "https://i.imgur.com/1O3cxtC.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/1O3cxtC.jpg",
          "https://i.imgur.com/oWpyeUs.jpg"
        ]),
        modelUrl: "https://i.imgur.com/1O3cxtC.jpg",
        stockAvailable: 30,
        isFeatured: true
      },
      {
        name: "Premium Cotton Kurta Pajama",
        description: "A comfortable cotton kurta pajama set for everyday and festive wear.",
        category: "ethnic",
        gender: "male",
        type: "traditional",
        brand: "InfiniteX",
        occasion: "festival",
        fabric: "cotton",
        price: 349900,
        sizes: JSON.stringify(["38", "40", "42", "44"]),
        colors: JSON.stringify([
          { name: "White", code: "#FFFFFF" },
          { name: "Beige", code: "#F5F5DC" }
        ]),
        mainImageUrl: "https://i.imgur.com/oWpyeUs.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/oWpyeUs.jpg",
          "https://i.imgur.com/V2nHKlw.jpg"
        ]),
        modelUrl: "https://i.imgur.com/oWpyeUs.jpg",
        stockAvailable: 50,
        isFeatured: false
      },
      {
        name: "Elegant Black Cocktail Dress",
        description: "A sophisticated black cocktail dress perfect for evening events.",
        category: "dresses",
        gender: "female",
        type: "formal",
        brand: "InfiniteX",
        occasion: "party",
        fabric: "polyester",
        price: 499900,
        sizes: JSON.stringify(["XS", "S", "M", "L"]),
        colors: JSON.stringify([{ name: "Black", code: "#000000" }]),
        mainImageUrl: "https://i.imgur.com/BtBMYqU.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/BtBMYqU.jpg",
          "https://i.imgur.com/LQC9aCc.jpg"
        ]),
        modelUrl: "https://i.imgur.com/BtBMYqU.jpg",
        stockAvailable: 40,
        isFeatured: true
      },
      {
        name: "Casual Summer Floral Dress",
        description: "A lightweight floral printed dress perfect for summer days.",
        category: "dresses",
        gender: "female",
        type: "casual",
        brand: "InfiniteX",
        occasion: "casual",
        fabric: "cotton",
        price: 199900,
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify([{ name: "Blue Floral", code: "#4169E1" }]),
        mainImageUrl: "https://i.imgur.com/LQC9aCc.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/LQC9aCc.jpg",
          "https://i.imgur.com/fh3TxOD.jpg"
        ]),
        modelUrl: "https://i.imgur.com/LQC9aCc.jpg",
        stockAvailable: 60,
        isFeatured: true
      },
      {
        name: "Kanchipuram Silk Saree",
        description: "A luxurious Kanchipuram silk saree with intricate gold border work.",
        category: "sarees",
        gender: "female",
        type: "traditional",
        brand: "InfiniteX",
        occasion: "wedding",
        fabric: "silk",
        price: 1499900,
        sizes: JSON.stringify(["Free Size"]),
        colors: JSON.stringify([
          { name: "Red", code: "#FF0000" },
          { name: "Maroon", code: "#800000" }
        ]),
        mainImageUrl: "https://i.imgur.com/K7sFtZL.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/K7sFtZL.jpg",
          "https://i.imgur.com/XyPRbpT.jpg"
        ]),
        modelUrl: "https://i.imgur.com/K7sFtZL.jpg",
        stockAvailable: 25,
        isFeatured: true
      },
      {
        name: "Designer Anarkali Suit",
        description: "A stunning anarkali suit with intricate embroidery work.",
        category: "suits",
        gender: "female",
        type: "traditional",
        brand: "InfiniteX",
        occasion: "festival",
        fabric: "georgette",
        price: 699900,
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify([
          { name: "Teal", code: "#008080" },
          { name: "Navy", code: "#000080" }
        ]),
        mainImageUrl: "https://i.imgur.com/8FZm8Dy.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/8FZm8Dy.jpg",
          "https://i.imgur.com/9T5aL1c.jpg"
        ]),
        modelUrl: "https://i.imgur.com/8FZm8Dy.jpg",
        stockAvailable: 35,
        isFeatured: false
      },
      {
        name: "Trendy Casual Top",
        description: "A fashionable top for everyday casual wear.",
        category: "tops",
        gender: "female",
        type: "casual",
        brand: "InfiniteX",
        occasion: "casual",
        fabric: "cotton",
        price: 149900,
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify([
          { name: "White", code: "#FFFFFF" },
          { name: "Pink", code: "#FFC0CB" }
        ]),
        mainImageUrl: "https://i.imgur.com/fh3TxOD.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/fh3TxOD.jpg",
          "https://i.imgur.com/LQC9aCc.jpg"
        ]),
        modelUrl: "https://i.imgur.com/fh3TxOD.jpg",
        stockAvailable: 75,
        isFeatured: false
      },
      {
        name: "Formal Office Blouse",
        description: "An elegant formal blouse suitable for office and professional settings.",
        category: "tops",
        gender: "female",
        type: "formal",
        brand: "InfiniteX",
        occasion: "office",
        fabric: "polyester",
        price: 229900,
        sizes: JSON.stringify(["XS", "S", "M", "L"]),
        colors: JSON.stringify([
          { name: "White", code: "#FFFFFF" },
          { name: "Black", code: "#000000" }
        ]),
        mainImageUrl: "https://i.imgur.com/BtBMYqU.jpg",
        additionalImages: JSON.stringify([
          "https://i.imgur.com/BtBMYqU.jpg",
          "https://i.imgur.com/fh3TxOD.jpg"
        ]),
        modelUrl: "https://i.imgur.com/BtBMYqU.jpg",
        stockAvailable: 45,
        isFeatured: false
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();
    console.log(`Successfully seeded database with ${insertedProducts.length} products`);

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = {
  seedDatabase
};
