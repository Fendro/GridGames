export class ArrayUtils {
  public static randomIndex = <T>(array: ReadonlyArray<T>): number =>
    Math.floor(Math.random() * array.length);

  public static randomValue = <T>(array: ReadonlyArray<T>): T =>
    array[ArrayUtils.randomIndex(array)];
}
