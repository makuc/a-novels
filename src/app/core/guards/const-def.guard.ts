import { redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// const adminOnly = hasCustomClaim('admin');
export const redirectUnauthorizedToLogin = redirectUnauthorizedTo(['login']);
export const redirectLoggedInToHome = redirectLoggedInTo(['home']);
// const belongsToAccount = (next) => hasCustomClaim(`account-${next.params.id}`);
