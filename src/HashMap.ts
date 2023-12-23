export class HashMap<K, V> {
  constructor(private hash: (key: K) => string) {}

  private map = new Map<string, V>();

  get(key: K): V | undefined {
    return this.map.get(this.hash(key));
  }

  set(key: K, value: V) {
    this.map.set(this.hash(key), value);
  }

  has(key: K) {
    return this.map.has(this.hash(key));
  }

  delete(key: K) {
    return this.map.delete(this.hash(key));
  }

  clear() {
    this.map.clear();
  }
}
