import { TDateTime } from "../model/thyrannic-date-time";

abstract class LocalStorage<T> {
  
  constructor(private readonly key: string) {}
  
  abstract encode(value: T): string;
  abstract decode(str: string): T;
  
  public get(): T | null {
    const storedValue = localStorage.getItem(this.key);
    if (storedValue === null) return null;
    return this.decode(storedValue);
  }
  
  public put(value: T) {
    localStorage.setItem(this.key, this.encode(value));
  }
  
  public clear() {
    localStorage.removeItem(this.key);
  }
  
}

class LocalStorageDateTime extends LocalStorage<TDateTime> {
  
  encode(datetime: TDateTime): string {
    return datetime.valueOf().toString();
  }
  
  decode(str: string): TDateTime {
    return TDateTime.fromValue(Number(str));
  }
  
}

export class LocalValue {
  private constructor() {}
  public static CURRENT_DATETIME: LocalStorage<TDateTime> = new LocalStorageDateTime('CURRENT_DATETIME');
  public static PINNED_DATETIME: LocalStorage<TDateTime> = new LocalStorageDateTime('PINNED_DATETIME');
}