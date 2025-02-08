import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrescriptionSchema } from "@shared/schema";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  // Set up authentication
  setupAuth(app);

  // Protected route middleware
  const requireAuth = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  app.post("/api/prescriptions", requireAuth, async (req, res) => {
    try {
      const prescription = insertPrescriptionSchema.parse(req.body);
      const created = await storage.createPrescription(prescription);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid prescription data" });
    }
  });

  app.get("/api/prescriptions", requireAuth, async (_req, res) => {
    try {
      const prescriptions = await storage.getRecentPrescriptions();
      res.json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}