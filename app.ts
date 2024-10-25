import { initDB } from "./src/infrastructure/database";
import { EventModel } from "./src/adapters/models/model";

export const startApp = async () => {
  await initDB();
  await EventModel.sync(); // Esto creará la tabla si no existe
  console.log('Database initialized and synchronized');
};
