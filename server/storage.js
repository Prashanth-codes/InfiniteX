import {
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
  } from "./shared/schema";
  import { db } from "./db";
  import { eq, and, inArray, like, desc, gte, lte } from "drizzle-orm";
  
  class DatabaseStorage {
    // User operations
    async getUser(id) {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    }
  
    async getUserByUsername(username) {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user;
    }
  
    async getUserByEmail(email) {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user;
    }
  
    async createUser(user) {
      const [created] = await db.insert(users).values(user).returning();
      return created;
    }
  
    // Measurement operations
    async getMeasurement(id) {
      const [measurement] = await db.select().from(measurements).where(eq(measurements.id, id));
      return measurement;
    }
  
    async getMeasurementsByUserId(userId) {
      return db.select().from(measurements).where(eq(measurements.userId, userId));
    }
  
    async createMeasurement(measurement) {
      const [created] = await db.insert(measurements).values(measurement).returning();
      return created;
    }
  
    // Product operations
    async getProduct(id) {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product;
    }
  
    async getProducts(options = {}) {
      let query = db.select().from(products);
      const conditions = [];
  
      if (options.category) conditions.push(eq(products.category, options.category));
      if (options.gender) conditions.push(eq(products.gender, options.gender));
      if (options.type) conditions.push(eq(products.type, options.type));
      if (options.brand) conditions.push(eq(products.brand, options.brand));
      if (options.occasion) conditions.push(eq(products.occasion, options.occasion));
      if (options.fabric) conditions.push(eq(products.fabric, options.fabric));
      if (options.minPrice !== undefined) conditions.push(gte(products.price, options.minPrice));
      if (options.maxPrice !== undefined) conditions.push(lte(products.price, options.maxPrice));
      if (options.retailerId) conditions.push(eq(products.retailerId, options.retailerId));
      if (options.featured !== undefined) conditions.push(eq(products.isFeatured, options.featured));
  
      if (conditions.length > 0) query = query.where(and(...conditions));
      return query.orderBy(desc(products.createdAt));
    }
  
    async createProduct(product) {
      const [created] = await db.insert(products).values(product).returning();
      return created;
    }
  
    // Avatar operations
    async getAvatar(id) {
      const [avatar] = await db.select().from(avatars).where(eq(avatars.id, id));
      return avatar;
    }
  
    async getAvatarByUserId(userId) {
      const [avatar] = await db.select().from(avatars).where(eq(avatars.userId, userId));
      return avatar;
    }
  
    async createAvatar(avatar) {
      const [created] = await db.insert(avatars).values(avatar).returning();
      return created;
    }
  
    // TryOn operations
    async getTryOnHistory(id) {
      const [history] = await db.select().from(tryOnHistory).where(eq(tryOnHistory.id, id));
      return history;
    }
  
    async getTryOnHistoryByUserId(userId) {
      return db.select().from(tryOnHistory).where(eq(tryOnHistory.userId, userId));
    }
  
    async createTryOnHistory(history) {
      const [created] = await db.insert(tryOnHistory).values(history).returning();
      return created;
    }
  
    // Tailor Service operations
    async getTailorService(id) {
      const [service] = await db.select().from(tailorServices).where(eq(tailorServices.id, id));
      return service;
    }
  
    async getTailorServiceByUserId(userId) {
      const [service] = await db.select().from(tailorServices).where(eq(tailorServices.userId, userId));
      return service;
    }
  
    async getTailorServices(options = {}) {
      let query = db.select().from(tailorServices);
      const conditions = [];
  
      if (options.city) conditions.push(eq(tailorServices.city, options.city));
      if (options.serviceType) conditions.push(eq(tailorServices.serviceType, options.serviceType));
      if (options.minRatePerHour !== undefined) conditions.push(gte(tailorServices.ratePerHour, options.minRatePerHour));
      if (options.maxRatePerHour !== undefined) conditions.push(lte(tailorServices.ratePerHour, options.maxRatePerHour));
      if (options.isVerified !== undefined) conditions.push(eq(tailorServices.isVerified, options.isVerified));
  
      if (conditions.length > 0) query = query.where(and(...conditions));
      return query.orderBy(desc(tailorServices.rating));
    }
  
    async createTailorService(service) {
      const [created] = await db.insert(tailorServices).values(service).returning();
      return created;
    }
  
    // Wishlist operations
    async getWishlistByUserId(userId) {
      const wishlistItems = await db.select().from(wishlist).where(eq(wishlist.userId, userId));
      const result = [];
  
      for (const item of wishlistItems) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        if (product) {
          result.push({ ...item, product });
        }
      }
  
      return result;
    }
  
    async addToWishlist(item) {
      const [existing] = await db.select().from(wishlist).where(
        and(
          eq(wishlist.userId, item.userId),
          eq(wishlist.productId, item.productId)
        )
      );
  
      if (existing) return existing;
  
      const [created] = await db.insert(wishlist).values(item).returning();
      return created;
    }
  
    async removeFromWishlist(userId, productId) {
      await db.delete(wishlist).where(
        and(
          eq(wishlist.userId, userId),
          eq(wishlist.productId, productId)
        )
      );
    }
  }
  
  export const storage = new DatabaseStorage();
  