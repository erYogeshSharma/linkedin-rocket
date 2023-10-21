// storage.ts

class ExtensionStorage {
  private storage: chrome.storage.StorageArea;

  constructor() {
    this.storage = chrome.storage.local; // You can also use chrome.storage.sync if needed
  }

  // Save data to the storage asynchronously
  async save(key: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const newData: { [key: string]: any } = {};
      newData[key] = data;
      this.storage.set(newData, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(data);
      });
    });
  }

  // Get data from the storage asynchronously
  async get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(key, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        console.log(result);
        resolve(result[key]);
      });
    });
  }

  // Remove data from the storage asynchronously
  async remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.remove(key, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
  //Clear the storage
  async clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.clear(() => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
}

// Create an instance of the storage class
const extensionStorage = new ExtensionStorage();

// Export the instance for use in your extension
export default extensionStorage;
