import { City } from "../model/city";
import { TDateTime } from "../model/thyrannic-date-time";

abstract class LocalStorage<T> {
  
  constructor(private readonly key: string) {}
  
  abstract encode(value: T): string;
  abstract decode(str: string): T | undefined;
  
  public get(): T | null {
    const storedValue = localStorage.getItem(this.key);
    if (storedValue === null) return null;
    const decodedValue = this.decode(storedValue);
    if (decodedValue === undefined) {
      this.clear();
      return null;
    } else {
      return decodedValue;
    }
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
  decode(str: string): TDateTime | undefined {
    return TDateTime.fromValue(Number(str));
  }
}

class LocalStorageCustom<T> extends LocalStorage<T> {
  constructor(
    key: string,
    readonly encode: (obj: T) => string,
    readonly decode: (str: string) => T | undefined
  ) {
    super(key);
  }
}

export class LocalValue {
  private constructor() {}
  public static CURRENT_DATETIME: LocalStorage<TDateTime> = new LocalStorageDateTime('CURRENT_DATETIME');
  public static PINNED_DATETIME: LocalStorage<TDateTime> = new LocalStorageDateTime('PINNED_DATETIME');
  public static CITY: LocalStorage<City> = new LocalStorageCustom<City>('CITY', city => city.id.toString(), id => City.fromId(Number(id)));
}