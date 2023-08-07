import { Injectable } from "@angular/core";
import {
  localStorageCollection,
  profileDBLink,
} from "../../../../environments/myconfigs";
import { OneSepCard } from "../interfaces/one-sep-card";
import { FirebaseAuthenticationService } from "./firebase-authentication.service";
import { NgxIndexedDBService } from "ngx-indexed-db";
import { Observable } from "rxjs";
import { FileUploadDatabaseService } from "./file-upload-database.service";

@Injectable({
  providedIn: "root",
})
export class ManualCardService {
  manualCardLocalDBName: string =
    localStorageCollection.manualLocalDBNameCollectionName;
  manualCards: OneSepCard[];

  constructor(
    private fileUploadService: FileUploadDatabaseService,
    public fireBaseAuthService: FirebaseAuthenticationService,
    public dbService: NgxIndexedDBService,
  ) {
    const temp = localStorage.getItem(this.manualCardLocalDBName);
    this.manualCards = JSON.parse(temp) as OneSepCard[];
  }

  isInLocalStorage(): boolean {
    return localStorage.getItem(this.manualCardLocalDBName) != null;
  }

  async saveProfilePicture(path: string): Promise<void> {
    await this.getImageFromFireDB(path).then(async (downloadURL) => {
      await this.getBase64ImageFromUrl(downloadURL)
        .then((result) => {
          // console.log('get data: ' + result);
          try {
            this.dbService.deleteByKey("certificates", profileDBLink);
          } catch (e) {
            console.log(e);
          }
          this.dbService
            .add("certificates", { link: profileDBLink, uri: result })
            .subscribe();
        })
        .catch((err) => console.error(err));
    });
  }

  saveAllCertificate(): void {
    if (this.manualCards == null) return;

    for (let i = 0; i < this.manualCards.length; i++) {
      this.dbService
        .getByIndex("certificates", "link", this.manualCards[i].Link)
        .subscribe(async (data) => {
          if (data == null) {
            await this.getImageFromFireDB(this.manualCards[i].Link).then(
              async (downloadURL) => {
                await this.getBase64ImageFromUrl(downloadURL)
                  .then((result) => {
                    this.dbService
                      .add("certificates", {
                        link: this.manualCards[i].Link,
                        uri: result,
                      })
                      .subscribe();
                  })
                  .catch((err) => console.error(err));
              },
            );
          }
        });
    }
  }

  async getBase64ImageFromUrl(imageUrl: string) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          resolve(reader.result);
        },
        false,
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  async getImageFromFireDB(relativePath: string): Promise<string> {
    return this.fileUploadService.getFile(relativePath).toPromise();
  }

  saveAllCards(oneSepCards: OneSepCard[]): void {
    this.manualCards = oneSepCards;
    localStorage.setItem(
      this.manualCardLocalDBName,
      JSON.stringify(oneSepCards),
    );
    this.saveAllCertificate();
  }

  getURIByLink(linkURL: string): Observable<any> {
    return this.dbService.getByIndex("certificates", "link", linkURL);
  }

  deleteAllCards(): void {
    localStorage.removeItem(this.manualCardLocalDBName);
    this.deleteAllCertificate();
  }

  deleteAllCertificate(): void {}

  getAllSepCardsFromCache(): OneSepCard[] {
    return this.manualCards;
  }
}
