const { createServer } = require("http");
const { storage } = require("./storage");
const {
  insertUserSchema,
  insertMeasurementSchema,
  insertProductSchema,
  insertTailorServiceSchema,
  insertAvatarSchema,
  insertTryOnHistorySchema,
  insertWishlistSchema
} = require("@shared/schema");
const { seedDatabase } = require("./seed");
const { z } = require("zod");

async function registerRoutes(app) {
  // ----- User Routes -----
  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // ----- Measurement Routes -----
  app.get("/api/measurements/:id", async (req, res) => {
    const measurementId = parseInt(req.params.id);
    if (isNaN(measurementId)) {
      return res.status(400).json({ message: "Invalid measurement ID" });
    }

    const measurement = await storage.getMeasurement(measurementId);
    if (!measurement) {
      return res.status(404).json({ message: "Measurement not found" });
    }

    res.json(measurement);
  });

  app.get("/api/users/:userId/measurements", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const measurements = await storage.getMeasurementsByUserId(userId);
    res.json(measurements);
  });

  app.post("/api/measurements", async (req, res) => {
    try {
      const measurementData = insertMeasurementSchema.parse(req.body);
      const measurement = await storage.createMeasurement(measurementData);
      res.status(201).json(measurement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid measurement data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating measurement" });
    }
  });

  // ----- Product Routes -----
  app.get("/api/products", async (req, res) => {
    const { category, gender, type, brand, occasion, fabric, minPrice, maxPrice, retailerId, featured } = req.query;

    const options = {};
    if (category) options.category = category;
    if (gender) options.gender = gender;
    if (type) options.type = type;
    if (brand) options.brand = brand;
    if (occasion) options.occasion = occasion;
    if (fabric) options.fabric = fabric;

    if (minPrice) {
      const price = parseInt(minPrice);
      if (!isNaN(price)) options.minPrice = price;
    }

    if (maxPrice) {
      const price = parseInt(maxPrice);
      if (!isNaN(price)) options.maxPrice = price;
    }

    if (retailerId) {
      const id = parseInt(retailerId);
      if (!isNaN(id)) options.retailerId = id;
    }

    if (featured !== undefined) {
      options.featured = featured === "true";
    }

    const products = await storage.getProducts(options);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await storage.getProduct(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating product" });
    }
  });

  // ----- Avatar Routes -----
  app.get("/api/avatars/:id", async (req, res) => {
    const avatarId = parseInt(req.params.id);
    if (isNaN(avatarId)) {
      return res.status(400).json({ message: "Invalid avatar ID" });
    }

    const avatar = await storage.getAvatar(avatarId);
    if (!avatar) {
      return res.status(404).json({ message: "Avatar not found" });
    }

    res.json(avatar);
  });

  app.get("/api/users/:userId/avatar", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const avatar = await storage.getAvatarByUserId(userId);
    if (!avatar) {
      return res.status(404).json({ message: "Avatar not found for this user" });
    }

    res.json(avatar);
  });

  app.post("/api/avatars", async (req, res) => {
    try {
      const avatarData = insertAvatarSchema.parse(req.body);
      const avatar = await storage.createAvatar(avatarData);
      res.status(201).json(avatar);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid avatar data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating avatar" });
    }
  });

  // ----- Try-On History Routes -----
  app.get("/api/tryons/:id", async (req, res) => {
    const tryOnId = parseInt(req.params.id);
    if (isNaN(tryOnId)) {
      return res.status(400).json({ message: "Invalid try-on history ID" });
    }

    const tryOn = await storage.getTryOnHistory(tryOnId);
    if (!tryOn) {
      return res.status(404).json({ message: "Try-on history not found" });
    }

    res.json(tryOn);
  });

  app.get("/api/users/:userId/tryons", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const tryOnHistory = await storage.getTryOnHistoryByUserId(userId);
    res.json(tryOnHistory);
  });

  app.post("/api/tryons", async (req, res) => {
    try {
      const tryOnData = insertTryOnHistorySchema.parse(req.body);
      const tryOn = await storage.createTryOnHistory(tryOnData);
      res.status(201).json(tryOn);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid try-on data", errors: error.errors });
      }
      res.status(500).json({ message: "Error saving try-on history" });
    }
  });

  // ----- Tailor Services Routes -----
  app.get("/api/tailor-services", async (req, res) => {
    const { city, serviceType, minRatePerHour, maxRatePerHour, isVerified } = req.query;

    const options = {};
    if (city) options.city = city;
    if (serviceType) options.serviceType = serviceType;

    if (minRatePerHour) {
      const rate = parseInt(minRatePerHour);
      if (!isNaN(rate)) options.minRatePerHour = rate;
    }

    if (maxRatePerHour) {
      const rate = parseInt(maxRatePerHour);
      if (!isNaN(rate)) options.maxRatePerHour = rate;
    }

    if (isVerified !== undefined) {
      options.isVerified = isVerified === "true";
    }

    const services = await storage.getTailorServices(options);
    res.json(services);
  });

  app.get("/api/tailor-services/:id", async (req, res) => {
    const serviceId = parseInt(req.params.id);
    if (isNaN(serviceId)) {
      return res.status(400).json({ message: "Invalid tailor service ID" });
    }

    const service = await storage.getTailorService(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Tailor service not found" });
    }

    res.json(service);
  });

  app.get("/api/users/:userId/tailor-service", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const service = await storage.getTailorServiceByUserId(userId);
    if (!service) {
      return res.status(404).json({ message: "Tailor service not found for this user" });
    }

    res.json(service);
  });

  app.post("/api/tailor-services", async (req, res) => {
    try {
      const serviceData = insertTailorServiceSchema.parse(req.body);
      const service = await storage.createTailorService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tailor service data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating tailor service" });
    }
  });

  // ----- Wishlist Routes -----
  app.get("/api/users/:userId/wishlist", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const wishlistItems = await storage.getWishlistByUserId(userId);
    res.json(wishlistItems);
  });

  app.post("/api/wishlist", async (req, res) => {
    try {
      const wishlistData = insertWishlistSchema.parse(req.body);
      const item = await storage.addToWishlist(wishlistData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wishlist data", errors: error.errors });
      }
      res.status(500).json({ message: "Error adding to wishlist" });
    }
  });

  app.delete("/api/users/:userId/wishlist/:productId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);

    if (isNaN(userId) || isNaN(productId)) {
      return res.status(400).json({ message: "Invalid user ID or product ID" });
    }

    await storage.removeFromWishlist(userId, productId);
    res.status(204).end();
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

module.exports = {
  registerRoutes
};
