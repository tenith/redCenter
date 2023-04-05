import { Invoice } from "./invoice";

export interface FirestoreUser {
    email: string;
    aoc?: string;
    role?: string;
    level?: string;
    displayName: string;
    photoURL: string;
    tokenList: string[];
    invoice: Invoice[];
}
