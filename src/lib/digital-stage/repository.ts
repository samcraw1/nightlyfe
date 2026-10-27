import "server-only";
import { getStageMode } from "./mode";
import { demoRepository } from "./demo-repository";
import { supabaseRepository } from "./supabase-repository";
import type { StageRepository } from "./types";

/** The one place that decides demo vs production storage. */
export function getStageRepository(): StageRepository {
  return getStageMode() === "production" ? supabaseRepository : demoRepository;
}
