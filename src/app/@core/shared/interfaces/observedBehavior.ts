export interface ObservedBehavior {
  id: number; // e.g. "Maintains pitch"
  observed: number; // e.g. 2
  total: number; // e.g. 3
  note?: string;
}
