import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Bắt lỗi HTTP toàn cục — log ra console thay vì crash silent.
 * Các component không cần tự handle lỗi network nữa.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(err => {
      console.error(`[HTTP ${err.status}] ${req.url}`, err.error?.error ?? err.message);
      return throwError(() => err);
    })
  );
};
