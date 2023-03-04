import { Customer } from "./../models/customer";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap, Observable, BehaviorSubject } from "rxjs";

type SalesForceLogin = {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
};

@Injectable({
  providedIn: "root",
})
export class SalesforceService {
  private readonly salesForceAccount$: BehaviorSubject<SalesForceLogin | null> =
    new BehaviorSubject<SalesForceLogin | null>(null);

  constructor(private readonly http: HttpClient) {
    this.restoreSalesForceData();
  }

  get salesForceAccount(): SalesForceLogin {
    return this.salesForceAccount$.getValue();
  }

  loginOnSalesForce(): Observable<SalesForceLogin> {
    const options = {
      observe: "body" as const,
      responseType: "json" as const,
    };

    const body = {
      redirect_uri: "https://login.salesforce.com/services/oauth2/success",
      grant_type: "password",
      client_id:
        "3MVG9sh10GGnD4Dvy7ypyayKDz8L69JdRQHih.Q.fe6X_zDffHbrixYlgVEVbRKnpDqspSPylxAOjEJYuVaCs",
      client_secret:
        "2A9B12ECD8DA5515D097121D5FEF04C10CC500DC674BAB44BA05A9D7641EA836",
      username: "integrationuser@mallofqatar.com",
      password: "Intmoq@xGj!ll77BfYKD1RQxKFtdE7eW078OkZ16",
    };
    return this.http
      .post<SalesForceLogin>(
        "https://login.salesforce.com/services/oauth2/token",
        body,
        options
      )
      .pipe(
        tap((data) => {
          this.setSalesForceAccount(data);
        })
      );
  }

  setSalesForceAccount(data: SalesForceLogin) {
    const user = data;
    this.salesForceAccount$.next(user);
    if (user) {
      const salesForce = JSON.stringify(user);
      localStorage.setItem("salesForce", salesForce);
    } else {
      localStorage.removeItem("salesForce");
    }
  }

  createCustomerOnSalesForce(customer: Customer): Observable<SalesForceLogin> {
    let headers = new HttpHeaders();
    headers = headers.set("content-type", "application/json");
    const options = {
      observe: "body" as const,
      responseType: "json" as const,
    };

    const body = {
      inputs: [
        {
          Customer: {
            // Qatar_Id__pc: customer.qatarId,
            FirstName: customer.firstName,
            LastName: customer.lastName,
            PersonEmail: customer.email,
            Gender__c: customer.gender,
            PersonMobilePhone: customer.countryCode + customer.phone,
            Age__pc: customer.age,
            Nationality__c: customer.nationality,
            Account_Created_from__c: "Gift Card Microsite",
          },
        },
      ],
    };
    return this.http.post<SalesForceLogin>(
      "https://mallofqatar.my.salesforce.com/services/data/v54.0/actions/custom/flow/Loyalty_Create_Customer",
      body,
      options
    );
  }

  restoreSalesForceData(): void {
    const data = JSON.parse(
      localStorage.getItem("salesForce")
    ) as SalesForceLogin;
    this.salesForceAccount$.next(data);
  }
}
