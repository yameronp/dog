import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  weight: doublePrecision("weight").notNull(),
  category: text("category").notNull(),
  promaxTablets: integer("promax_tablets").default(0),
  promaxJuniorTablets: integer("promax_junior_tablets").default(0),
  promaxNursingTablets: integer("promax_nursing_tablets").default(0),
  tapewormDrops: integer("tapeworm_drops").default(0),
  isOverweight: boolean("is_overweight").default(false),
  totalCost: doublePrecision("total_cost").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions, {
  weight: z.number().positive(),
  category: z.enum(["adult", "puppy", "nursing"]),
  promaxTablets: z.number().int().min(0),
  promaxJuniorTablets: z.number().int().min(0),
  promaxNursingTablets: z.number().int().min(0),
  tapewormDrops: z.number().int().min(0),
  isOverweight: z.boolean(),
  totalCost: z.number().positive(),
}).omit({ id: true, createdAt: true });

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;