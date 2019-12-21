import {OnDestroy} from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject, Subscription } from "rxjs";
import {takeUntil} from 'rxjs/operators';

export class ComponentBase implements OnDestroy {
  private readonly __destroyed$: Subject<void> = new Subject();
  private readonly __subscription = new Subscription();

  /**
   * Pipes the Observable through {@link takeUntil} and triggers on {@link OnDestroy}.
   *
   * See also: {@link takeUntilDestroyed}
   */
  protected takeUntilDestroyed$<T>(observable$: Observable<T>): Observable<T> {
    return observable$.pipe(this.takeUntilDestroyed());
  }

  /**
   * RxJS operator function: apply {@link takeUntil} with {@link OnDestroy} as trigger.
   *
   * See also: {@link takeUntilDestroyed$}
   */
  protected takeUntilDestroyed<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this.__destroyed$);
  }

  /**
   * Triggers unsubscription {@link OnDestroy}.
   *
   * See also: {@link Subscription}.
   *
   * @return the original subscription for a fluent api.
   */
  protected subscribeUntilDestroyed(subscription: Subscription): Subscription {
    this.__subscription.add(subscription);
    return subscription;
  }

  public ngOnDestroy(): void {
    this.__destroyed$.next();
    this.__destroyed$.complete();
    this.__subscription.unsubscribe();
  }

}
