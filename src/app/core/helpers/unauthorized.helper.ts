import { keysConfig } from 'src/app/keys.config';
import { Router } from '@angular/router';

export class UnauthorizedHelper {

  constructor(
    protected router: Router
  ) { }

  protected handleUnauthorized(err: any) {
    if (err.name === 'EmptyError' || err.code === 403) {
      const queryParams: any = {};
      queryParams[keysConfig.RETURN_URL_KEY] = this.router.url;
      this.router.navigate(['login'], { queryParams });
    } else {
      console.error(err);
    }
  }
}
