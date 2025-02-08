import { users, type User, type InsertUser } from "@shared/schema";
import { prescriptions, type Prescription, type InsertPrescription } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getRecentPrescriptions(limit?: number): Promise<Prescription[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    throw new Error("Method not implemented.");
  }
  async getRecentPrescriptions(limit?: number): Promise<Prescription[]> {
    throw new Error("Method not implemented.");
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Method not implemented.");
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