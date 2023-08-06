import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMenuService,
  NbSidebarService,
  NbToastrService,
} from "@nebular/theme";
import { Observable, Subject, Subscription, fromEvent } from "rxjs";
import { AutolandSepCard } from "../../@core/shared/interfaces/autoland-sep-card";
import { OneSepCard } from "../../@core/shared/interfaces/one-sep-card";
import { AutolandCardService } from "../../@core/shared/services/autoland-card.service";
import { FirebaseAuthenticationService } from "../../@core/shared/services/firebase-authentication.service";
import { SepCardService } from "../../@core/shared/services/sep-card.service";
import { FileUploadInformationService } from "../../@core/shared/services/file-upload-information.service";
import { FirestoreUserService } from "../../@core/shared/services/firestore-user.service";
import { FileUploadInformation } from "../../@core/shared/interfaces/file-upload-information";
import { ManualCardService } from "../../@core/shared/services/manual-card.service";

import {
  sepCourseBasicRequiredToOperate,
  sepCourseOptions,
  sepMandatory,
  strictVerify,
} from "../../../environments/myconfigs";
import { baseURL } from "../../../environments/environment";

@Component({
  selector: "ngx-sep",
  templateUrl: "./sep.component.html",
  styleUrls: ["./sep.component.scss"],
})
export class SepComponent implements OnInit, OnDestroy {
  /*
    15 Mar 2023 wutthichair
  */
  validList: string[] = [];
  aboutList: string[] = [];
  pendingList: string[] = [];
  expiredList: string[] = [];

  loading: boolean = true;
  manualCards: OneSepCard[] = [];
  oneSepCards: OneSepCard[] = [];
  autoLandCards: AutolandSepCard[];

  changeEvent: Subject<void> = new Subject<void>();

  showAutoLand: boolean = false;
  firstTimeAlert: boolean = true;

  isPilot: boolean = false;
  mandatoryCourseName: string[] = [];

  fullHistory: OneSepCard[][] = [];

