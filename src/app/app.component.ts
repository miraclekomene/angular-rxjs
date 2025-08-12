import { Component, DestroyRef, effect, inject, OnInit, signal} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  interval$ = interval(1000);
  // Now two Signal does one other nice thing for you.
  // It will automatically clean up the observable subscription
  // if the component where you are using that Signal
  // that was created with two Signal gets removed.
  intervalSignal =  toSignal(this.interval$, { initialValue: 0 });

  // interval = signal(0);
  // doubleInterval = computed(() => this.interval * 2);
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      // subscriber.error();
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value...')
      subscriber.next({message: 'New value' });
      timesExecuted++;
    }, 2000);
  });
  private destroyRef = inject(DestroyRef);
  constructor(){
    // effect(() => {
    //   console.log(`Clicked Button ${this.clickCount()} times`); // subscription setup for you!
      
    // })
  }
  ngOnInit(): void {
    // console.log(this.message()); // no subscription
    
    // setInterval(() => {
    //   this.interval.update(prevIntervalNumber => prevIntervalNumber +1);
    //   // update from signal
    // }, 1000)

    // const subscription = interval(1000).subscribe({
    // const subscription = interval(1000).pipe(
    //   map((val) => val * 2),
    // ).subscribe({ // pipe() allows operators to be added from Rxjs
    //   next: (val) => console.log(val),
    //   // complete: () => console.log('complete')
    // });

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('COMPLETED!'),
      error: (err) => console.log(err)
    });
    const subscription = this.clickCount$.subscribe({
      next: (val) => console.log(`Clicked button ${this.clickCount()} times.`)
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onClick (){
    this.clickCount.update(prevCount => prevCount + 1)
  }
}
