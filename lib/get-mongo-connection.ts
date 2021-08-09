import {Connection, createConnection} from "typeorm";
import {Presentation} from "../model/presentation.entity";

let cachedConnection: Connection | null = null;

export async function getMongoConnection(): Promise<Connection> {
  if (cachedConnection) {
    return cachedConnection;
  }

  let connection: Connection = await createConnection({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "test",
    entities: [
      Presentation
    ],
  });

  if(!connection.isConnected){
    await connection.connect();
  }

  cachedConnection = connection;

  return connection;
}