  offlineEvent: Observable<Event>;
  onlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];

  offline: boolean = false;

  myURL: string = "";

  basicRequiredCourseName = sepCourseBasicRequiredToOperate;
  requiredCourse: OneSepCard[] = [];
  optionalCourse: OneSepCard[] = [];

  constructor(
    private manualCardService: ManualCardService,
    private cdr: ChangeDetectorRef,
    private firestoreUser: FirestoreUserService,
    private fileUploadService: FileUploadInformationService,
    public fireBaseAuth: FirebaseAuthenticationService,
    public toastr: NbToastrService,
    public sepCardService: SepCardService,
    public autoLandCardService: AutolandCardService,
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  private handleAppConnectivityChanges(): void {
    this.offline = !navigator.onLine;

    this.onlineEvent = fromEvent(window, "online");
    this.offlineEvent = fromEvent(window, "offline");

    this.subscriptions.push(
      this.onlineEvent.subscribe((e) => {
        // handle online mode
        this.offline = false;
        this.cdr.detectChanges();
      }),
    );

    this.subscriptions.push(
      this.offlineEvent.subscribe((e) => {
        // handle offline mode
        this.offline = true;
        this.cdr.detectChanges();
      }),
    );
  }

  reviseRequiredCourse(): void {
    this.requiredCourse = [];
    this.optionalCourse = [];

    for (let i = 0; i < this.oneSepCards.length; i++) {
      if (
        this.basicRequiredCourseName[
          this.firestoreUser.getFirestoreUser().role
        ].includes(this.oneSepCards[i].Name)
      )
        this.requiredCourse.push(this.oneSepCards[i]);
      else this.optionalCourse.push(this.oneSepCards[i]);
    }
  }

  ngOnInit(): void {
    // this.fileUploadSerivce.reloadData();
    this.handleAppConnectivityChanges();

    this.autoLandCards = [
      {
        name: "AUTOLAND - ONLINE",
        airport: "",
        perform: "",
        validperiod: "",
        expiry: "",
      },
      {
        name: "AUTOLAND - SIMULATOR",
        airport: "",
        perform: "",
        validperiod: "",
        expiry: "",
      },
    ];

    this.mandatoryCourseName =
      sepMandatory[this.firestoreUser.getFirestoreUser().role];

    this.myURL =
      baseURL +
      "onlinechecking?email=" +
      this.firestoreUser.getFirestoreUser().email +
      "&token=" +
      btoa(this.firestoreUser.getFirestoreUser().email);

    /*
      Loading Information From Cache....
    */
    if (this.sepCardService.isInLocalStorage()) {
      this.loading = false;
      this.oneSepCards = [...this.sepCardService.getAllSepCardsFromCache()];
      this.reviseRequiredCourse();

      this.loadAutolandCards();
    }

    if (this.manualCardService.isInLocalStorage()) {
      this.loading = false;
      this.manualCards = [...this.manualCardService.getAllSepCardsFromCache()];

      this.updateSummary();
      this.reviseMandatoryCourse();
    }

    if (this.loading) this.downloadSEP();
    else if (!this.offline) this.anyChange();
  }

  reviseMandatoryCourse(): void {
    this.mandatoryCourseName =
      sepMandatory[this.firestoreUser.getFirestoreUser().role];
    for (let i = 0; i < this.manualCards.length; i++)
      if (this.mandatoryCourseName.includes(this.manualCards[i].Name))
        this.mandatoryCourseName = this.mandatoryCourseName.filter(
          (obj) => obj !== this.manualCards[i].Name,
        );
  }

  anyChange(): void {
    /*
      Loading Information From personal file upload....
    */
    console.log("cache loading try to update from server");
    this.fileUploadService
      .getFileUploadInformationSnapshotByEmail(
        this.firestoreUser.getFirestoreUser().email,
      )
      .onSnapshot((docSnapshot) => {
        // console.log('get some data from firebase');
        let tempOneSepCard: OneSepCard[] = [];
        if (docSnapshot.exists) {
          const temp = [...docSnapshot.data().files] as FileUploadInformation[];
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].showSEP == "Yes") {
              // console.log(JSON.stringify(temp[i]));
              let tempSepCard: OneSepCard = {
                Name: temp[i].fileCategory,
                Attended: this.formatDate(temp[i].issueDate),
                Type: "Personal Upload",
                Validperiod: "",
                Expiry: this.formatDate(temp[i].expiryDate),
                Instructor: temp[i].issueBy,
                Remark: temp[i].description,
                Link: temp[i].relativePath,
                InitialDate: "NO DATA",
                verify: temp[i].verify,
              };

              tempOneSepCard.push(tempSepCard);
            }
          }
        }

        if (tempOneSepCard.length > 0) {
          const tempS: OneSepCard[] = [];
          for (
            let i = 0;
            i < sepMandatory[this.firestoreUser.getFirestoreUser().role].length;
            i++
          ) {
            for (let j = 0; j < tempOneSepCard.length; j++) {
              if (
                sepMandatory[this.firestoreUser.getFirestoreUser().role][i] ==
                tempOneSepCard[j].Name
              ) {
                tempS.push(tempOneSepCard[j]);
                break;
              }
            }
          }
          // console.log(JSON.stringify(tempS));
          // console.log(JSON.stringify([...(this.manualCardService.getAllSepCardsFromCache())]));

          if (
            JSON.stringify(tempS) ==
            JSON.stringify([
              ...this.manualCardService.getAllSepCardsFromCache(),
            ])
          ) {
            console.log("using cache");
            console.log("do nothing");
          } else {
            this.manualCards = tempS;
            this.manualCardService.deleteAllCards();
            this.manualCardService.saveAllCards(this.manualCards);
          }
        } else {
          if (
            JSON.stringify([]) ==
            JSON.stringify([
              ...this.manualCardService.getAllSepCardsFromCache(),
            ])
          ) {
            console.log("using cache");
            console.log("do nothing");
          } else {
            this.manualCards = [];
            this.manualCardService.deleteAllCards();
            this.manualCardService.saveAllCards(this.manualCards);
          }
        }
      });
  }

  downloadSEP(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.sepCardService.clearCertificateCache();
    /*
      Loading Information From personal file upload....
    */
    this.fileUploadService
      .getFileUploadInformationSnapshotByEmail(
        this.firestoreUser.getFirestoreUser().email,
      )
      .onSnapshot((docSnapshot) => {
        // console.log('get some data from firebase');
        let tempOneSepCard: OneSepCard[] = [];
        if (docSnapshot.exists) {
          const temp = [...docSnapshot.data().files] as FileUploadInformation[];
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].showSEP == "Yes") {
              // console.log(JSON.stringify(temp[i]));
              let tempSepCard: OneSepCard = {
                Name: temp[i].fileCategory,
                Attended: this.formatDate(temp[i].issueDate),
                Type: "Personal Upload",
                Validperiod: "",
                Expiry: this.formatDate(temp[i].expiryDate),
                Instructor: temp[i].issueBy,
                Remark: temp[i].description,
                Link: temp[i].relativePath,
                InitialDate: "NO DATA",
                verify: temp[i].verify,
              };

              tempOneSepCard.push(tempSepCard);
            }
          }
        }

        if (tempOneSepCard.length > 0) {
          const tempS: OneSepCard[] = [];
          for (
            let i = 0;
            i < sepMandatory[this.firestoreUser.getFirestoreUser().role].length;
            i++
          ) {
            for (let j = 0; j < tempOneSepCard.length; j++) {
              if (
                sepMandatory[this.firestoreUser.getFirestoreUser().role][i] ==
                tempOneSepCard[j].Name
              ) {
                tempS.push(tempOneSepCard[j]);
                break;
              }
            }
          }
          // console.log(JSON.stringify(tempS));
          // console.log(JSON.stringify([...(this.manualCardService.getAllSepCardsFromCache())]));
          this.manualCards = tempS;
          this.manualCardService.deleteAllCards();
          this.manualCardService.saveAllCards(this.manualCards);
        } else {
          this.manualCards = [];
          this.manualCardService.deleteAllCards();
          this.manualCardService.saveAllCards(this.manualCards);
        }

        this.updateSummary();
        this.reviseMandatoryCourse();
      });

    /*
      Loading Information From Online Server....
    */
    this.sepCardService.getAllSepCards().subscribe((response) => {
      console.log("JSON REDBOOK API: " + JSON.stringify(response));
      if (response == null) {
        this.toastr.danger(
          "Error",
          "There is no SEP information from online Server, Please check your internet connection or contact TMS.",
          { duration: 10000 },
        );
        return;
      }

      const tempSubjects = response["Courses"];

      let temp: OneSepCard[] = [];
      const role = this.firestoreUser.getFirestoreUser().role;
      const mainCourse = sepCourseOptions[role] as string[];

      for (let i: number = 0; i < mainCourse.length; i++) {
        const courseName = mainCourse[i];
        if (response[courseName] != undefined) {
          // console.log('HISTORY: ' + courseName + " : " + JSON.stringify({courseName: response[courseName]}));

          // localStorage.setItem(courseName + 'History', JSON.stringify(response[courseName]));
          this.fullHistory[courseName] = response[courseName];
          const last = response[courseName].length - 1;
          let myProcessOneSepCard: OneSepCard = response[courseName][last];
          myProcessOneSepCard.InitialDate = "NO DATA";
          for (let i = 0; i < response[courseName].length; i++)
            if (
              response[courseName][i].Type.toString().toUpperCase() == "INITIAL"
            ) {
              myProcessOneSepCard.InitialDate =
                response[courseName][i].Attended;
              break;
            }

          temp.push(myProcessOneSepCard);
        } else {
          //create null card to show....
          const x: OneSepCard = {
            Name: courseName,
            InitialDate: "NO DATA",
            Attended: "NO DATA",
            Type: "NO DATA",
            Validperiod: "NO DATA",
            Expiry: "NO DATA",
            Instructor: "NO DATA",
            Remark: "NO DATA",
            Link: "",
          };

          temp.push(x);
        }
      }

      this.loading = false;
      this.toastr.primary(
        "Completed",
        "Updated SEP from TMC server completed",
        { duration: 10000 },
      );
      // this.oneSepCards = [...temp,...this.oneSepCards];
      this.oneSepCards = temp;
      this.reviseRequiredCourse();

      this.sepCardService.deleteAllSepCards();
      this.sepCardService.saveAllSepCards(this.oneSepCards);

      this.updateSummary();
      this.loadAutolandCards();
    });
  }

  detectChanges(): void {}

  private isRequiredToShow(search: string): boolean {
    const role = this.firestoreUser.getFirestoreUser().role;
    const mainCourse = sepCourseOptions[role] as string[];
    return mainCourse.includes(search);
  }

  private formatDate(x: string): string {
    if (x == "" || x == "-") return "-";
    const datePipe = new DatePipe("en-US");
    const formattedDate = datePipe.transform(new Date(x), "dd MMM yyy");
    return formattedDate;
  }

  private JSONcompare(obj1, obj2) {
    const commonKeys = [
      ...new Set([...Object.keys(obj1), ...Object.keys(obj2)]),
    ];

    for (const key of commonKeys) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  newDataFromGoogleAPI(data: string): void {
    const newData = { ...JSON.parse(data) } as OneSepCard;
    for (let i = 0; i < this.oneSepCards.length; i++) {
      if (newData.Name == this.oneSepCards[i].Name) {
        if (this.JSONcompare(newData, this.oneSepCards[i])) {
          break;
        }

        this.oneSepCards[i] = newData;

        this.sepCardService.deleteAllSepCards();
        this.sepCardService.saveAllSepCards(this.oneSepCards);

        this.loadAutolandCards();
        this.updateSummary();
        break;
      }
    }
  }

  updateSummary(): void {
    this.reviseMandatoryCourse();

    this.validList = [];
    this.aboutList = [];
    this.pendingList = [];
    this.expiredList = [];

    this.updateSEPSummary();
    this.cdr.detectChanges();
  }

  updateSEPSummary(): void {
    if (this.oneSepCards == null) return;

    for (let i = 0; i < this.mandatoryCourseName.length; i++) {
      this.expiredList.push(this.mandatoryCourseName[i]);
    }

    for (let i = 0; i < this.oneSepCards.length; i++) {
      const msInDay = 24 * 60 * 60 * 1000;
      const today = new Date().getTime();
      const expire = new Date(this.oneSepCards[i].Expiry).getTime() + msInDay;
      const diffDate = (expire - today) / msInDay;

      //It's expired course name if expiry date is NO DATA
      if (this.oneSepCards[i].Expiry == "NO DATA") {
        this.expiredList.push(this.oneSepCards[i].Name);
        continue;
      }

      if (diffDate < 0) this.expiredList.push(this.oneSepCards[i].Name);
      if (diffDate > 30) this.validList.push(this.oneSepCards[i].Name);
      if (diffDate <= 30 && diffDate >= 0)
        this.aboutList.push(this.oneSepCards[i].Name);

      if (this.oneSepCards[i].Expiry == "-")
        this.validList.push(this.oneSepCards[i].Name);
    }

    // console.log('number of manual cards: ' + this.manualCards.length);
    for (let i = 0; i < this.manualCards.length; i++) {
      // console.log('index: ' + i + " -> " + JSON.stringify(this.manualCards[i]));
      const msInDay = 24 * 60 * 60 * 1000;
      const today = new Date().getTime();
      const expire = new Date(this.manualCards[i].Expiry).getTime() + msInDay;
      const diffDate = (expire - today) / msInDay;

      //It's expired course name if expiry date is NO DATA
      if (this.manualCards[i].Expiry == "NO DATA") {
        this.expiredList.push(this.manualCards[i].Name);
        continue;
      }

      // console.log('hasverify:  ' + ('verify' in this.manualCards[i]));
      // console.log(this.manualCards[i].verify);
      if (this.manualCards[i].verify != undefined) {
        if (this.manualCards[i].verify == false) {
          if (
            strictVerify[this.firestoreUser.getFirestoreUser().role].includes(
              this.manualCards[i].Name,
            )
          ) {
            this.pendingList.push(this.manualCards[i].Name);
            continue;
          }
        }
      } else {
        // console.log('no verify: ' + JSON.stringify(this.manualCards[i]));
        // console.log(requiredVerify[this.firestoreUser.getFirestoreUser().role].includes(this.manualCards[i].Name));
        if (
          strictVerify[this.firestoreUser.getFirestoreUser().role].includes(
            this.manualCards[i].Name,
          )
        ) {
          this.pendingList.push(this.manualCards[i].Name);
          continue;
        }
      }

      if (diffDate < 0) this.expiredList.push(this.manualCards[i].Name);
      if (diffDate > 30) this.validList.push(this.manualCards[i].Name);
      if (diffDate <= 30 && diffDate >= 0)
        this.aboutList.push(this.manualCards[i].Name);

      if (this.manualCards[i].Expiry == "-")
        this.validList.push(this.manualCards[i].Name);
    }

    if (this.autoLandCards != null) {
      for (let i = 0; i < this.autoLandCards.length; i++) {
        const msInDay = 24 * 60 * 60 * 1000;
        const today = new Date().getTime();
        const expire =
          new Date(this.autoLandCards[i].expiry).getTime() + msInDay;
        const diffDate = (expire - today) / msInDay;

        if (diffDate < 0) this.expiredList.push(this.autoLandCards[i].name);
        if (diffDate > 30) this.validList.push(this.autoLandCards[i].name);
        if (diffDate <= 30 && diffDate >= 0)
          this.aboutList.push(this.autoLandCards[i].name);
      }
    }

    // this.updateAutoLandSummary();
  }

  // updateAutoLandSummary(): void {
  // }

  loadAutolandCards(): void {
    if (!this.isLVOCertified()) return;

    if (this.autoLandCardService.isInLocalStorage()) {
      this.autoLandCards = [
        ...this.autoLandCardService.getAllAutolandCardsFromCache(),
      ];
      this.showAutoLand = true;

      this.updateSummary();
    }

    this.autoLandCardService
      .getAllAutolandCards()
      .subscribe((autoLandCards) => {
        if (autoLandCards == null) {
          this.toastr.danger(
            "Error",
            "There is no Autoland history from online Server, Please check your internet connection or contact TMS.",
            { duration: 10000 },
          );
          return;
        }
        if (autoLandCards.length == 0) {
          this.toastr.danger(
            "Error",
            "Autoland history from your cache is error, Please check your internet connection or contact TMS.",
            { duration: 10000 },
          );
          return;
        }

        this.autoLandCards = [...autoLandCards];
        // console.log('GET AUTOLAND JSON :' + JSON.stringify(this.autoLandCards));

        // if(!this.firstTimeAlert)
        //   this.toastr.primary('Completed','Updated Autoland history from online server completed', {duration:10000, preventDuplicates: true});

        this.firstTimeAlert = false;
        this.showAutoLand = true;
        this.autoLandCardService.deleteAllSepCards();
        this.autoLandCardService.saveAllSepCards(this.autoLandCards);
        this.changeEvent.next();

        this.updateSummary();
      });
  }

  isLVOCertified(): boolean {
    if (this.oneSepCards == null) return false;

    for (let i: number = 0; i < this.oneSepCards.length; i++)
      if (this.oneSepCards[i].Name.includes("LVO"))
        if (this.oneSepCards[i].Expiry != "NO DATA") return true;

    return false;
  }
}
