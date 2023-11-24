import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { FirestoreUserService } from "./firestore-user.service";
import { FileUploadInformation } from "../interfaces/file-upload-information";
import { FileUploadInformationService } from "./file-upload-information.service";
import { Observable } from "rxjs";

import heic2any from "heic2any";

import {
  firebaseDB,
  requiredVerify,
  roleName,
  sepMandatory,
} from "../../../../environments/myconfigs";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class FileUploadDatabaseService {
  path: string = firebaseDB.dbPathName;
  absPath: string = firebaseDB.dbABSPathName;

  isModerator: boolean = false;
  email: string = "";

  constructor(
    private storage: AngularFireStorage,
    private firestoreUser: FirestoreUserService,
    private fileUploadInformationService: FileUploadInformationService
  ) {
    const temp = this.firestoreUser.getFirestoreUser();
    this.email = temp.email;
    this.path = this.path + "/" + this.email;

    this.isModerator = this.firestoreUser.isModerator;
  }

  public async uploadFileByAdmin(
    file: File,
    form: any,
    email: string
  ): Promise<boolean> {
    let completed = false;
    let newFileName = new Date().valueOf() + "_" + file.name;

    /*
      ID-0077
      if file is heic format then try to convert it into jpg
    */

    if (file.name.endsWith(".heic")) {
      newFileName = newFileName.replace(/\.heic$/, ".jpg");
      await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.6, // Adjust the quality as needed
      })
        .then((jpgBlob: Blob) => {
          const jpgFile = new File([jpgBlob], newFileName, {
            type: "image/jpeg",
          });

          file = jpgFile;
        })
        .catch((error: any) => {
          console.error("Error converting HEIC to JPEG:", error);
        });
    }

    const fileRef = this.storage.ref(
      firebaseDB.dbPathName + "/" + email + "/" + newFileName
    );
    const fileAbsPath =
      this.absPath + firebaseDB.dbPathName + "/" + newFileName;

    const datePipe = new DatePipe("en-US");
    const formattedDate = datePipe.transform(
      new Date(),
      "dd MMM yyyy HH:mm:ss"
    );

    await fileRef.put(file).then(async () => {
      let temp: FileUploadInformation = {
        owner: email,
        name: newFileName,
        displayName: "",
        relativePath: firebaseDB.dbPathName + "/" + email + "/" + newFileName,
        path: fileAbsPath,
        description: form.fileDescription,
        uploadTime: formattedDate,
        fileType: file.type,
        fileCategory: form.fileCategory,
        showSEP: form.showSEP,
        issueDate: form.issueDate,
        hasExpiry: form.hasExpiry,
        expiryDate: form.expiryDate,
        issueBy: form.issueBy,
        verify: true,
      };

      await this.fileUploadInformationService
        .addFileUploadInformation(temp, email)
        .then(() => {
          completed = true;
        })
        .catch((error) => {
          fileRef.delete();
        });
    });

    return completed;
  }

  public async uploadFile(file: File, form: any): Promise<boolean> {
    let completed = false;
    let newFileName = new Date().valueOf() + "_" + file.name;

    /*
      ID-0077
      if file is heic format then try to convert it into jpg
    */
    if (file.name.endsWith(".heic")) {
      newFileName = newFileName.replace(/\.heic$/, ".jpg");
      await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.6, // Adjust the quality as needed
      })
        .then((jpgBlob: Blob) => {
          const jpgFile = new File([jpgBlob], newFileName, {
            type: "image/jpeg",
          });

          file = jpgFile;
        })
        .catch((error: any) => {
          console.error("Error converting HEIC to JPEG:", error);
        });
    }

    const fileRef = this.storage.ref(this.path + "/" + newFileName);
    const fileAbsPath = this.absPath + this.path + "/" + newFileName;

    let needVerify = !requiredVerify[
      this.firestoreUser.getFirestoreUser().role
    ].includes(form.fileCategory);

    /**
     * 24 Jul 2023
     * Fix bug change from toLocalDateString() to be format dd MMM yyy HH:mm:ss
     */
    const datePipe = new DatePipe("en-US");
    const formattedDate = datePipe.transform(
      new Date(),
      "dd MMM yyyy HH:mm:ss"
    );

    await fileRef.put(file).then(async () => {
      let temp: FileUploadInformation = {
        owner: this.email,
        name: newFileName,
        displayName: this.firestoreUser.getFirestoreUser().displayName,
        id: this.firestoreUser.getFirestoreUser().cId,
        relativePath: this.path + "/" + newFileName,
        path: fileAbsPath,
        description: form.fileDescription,
        uploadTime: formattedDate,
        fileType: file.type,
        fileCategory: form.fileCategory,
        showSEP: form.showSEP,
        issueDate: form.issueDate,
        hasExpiry: form.hasExpiry,
        expiryDate: form.expiryDate,
        issueBy: form.issueBy,
        verify: needVerify,
      };

      if (needVerify == true)
        this.fileUploadInformationService.setNeedVerify(this.email, true);

      await this.fileUploadInformationService
        .addFileUploadInformation(temp, this.email)
        .then(() => {
          completed = true;
        })
        .catch((error) => {
          // console.log(error);
          fileRef.delete();
        });
    });

    return completed;
  }

  public getFile(fullPath: string): Observable<any> {
    return this.storage.ref(fullPath).getDownloadURL();
  }

  // public async deleteFileByType(type: string, email: string): Promise<boolean> {
  //   let completed = false;

  //   await this.fileUploadInformationService.removeFileUploadByType(type, email)
  //   .then(async () => {
  //     const fileRef = this.storage.ref(path);
  //     await fileRef.delete().toPromise().then(() => { console.log('delete completed');});
  //     completed = true;
  //   })
  //   .catch(error => console.log(error));

  //   return completed;
  // }

  public async deleteFileByName(path: string, email: string): Promise<boolean> {
    let completed = false;
    await this.fileUploadInformationService
      .removeFileUploadByName(path.split("/")[3], email)
      .then(async () => {
        const fileRef = this.storage.ref(path);
        await fileRef
          .delete()
          .toPromise()
          .then(() => {
            // console.log('delete completed');
          });
        completed = true;
      })
      .catch((error) => console.log(error));

    return completed;
  }

  public async deleteFile(
    path: string,
    fileUploadInformation: FileUploadInformation
  ): Promise<boolean> {
    let completed = false;
    // if(!this.isModerator)
    //   return;

    await this.fileUploadInformationService
      .removeFileUploadInformation(
        fileUploadInformation,
        fileUploadInformation.owner
      )
      .then(async () => {
        const fileRef = this.storage.ref(path);
        await fileRef
          .delete()
          .toPromise()
          .then(() => {
            console.log("delete completed");
          });
        completed = true;
      })
      .catch((error) => console.log(error));

    return completed;
  }
}
