import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPrescriptionSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.post("/api/prescriptions", async (req, res) => {
    try {
      const prescription = insertPrescriptionSchema.parse(req.body);
      const created = await storage.createPrescription(prescription);
      res.json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid prescription data" });
    }
  });

  app.get("/api/prescriptions", async (_req, res) => {
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