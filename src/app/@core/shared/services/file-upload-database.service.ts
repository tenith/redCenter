import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreUserService } from './firestore-user.service';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { FileUploadInformationService } from './file-upload-information.service';
import { Observable } from 'rxjs';

import { firebaseDB, requiredVerify, roleName, sepMandatory } from '../../../../environments/myconfigs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadDatabaseService {

  path: string = firebaseDB.dbPathName
  absPath: string = firebaseDB.dbABSPathName;

  isModerator: boolean = false;
  email: string = '';

  constructor(private storage: AngularFireStorage, private firestoreUser: FirestoreUserService, private fileUploadInformationService: FileUploadInformationService) { 
    const temp = this.firestoreUser.getFirestoreUser();
    this.email = temp.email;
    this.path = this.path + '/' + this.email;

    this.isModerator = this.firestoreUser.isModerator;
  }

  public async uploadFile(file: File, form: any): Promise<boolean> {
    let completed = false;
    const newFileName = new Date().valueOf() + '_' + file.name;
    const fileRef = this.storage.ref(this.path + '/' + newFileName);
    const fileAbsPath = this.absPath + this.path + '/' + newFileName;  

    let needVerify = !requiredVerify[this.firestoreUser.getFirestoreUser().role].includes(form.fileCategory);

    await fileRef.put(file).then(async () => {
      let temp: FileUploadInformation = {
        owner: this.email,
        name: newFileName,
        displayName: this.firestoreUser.getFirestoreUser().displayName,
        relativePath: this.path + '/' + newFileName,
        path: fileAbsPath,
        description: form.fileDescription,
        uploadTime: new Date().toLocaleString(),
        fileType: file.type,
        fileCategory: form.fileCategory,
        showSEP: form.showSEP,
        issueDate: form.issueDate,
        hasExpiry: form.hasExpiry,
        expiryDate: form.expiryDate,
        issueBy: form.issueBy,
        verify: needVerify,
      }      

      await this.fileUploadInformationService.addFileUploadInformation(temp, this.email)
      .then(()=>{
        completed = true;
      })
      .catch(error => {
        // console.log(error);
        fileRef.delete();
      })
    });

    return completed;
  }

  public getFile(fullPath: string):  Observable<any>{
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
    await this.fileUploadInformationService.removeFileUploadByName(path.split('/')[3], email)
    .then(async () => {
      const fileRef = this.storage.ref(path);
      await fileRef.delete().toPromise().then(() => { 
        // console.log('delete completed');
      });
      completed = true;
    })
    .catch(error => 
      console.log(error)
    );    
    
    return completed;

  }

  public async deleteFile(path: string, fileUploadInformation: FileUploadInformation): Promise<boolean> {
    let completed = false;
    // if(!this.isModerator)
    //   return;

    await this.fileUploadInformationService.removeFileUploadInformation(fileUploadInformation, fileUploadInformation.owner)
    .then(async () => {
      const fileRef = this.storage.ref(path);
      await fileRef.delete().toPromise().then(() => { console.log('delete completed');});
      completed = true;
    })
    .catch(error => console.log(error));
    
    
    return completed;

  }
}
