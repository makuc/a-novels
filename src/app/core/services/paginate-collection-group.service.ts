import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, QueryGroupFn, AngularFirestoreCollectionGroup } from '@angular/fire/firestore';
import { scan, tap, first } from 'rxjs/operators';
import { dbKeys } from 'src/app/keys.config';
import { firestore } from 'firebase';
import { Genre } from 'src/app/shared/models/novels/genre.model';

export interface QueryConfig {
  public: boolean;
  authorID?: string;
  genres?: Genre[];
  sortField: 'iTitle' | 'createdAt' | 'updatedAt'; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order
  prepend: boolean; // prepend to source
}
@Injectable({
  providedIn: 'root'
})
export class PaginateCollectionGroupService<T> {

// tslint:disable: variable-name
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);
// tslint:enable: variable-name
  private colID: string;
  protected query: QueryConfig;
  protected queryFunc: QueryGroupFn;

  // Observable data
  data: Observable<T[]> = this._data.asObservable();
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();


  constructor(
    protected afs: AngularFirestore
  ) { }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  doInit(collectionID: string, opts?: Partial<QueryConfig>, queryFunc?: QueryGroupFn) {
    this._done.next(false);
    this._loading.next(false);
    this._data.next([]);

    this.colID = collectionID;
    this.queryFunc = queryFunc;
    this.query = {
      public: true,
      sortField: 'createdAt',
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    };

    const begin = this.afs.collectionGroup<T>(this.colID, ref => {
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

      const more = this.afs.collectionGroup<T>(this.colID, ref => {
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
  private mapAndUpdate(col: AngularFirestoreCollectionGroup<T>) {
    if (this._done.value || this._loading.value) { return; }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges().pipe(
      tap(arr => {
        let values = arr.map(snap => {
          const data = snap.payload.doc.data();
          const doc = snap.payload.doc;
          return {
            ...data,
            doc
          };
        });

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;
        values = this.query.prepend ? values.concat(this._data.value) : this._data.value.concat(values);

        // Update source with new values, done loading
        this._data.next(values);
        this._loading.next(false);

        // No more values, mark done
        if (!values.length) {
          this._done.next(true);
        }
      }),
      first()
    ).subscribe(
      () => null,
      (err) => console.error('mapAndUpdate:', err)
    );
  }

}
