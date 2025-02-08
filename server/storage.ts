import { users, type User, type InsertUser } from "@shared/schema";
import { prescriptions, type Prescription, type InsertPrescription } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getRecentPrescriptions(limit?: number): Promise<Prescription[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db
      .insert(users)
      .values(user)
      .returning();
    return created;
  }

  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [created] = await db
      .insert(prescriptions)
      .values(prescription)
      .returning();
    return created;
  }

  async getRecentPrescriptions(limit: number = 10): Promise<Prescription[]> {
    return await db
      .select()
      .from(prescriptions)
      .orderBy(desc(prescriptions.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();