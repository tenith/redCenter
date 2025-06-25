import { ObservedBehavior } from "./observedBehavior";

export interface PilotCompetency {
  id: number; // e.g. "Maintains pitch"
  obList: ObservedBehavior[]; // e.g. 3
}
