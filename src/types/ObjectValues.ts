declare global {
  export type ObjectValues<T> = T[keyof T];
}
