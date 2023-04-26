import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreUserService } from './firestore-user.service';
import { FileUploadInformation } from '../interfaces/file-upload-information';
import { FileUploadInformationService } from './file-upload-information.service';
import { Observable } from 'rxjs';

import { firebaseDB } from '../../../../environments/myconfigs';

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

  public async uploadFile(file: File, fileDescription: string): Promise<boolean> {
    let completed = false;
    const newFileName = new Date().valueOf() + '_' + file.name;
    const fileRef = this.storage.ref(this.path + '/' + newFileName);
    const fileAbsPath = this.absPath + this.path + '/' + newFileName;

    await fileRef.put(file).then(async () => {
      let temp: FileUploadInformation = {
        owner: this.email,
        name: newFileName,
        displayName: this.firestoreUser.getFirestoreUser().displayName,
        relativePath: this.path + '/' + newFileName,
        path: fileAbsPath,
        description: fileDescription,
        uploadTime: new Date().toLocaleString(),
        fileType: file.type
      }      

      await this.fileUploadInformationService.addFileUploadInformation(temp, this.email)
      .then(()=>{
        completed = true;
      })
      .catch(error => {
        console.log(error);
        fileRef.delete();
      })
    });

    return completed;
  }

  public getFile(fullPath: string):  Observable<any>{
    return this.storage.ref(fullPath).getDownloadURL();
  }

  public async deleteFile(path: string, fileUploadInformation: FileUploadInformation): Promise<boolean> {
    let completed = false;
    if(!this.isModerator)
      return;

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
