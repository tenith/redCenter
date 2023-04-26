import { Injectable } from '@angular/core';

import { localDB } from '../../../../environments/myconfigs';

@Injectable({
  providedIn: 'root'
})
export class OffLineNotificationService {

  private dbName = localDB.dbName;
  private dbVersion = 1;
  private objectStoreName = localDB.objectStoreName;

  private db: IDBDatabase;

  constructor() { 
    this.init();
  }

  private async init() {
    const request = self.indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore(this.objectStoreName,{ keyPath: 'code' });   

      this.db = db;
    };

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBRequest<IDBDatabase>).result;
    };

    request.onerror = (event: Event) => {
    };
  }

  private waitForDb(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.db) {
        const intervalId = setInterval(() => {
          if (this.db) {
            clearInterval(intervalId);
            resolve();
          }
        }, 100);
      } else {
        resolve();
      }
    });
  }

  public save(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.objectStoreName, 'readwrite');
      const objectStore = transaction.objectStore(this.objectStoreName);
      const request = objectStore.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public async getAll(): Promise<any>{
    await this.waitForDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.objectStoreName, 'readonly');
      const objectStore = transaction.objectStore(this.objectStoreName);
      const request = objectStore.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public async delete(key: string): Promise<void> {
    await this.waitForDb();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.objectStoreName, 'readwrite');
      const objectStore = transaction.objectStore(this.objectStoreName);
      const request = objectStore.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }


  public get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.objectStoreName, 'readonly');
      const objectStore = transaction.objectStore(this.objectStoreName);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  public close() {
    if (this.db) {
      this.db.close();
    }
  }
}
