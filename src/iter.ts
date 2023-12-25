export function* uniqBy<T>(
  iter: Iterable<T>,
  fn: (item: T) => string
): Iterable<T> {
  const set = new Set<string>();

  for (const item of iter) {
    const key = fn(item);

    if (set.has(key)) {
      continue;
    }

    set.add(key);
    yield item;
  }
}

export function* flat<T>(iter: Iterable<T[]>): Iterable<T> {
  for (const item of iter) {
    yield* item;
  }
}

export function* map<T, U>(iter: Iterable<T>, fn: (item: T) => U): Iterable<U> {
  for (const item of iter) {
    yield fn(item);
  }
}

export function* flatMap<T, U>(
  iter: Iterable<T>,
  fn: (item: T) => Iterable<U>
): Iterable<U> {
  for (const item of iter) {
    yield* fn(item);
  }
}
