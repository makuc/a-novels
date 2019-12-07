import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryFn,
  DocumentChangeAction,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { tap, first, map, mergeMap, single, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { HttpErrorsHelper } from '../helpers/http-errors.helper';

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
export class PaginateColsService<T> extends HttpErrorsHelper {

  // tslint:disable: variable-name
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _sources: BehaviorSubject<Observable<DocumentChangeAction<T>[]>[]> = new BehaviorSubject([]);
  private _cursor: QueryDocumentSnapshot<T>;
  // tslint:enable: variable-name
  private path: string;
  protected query: QueryConfig;
  protected queryFunc: (ref: firestore.CollectionReference) => firestore.Query;

  // Observable data
  data: Observable<T[]> = this._sources.asObservable().pipe(
    switchMap(sources => {
      this._loading.next(true);
      return combineLatest(sources);
    }),
    map(data => {
      let snaps: DocumentChangeAction<T>[] = [];

      data.forEach(singleArr => {
        if (singleArr.length < this.query.limit) {
          this._done.next(true);
        }
        snaps = snaps.concat(singleArr);
      });

      if (snaps.length > 0) {
        this._cursor = snaps[snaps.length - 1].payload.doc;
      } else {
        this._cursor = null;
      }

      this._loading.next(false);
      return snaps.map(snap => snap.payload.doc.data());
    })
  );
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(
    protected afs: AngularFirestore
  ) {
    super();
  }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  doInit(path: string, opts?: Partial<QueryConfig>, queryFunc?: QueryFn) {
    this._done.next(false);
    this._loading.next(false);
    this._sources.next([]);

    this.path = path;
    this.queryFunc = queryFunc;
    this.query = {
      public: true,
      sortField: 'createdAt',
      limit: 3,
      reverse: false,
      prepend: false,
      ...opts
    };

    const begin = this.afs.collection<T>(this.path, ref => {
      const query = this.queryFunc ? this.queryFunc(ref) : ref;
      return query
        .orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this._sources.next(this._sources.value.concat(begin.snapshotChanges()));
  }

  more() {
    if (!this._done.value && !this._loading.value && this.cursor) {
      console.log('more');
      const more = this.afs.collection<T>(this.path, ref => {
        const query = this.queryFunc ? this.queryFunc(ref) : ref;
        return query
          .orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
          .limit(this.query.limit)
          .startAfter(this.cursor);
      });
      this._sources.next(this._sources.value.concat(more.snapshotChanges()));
    }
  }

  // Determines the doc snapshot to paginate query
  private get cursor() {
    return this._cursor;
  }

}
