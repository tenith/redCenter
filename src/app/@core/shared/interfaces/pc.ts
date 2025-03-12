import { SubPC } from "./sub-pc";

export interface PC {
  number: number;
  code: string;
  description: string;
  subPCs: SubPC[];
}
