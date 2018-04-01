import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { interval } from 'rxjs/observable/interval';
import { from } from 'rxjs/observable/from';
import { share, pluck, skipUntil, takeWhile } from 'rxjs/operators';

const observable$ = Observable
  .create((observer: any) => {
    try {
      observer.next('false');
      observer.next('Hey');
      observer.next('How are you');
      setInterval(() => observer.next('I am good'), 2000);
      // observer.complete();
      observer.next('This will not send');
    } catch(error) {
      observer.error(error);
    }
  })
  .pipe(share());

const observer = observable$.subscribe(
  addItem,
  (error: any) => addItem(error),
  addItem.bind(null, 'Completed')
);

observer.next('true');

let observer2;

setTimeout(() => {
  let observer2 = observable$.subscribe(
    (response: any) => addItem(`Observer #2 ${response}`)
  );
  observer.add(observer2);
}, 2000);

setTimeout(() => observer.unsubscribe(), 6000);

function addItem(value: any) {
  const element = document.createElement('li');
  const textNode = document.createTextNode(value);
  element.appendChild(textNode);
  document.getElementById('output').appendChild(element);
}




const eventObservable$ = fromEvent(document, 'mousemove');

let subscription;

setTimeout(() => {
  // let subscription = eventObservable$.subscribe(
  //   (response: any) => addItem(response)
  // );
}, 2000);




const subject$ = new ReplaySubject(2, 0);

subject$.subscribe(
  response => addItem(`Subject Observer #1 ${response}`),
  error => addItem(error),
  () => addItem('Subject Observer #1 Completed')
);

subject$.next('The first thing has been sent');
subject$.next('The second thing has been sent');
subject$.next('…is about to subscribe Subject Observer #2');

const subjectObserver2 = subject$.subscribe(
  response => addItem(`Subject Observer #2 ${response}`)
);

subject$.next('The third thing has been sent');

subjectObserver2.unsubscribe();

subject$.next('The another thing has been sent');




from([
  { first: 'Lucy', last: 'Fire', age: '17' },
  { first: 'Jane', last: 'Simmons', age: '21' },
  { first: 'Zack', last: 'Parise', age: '19' },
  { first: 'Bruce', last: 'Willis', age: '34' },
])
  .pipe(pluck('age'))
  .subscribe(console.log);



const dataSubject$ = new Subject();

setTimeout(() => dataSubject$.next('Hey'), 3000);

const dataObservable$ = Observable.create((data: any) => {
  let i = 1;
  setInterval(() => {
    data.next(i++);
  }, 1000);
});

dataObservable$
  .pipe(
    skipUntil(dataSubject$),
    takeWhile(value => value < 8)
  )
  .subscribe(console.log);