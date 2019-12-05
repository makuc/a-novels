import { throwError } from 'rxjs';

export class HttpErrorsHelper {

  protected get rejectLoginPromise() {
    return Promise.reject({ code: 403, msg: 'login required' });
  }
  protected get rejectDataPromise() {
    return Promise.reject({ code: 400, msg: 'invalid supplied data' });
  }
  protected get rejectLoginObservable() {
    return throwError({ code: 403, msg: 'login required' });
  }
  protected get rejectDataObservable() {
    return throwError({ code: 400, msg: 'invalid supplied data' });
  }

}
