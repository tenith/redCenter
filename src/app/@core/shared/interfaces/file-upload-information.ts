export interface FileUploadInformation {
    owner: string;
    name: string;
    displayName: string;
    relativePath: string;
    path: string;
    description: string;
    uploadTime: string;
    fileType: string;
    
    fileCategory: string;
    showSEP: string;
    issueDate: string;
    hasExpiry: string;
    expiryDate: string;
    issueBy: string;   

    verify?: boolean;
}
