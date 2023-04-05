import { Signature } from "./signature";

export interface Announcement {
    author: string;
    code: string;
    title: string;
    body: string;
    publishedDate: string;
    effectiveDate: string;
    endDate: string;
    acknowledge: boolean;
    audience: string[];
    signatures: Signature[];
}
