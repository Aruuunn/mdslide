import { ObjectId } from "mongodb";

export function mapUnderscoreIdToId<T extends { id: string }>(
  doc: T & { _id: ObjectId }
) {
  return { ...doc, id: doc._id.toHexString(), _id: undefined };
}

