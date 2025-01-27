export class LocalStorage {
  
  public static CURRENT_DATETIME: LocalStorage = new LocalStorage('CURRENT_DATETIME');
  
  private constructor(private readonly key: string) {}
  
  public get(): string | null {
    return localStorage.getItem(this.key);
  }
  
  public put(value: string) {
    localStorage.setItem(this.key, value);
  }
  
}