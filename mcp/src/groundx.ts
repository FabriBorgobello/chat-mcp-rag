import dotenv from "dotenv";
dotenv.config();

import { GroundXClient } from "groundx";

export const groundX = new GroundXClient({
  apiKey: "b24f27fb-becd-4e0a-b855-447013484823",
});
