import { IObserver } from '@/core/interfaces/IObserver.ts';

export interface IObservable<TEvent, TSubject> {
  subscribe(event: TEvent, observer: IObserver<TSubject>): void;

  unsubscribe(event: TEvent, observer: IObserver<TSubject>): void;
}
