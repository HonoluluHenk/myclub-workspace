import {hot} from '@nrwl/angular/testing';
import {Observable, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ComponentBase} from './component-base';
import { marbles } from "rxjs-marbles/jest";

describe('ComponentBase', () => {

  describe('loadClub$', () => {

    class MyComponent extends ComponentBase {
      public stream$: Observable<any>;

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
            this.takeUntilDestroyed()
          )
        ;
      }
    }

    it('should unsubscribe and complete on onDestroy', marbles(m => {

      const source = m.hot('---a-u-a-|', {a: 'a', u: 'ondestroy'});
      const subs = "                ^----!";
      const expect = m.hot('---a-|', {a: 'a', u: 'ondestroy'});
      const fixture = new MyComponent(source);

      m.expect(fixture.stream$).toBeObservable(expect);
      m.expect(source).toHaveSubscriptions(subs);
    }));
  });
});
