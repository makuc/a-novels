import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, QueryFn, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { tap, takeUntil } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { HttpErrorsHelper } from '../helpers/http-errors.helper';

type CompiledSnapshot<T> = T & { doc: QueryDocumentSnapshot<T> };

export interface QueryConfig {
  sortField: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order
  prepend: boolean; // prepend to source
}
@Injectable({
  providedIn: 'root'
})
export class PaginateCollectionService<T> extends HttpErrorsHelper implements OnDestroy {

  protected end: Subject<void> = new Subject();

// tslint:disable: variable-name
  private _done: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _data: BehaviorSubject<CompiledSnapshot<T>[]> = new BehaviorSubject([]);
// tslint:enable: variable-name
  private path: string;
  protected query: QueryConfig;
  protected queryFunc: (ref: firestore.CollectionReference) => firestore.Query;

  // Observable data
  data: Observable<CompiledSnapshot<T>[]> = this._data.asObservable();
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();


  constructor(
    protected afs: AngularFirestore
  ) {
    super();
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  doInit(path: string, opts?: Partial<QueryConfig>, queryFunc?: QueryFn) {
    this._done.next(false);
    this._loading.next(false);
    this._data.next([]);

    this.path = path;
    this.queryFunc = queryFunc;
    this.query = {
      sortField: 'createdAt',
      limit: 5,
      reverse: false,
      prepend: false,
      ...opts
    };

    const begin = this.afs.collection<T>(this.path, ref => {
      if (!this.queryFunc) {
        return ref.orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
                  .limit(this.query.limit);
      } else {
        return this.queryFunc(ref)
                   .orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
                   .limit(this.query.limit);
      }
    });

    this.mapAndUpdate(begin);
  }

  more() {
    if (!this._done.value) {
      const cursor = this.getCursor();

      const more = this.afs.collection<T>(this.path, ref => {
        if (!this.queryFunc) {
          return ref.orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
                    .limit(this.query.limit)
                    .startAfter(cursor);
        } else {
          return this.queryFunc(ref)
                     .orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
                     .limit(this.query.limit)
                     .startAfter(cursor);
        }
      });

      this.mapAndUpdate(more);
    }
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<T>) {
    if (this._done.value || this._loading.value) { return; }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges().pipe(
      tap(snaps => {
        const value = this._data.value;
        let newDocs: CompiledSnapshot<T>[] = [];

        snaps.forEach(snap => {
          const data = snap.payload.doc.data();
          const doc = {
            ...data,
            doc: snap.payload.doc
          };

          let exists = false;
          for (let i = 0; i < value.length; i++) {
            const val = value[i];
            if (val.doc.id === doc.doc.id) {
              Object.keys(doc.doc).forEach((key, index) => {
                if (key !== 'doc') {
                  value[i][key] = doc[key];
                }
              })
              value[i] = doc;
              exists = true;
              break;
            }
          }

          // Those that weren't updated, just append them...
          if (!exists) {
            if (this.query.prepend) {
              newDocs.unshift(doc);
            } else {
              newDocs.push(doc);
            }
          }
        });

        // If prepending
        newDocs = this.query.prepend ? newDocs.concat(value) : value.concat(newDocs);

        // Update source with new values, done loading
        this._data.next(newDocs);
        this._loading.next(false);

        // No more values, mark done
        if (snaps.length < this.query.limit) {
          this._done.next(true);
        }
      }),
      takeUntil(this.end)
    ).subscribe(
      () => null,
      (err) => console.error('mapAndUpdate:', err)
    );
  }

}
