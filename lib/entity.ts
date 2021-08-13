import "reflect-metadata";

export const Entity = (options: { name: string }) =>
  Reflect.metadata("entity", options.name);
