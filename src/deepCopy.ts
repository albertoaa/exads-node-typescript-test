/**
 * Deeply copies an array of objects.
 *
 * @param {T[]} array - The array to deep copy.
 * @returns {T[]} - The deeply copied array.
 */
export function deepCopyArray<T>(array: T[]): T[] {
  return array.map((item) => deepCopy(item)) as T[];
}

/**
 * Deeply copies a value.
 *
 * @param {any} value - The value to deep copy.
 * @returns {any} - The deeply copied value.
 */
function deepCopy(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => deepCopy(item));
  } else if (value !== null && typeof value === 'object') {
    const copy: unknown = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        copy[key] = deepCopy(value[key]);
      }
    }
    return copy;
  } else {
    return value; // Primitive value or function
  }
}

// Example usage:
interface Person {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
  };
}

const people: Person[] = [
  {
    name: 'Alice',
    age: 30,
    address: { street: '123 Main St', city: 'Wonderland' },
  },
  { name: 'Bob', age: 25, address: { street: '456 Elm St', city: 'Nowhere' } },
];

const copiedPeople = deepCopyArray(people);
console.log(copiedPeople);
