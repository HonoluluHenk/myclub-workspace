import {OnDestroy, OnInit} from '@angular/core';
import {MonoTypeOperatorFunction, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

export class ComponentBase implements OnInit, OnDestroy {
  private readonly destroyed: Subject<void> = new Subject();

  /**
   * Pipes the Observable through {@link takeUntil} and triggers on {@link OnDestroy}.
   *
   * See also: {@link takeUntilDestroyed}
   */
  protected takeUntilDestroyed$<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(this.takeUntilDestroyed());
  }

  /**
   * RxJS operator function: apply {@link takeUntil} with {@link OnDestroy} as trigger.
   *
   * See also: {@link takeUntilDestroyed$}
   */
  protected takeUntilDestroyed<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this.destroyed);
  }

  public ngOnInit(): void {
    // placeholder for symmetry to ngOnDestroy
  }

  public ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
