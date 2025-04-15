
const { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } = require("drizzle-orm/pg-core");
const { createInsertSchema } = require("drizzle-zod");
const { z } = require("zod");

// User table
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  gender: text("gender").default("unspecified"),
  userType: text("user_type").notNull(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
});

// Body measurements table
const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  gender: text("gender").notNull(),
  bust: real("bust"),
  waist: real("waist").notNull(),
  hip: real("hip").notNull(),
  height: real("height").notNull(),
  weight: real("weight"),
  shoulder: real("shoulder").notNull(),
  neck: real("neck"),
  armLength: real("arm_length"),
  inseam: real("inseam"),
  thigh: real("thigh"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Products table
const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  gender: text("gender").notNull(),
  type: text("type").notNull(),
  brand: text("brand").notNull(),
  occasion: text("occasion"),
  fabric: text("fabric"),
  price: integer("price").notNull(),
  salePrice: integer("sale_price"),
  discount: integer("discount"),
  sizes: jsonb("sizes").notNull(),
  colors: jsonb("colors").notNull(),
  mainImageUrl: text("main_image_url").notNull(),
  additionalImages: jsonb("additional_images"),
  modelUrl: text("model_url"),
  stockAvailable: integer("stock_available").default(0),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isFeatured: boolean("is_featured").default(false),
  retailerId: integer("retailer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3D Avatar table
const avatars = pgTable("avatars", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  gender: text("gender").notNull(),
  skinTone: text("skin_tone"),
  hairStyle: text("hair_style"),
  hairColor: text("hair_color"),
  bodyType: text("body_type"),
  modelUrl: text("model_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// TryOn History
const tryOnHistory = pgTable("try_on_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tailor services
const tailorServices = pgTable("tailor_services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  serviceName: text("service_name").notNull(),
  description: text("description").notNull(),
  serviceType: text("service_type").notNull(),
  ratePerHour: integer("rate_per_hour").notNull(),
  ratePerItem: integer("rate_per_item"),
  specializations: jsonb("specializations"),
  experience: integer("experience"),
  address: text("address"),
  city: text("city"),
  pincode: text("pincode"),
  phoneNumber: text("phone_number"),
  imageUrl: text("image_url"),
  availableDays: jsonb("available_days"),
  isVerified: boolean("is_verified").default(false),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wishlist table
const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Insert schemas
const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true });
const insertMeasurementSchema = createInsertSchema(measurements).omit({ id: true, createdAt: true });
const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true, rating: true, reviewCount: true });
const insertAvatarSchema = createInsertSchema(avatars).omit({ id: true, createdAt: true });
const insertTryOnHistorySchema = createInsertSchema(tryOnHistory).omit({ id: true, createdAt: true });
const insertTailorServiceSchema = createInsertSchema(tailorServices).omit({ id: true, createdAt: true, rating: true, reviewCount: true, isVerified: true });
const insertWishlistSchema = createInsertSchema(wishlist).omit({ id: true, addedAt: true });

module.exports = {
  users,
  measurements,
  products,
  avatars,
  tryOnHistory,
  tailorServices,
  wishlist,
  insertUserSchema,
  insertMeasurementSchema,
  insertProductSchema,
  insertAvatarSchema,
  insertTryOnHistorySchema,
  insertTailorServiceSchema,
  insertWishlistSchema
};
