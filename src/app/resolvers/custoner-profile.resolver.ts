import { Customer } from "src/app/models/customer";
import { Injectable } from "@angular/core";
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from "@angular/router";
import { map, Observable } from "rxjs";
import { CustomerService } from "../services/customer.service";

@Injectable({
  providedIn: "root",
})
export class CustonerProfileResolver implements Resolve<boolean | Customer> {
  constructor(private readonly customerService: CustomerService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | Customer> {
    const customerId = route.params.customerId as string;
    return this.customerService.getCustomerById(customerId).pipe(
      map((data) => {
        // console.log(data, "dataaaaa resolver");
        return data;
      })
    );
  }
}
