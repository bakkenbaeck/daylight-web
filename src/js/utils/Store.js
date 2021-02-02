import idb from "idb";

const dbPromise = idb.open("sol-store", 1, (upgradeDB) => {
  upgradeDB.createObjectStore("sol");
});

const Store = {
  get(key) {
    return dbPromise.then((db) => {
      return db
        .transaction("sol")
        .objectStore("sol")
        .get(key)
        .then((value) => value || Promise.reject());
    });
  },
  set(key, val) {
    return dbPromise.then((db) => {
      const tx = db.transaction("sol", "readwrite");
      tx.objectStore("sol").put(val, key);
      return tx.complete;
    });
  },
};

export default Store;
