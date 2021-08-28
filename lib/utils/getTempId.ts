import { v4 as uuidv4 } from "uuid";

const ids = new Set<string>();

export const getUUID = (): string => {
  const randId = uuidv4();
  if (ids.has(randId)) {
    return getUUID();
  }

  ids.add(randId);

  return randId;
};

export const TEMP_ID_PREFIX = "_TEMP_";

export const getTempId = (): string => {
  return TEMP_ID_PREFIX + getUUID();
};

export const isTempId = (id: string): boolean => id.startsWith(TEMP_ID_PREFIX);
