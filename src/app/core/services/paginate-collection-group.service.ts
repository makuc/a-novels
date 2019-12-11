import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  AngularFirestore,
  QueryGroupFn,
  AngularFirestoreCollectionGroup,
  DocumentChangeAction,
  QueryDocumentSnapshot
} from '@angular/fire/firestore';
import { throttleTime, takeUntil } from 'rxjs/operators';
import { HttpErrorsHelper } from '../helpers/http-errors.helper';
import { QueryConfig } from './paginate-collection.service';

type CompiledSnapshot<T> = T & { doc: QueryDocumentSnapshot<T> };

@Injectable({
  providedIn: 'root'
})
export class PaginateCollectionGroupService<T> extends HttpErrorsHelper implements OnDestroy {

  protected end: Subject<void> = new Subject();

// tslint:disable: variable-name
  private _done: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _data: BehaviorSubject<CompiledSnapshot<T>[]> = new BehaviorSubject([]);
// tslint:enable: variable-name
  private colID: string;
  protected query: QueryConfig;
  protected queryFunc: QueryGroupFn;

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
  doInit(collectionID: string, opts?: Partial<QueryConfig>, queryFunc?: QueryGroupFn) {
    this._done.next(false);
    this._loading.next(false);
    this._data.next([]);

    this.colID = collectionID;
    this.queryFunc = queryFunc;
    this.query = {
      sortField: 'createdAt',
      limit: 1,
      reverse: false,
      prepend: false,
      ...opts
    };

    const begin = this.afs.collectionGroup<T>(this.colID, ref => {
      const query = this.queryFunc ? this.queryFunc(ref) : ref;
      return query
        .orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(begin);
  }

  more() {
    if (!this._done.value) {
      const more = this.afs.collectionGroup<T>(this.colID, ref => {
        const query = this.queryFunc ? this.queryFunc(ref) : ref;
        return query
          .orderBy(this.query.sortField, this.query.reverse ? 'desc' : 'asc')
          .limit(this.query.limit)
          .startAfter(this.cursor);
      });

      this.mapAndUpdate(more);
    }
  }

  // Determines the doc snapshot to paginate query
  private  get cursor() {
    const current = this._data.value;
    if (current.length) {
      return this.query.prepend ? current[0].doc : current[current.length - 1].doc;
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollectionGroup<T>) {
    console.log('load more?', this._done.value, this._loading.value);
    if (this._done.value || this._loading.value) { return; }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges().pipe(
      throttleTime(1000, undefined, { trailing: true, leading: true }),
      takeUntil(this.end)
    ).subscribe(
      snaps => this.processSnaps(snaps),
      err => console.error(err)
    );
  }

  private processSnaps(snaps: DocumentChangeAction<T>[]) {
    console.log('processing snaps');
    const value = this._data.value;
    const newDocs: CompiledSnapshot<T>[] = [];

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
            if (key !== 'doc' && value[i][key] !== doc[key]) {
              value[i][key] = doc[key];
            }
          });
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
    if (newDocs.length > 0) {
      const updated = this.query.prepend ? newDocs.concat(value) : value.concat(newDocs);
      this._data.next(updated);
    }

    // Update source with new values, done loading
    this._loading.next(false);

    // No more values, mark done
    if (snaps.length < this.query.limit) {
      this._done.next(true);
    }
  }

}
