import { ObjectId } from "mongodb";

export function mapUnderscoreIdToId<T>(
  doc: T & { _id: ObjectId }
) {
  return { ...doc, id: doc._id.toHexString(), _id: undefined };
}

