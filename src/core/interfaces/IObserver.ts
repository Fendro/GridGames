export interface IObserver<TSubject> {
  update(subject: TSubject): void;
}
