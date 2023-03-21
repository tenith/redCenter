export interface FirestoreUser {
    email: string;
    role?: string;
    level?: string;
    displayName: string;
    photoURL: string;
    tokenList: string[];
}
