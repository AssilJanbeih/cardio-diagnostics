import { SalesforceService } from "./../services/salesforce.service";
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import { catchError, take, switchMap } from "rxjs/operators";
@Injectable()
export class GlobalInterceptor<T> implements HttpInterceptor {
  constructor(
    private readonly salesForceService: SalesforceService // private readonly router: Router,
  ) {}

  intercept(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.indexOf("customers") > -1) {
      const salesForceUser = this.salesForceService.salesForceAccount;
      let authRequest = request;
      if (salesForceUser) {
        authRequest = this.addTokenHeader(request, salesForceUser.access_token);
      }
      return next.handle(authRequest);
    }
    return next.handle(request);
  }

  private addTokenHeader<T>(request: HttpRequest<T>, token: string) {
    return request.clone({
      headers: request.headers
        .set("Authorization", `Bearer ${token}`)
        .set("content-type", "application/json"),
    });
  }
}
