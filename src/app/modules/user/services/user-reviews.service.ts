import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { dbKeys } from 'src/app/keys.config';
import { firestore } from 'firebase';
import { Review } from 'src/app/shared/models/novels/review.model';
import { PaginateCollectionGroupService, QueryConfig } from 'src/app/core/services/paginate-collection-group.service';

@Injectable({
  providedIn: 'root'
})
export class UserReviewsService extends PaginateCollectionGroupService<Review> {

  constructor(
    afs: AngularFirestore,
  ) {
    super(afs);
  }

  init(uid: string, opts?: Partial<QueryConfig>) {
    const queryFunc = (ref: firestore.Query): firestore.Query => {
      const query = ref.where('author.uid', '==', uid);
      return query;
    };
    this.doInit(dbKeys.C_NOVELS_REVIEWS, opts, queryFunc);
  }

  getRevs(uid: string) {
    return this.afs.collectionGroup<Review>(dbKeys.C_NOVELS_REVIEWS, ref => {
      return ref.where('author.uid', '==', uid);
    }).valueChanges();
  }

}
