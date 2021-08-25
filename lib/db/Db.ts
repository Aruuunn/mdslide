import * as mongo from "mongodb";

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
    return this.db.collection(collectionName);
  }
}

export default Db;
