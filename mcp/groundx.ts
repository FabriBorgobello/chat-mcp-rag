import dotenv from "dotenv";
dotenv.config();
import { GroundXClient } from "groundx";

export const groundX = new GroundXClient({
  apiKey: process.env.GROUNDX_API_KEY!,
});
