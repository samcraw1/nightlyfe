import "server-only";
import type { LiveVideoService } from "@/lib/ivs/types";
import { ivsService } from "@/lib/ivs/service";
import { createSimulatedIvsService } from "@/lib/ivs/simulated";
import { getCapabilities } from "./mode";
import { isDemoStageLive } from "./demo-repository";

/** Real AWS IVS when credentials exist, otherwise the labelled simulation. */
export function getLiveVideoService(): LiveVideoService {
  return getCapabilities().ivs ? ivsService : createSimulatedIvsService(isDemoStageLive);
}
