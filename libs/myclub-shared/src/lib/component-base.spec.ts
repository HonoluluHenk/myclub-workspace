import { OnDestroy } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
//tslint:disable-next-line:rxjs-no-do
import { share, tap } from "rxjs/operators";
import {ComponentBase} from './component-base';
import { marbles } from "rxjs-marbles/jest";

describe('ComponentBase', () => {

  describe('loadClub$', () => {

    class MyComponent extends ComponentBase {
      public stream$: Observable<any>;
      public subscription: Subscription;

      constructor(observable$: Observable<any>) {
        super();
        this.stream$ = observable$
          .pipe(
            tap(value => {
                if (value === 'ondestroy') {
                  this.ngOnDestroy()
                }
              }
            ),
            share(),
            this.takeUntilDestroyed()
          )
        ;

        this.subscription = this.subscribeUntilDestroyed(this.stream$.subscribe({
          next: next => console.log(next),
          error: error => console.log(error)
        }));
      }
    }

    it('should unsubscribe and complete on onDestroy', marbles(m => {

      const source$ = m.hot('---a-u-a-|', {a: 'a', u: 'ondestroy'});
      const subs$ = "                ^----!";
      const expect$ = m.hot('---a-|', {a: 'a', u: 'ondestroy'});
      const fixture = new MyComponent(source$);

      m.expect(fixture.stream$).toBeObservable(expect$);
      m.expect(source$).toHaveSubscriptions(subs$);

    }));

    it('should unsubscribe the subscription on onDestroy', () => {
      const subject$ = new Subject();
      const fixture = new MyComponent(subject$);

      expect(fixture.subscription.closed)
        .toBeFalsy();

      fixture.ngOnDestroy();

      expect(fixture.subscription.closed)
        .toBeTruthy();
    })
  });
});
