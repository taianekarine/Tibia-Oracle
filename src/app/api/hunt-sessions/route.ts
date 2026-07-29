import { importHuntController } from "@/controllers/hunt-import.controller";

export async function POST(request: Request) {
  return importHuntController(request);
}
