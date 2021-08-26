import * as mongo from "mongodb";
import Db from "./Db";

const client = new mongo.MongoClient(
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
  {}
);

let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  await client.connect();

  console.log("[DB]: connected");

  const db = client.db(process.env.MONGO_DATABASE || "mdslide_dev");

  const database = new Db(db);

  cachedDb = database;

  return database;
}
