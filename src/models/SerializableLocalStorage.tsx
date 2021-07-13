class SerializableLocalStorage {
  serialize: <T>(data: T) => string;
  deserialize: <T>(serialized: string) => T;
  constructor(
    serialize: SerializableLocalStorage["serialize"],
    deserialize: SerializableLocalStorage["deserialize"]
  ) {
    this.serialize = serialize;
    this.deserialize = deserialize;
  }

  get<T>(key: string): T | null {
    const local = localStorage.getItem(key);
    return local === null ? null : this.deserialize(local);
  }

  set<T>(key: string, data: T) {
    localStorage.setItem(key, this.serialize(data));
  }
}
export const JSONLocalStorage = new SerializableLocalStorage(
  JSON.stringify,
  JSON.parse
);
