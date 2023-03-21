export interface FirestoreUser {
    email: string;
    role?: string;
    displayName: string;
    photoURL: string;
    tokenList: string[];
}
