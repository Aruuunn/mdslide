import * as mongo from "mongodb";

const client = new mongo.MongoClient(
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017",
  {}
);

let cachedDb: Db | null = null;

export class Db {
  constructor(private db: mongo.Db) {}

  getCollectionName<T>(doc: T): string {
    const collectionName = Reflect.getMetadata("entity", doc);

    if (!collectionName) {
      throw new Error("Entity must decorated @Entity");
    }

    return collectionName;
  }

  async insert<T>(doc: T): Promise<T & { id: string }> {
    const collectionName = this.getCollectionName(doc);
    const { insertedId } = await this.db
      .collection(collectionName)
      .insertOne(doc);
    return { ...doc, id: insertedId.toHexString() };
  }

  getCollection<T extends Function>(
    entity: T
  ): mongo.Collection<mongo.Document> {
    const collectionName = this.getCollectionName(entity);
    console.log({ collectionName });
    return this.db.collection(collectionName);
  }
}

export async function getDb(): Promise<Db> {
  if (cachedDb) {
    console.log("Using cached Db");

    return cachedDb;
  }

  await client.connect();

  console.log("connected");

  const db = client.db(process.env.MONGO_DATABASE || "mdslide_dev");

  const database = new Db(db);

  cachedDb = database;

  return database;
}
