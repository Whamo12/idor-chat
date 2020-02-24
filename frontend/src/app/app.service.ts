import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable, of } from "rxjs";
import { User } from "./user";
import { Message } from "./message";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AppService {
  constructor(private http: HttpClient) {}
  api = "http://localhost:5000";
  getActiveUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.api}/users/active`)
      .pipe(catchError(err => of(null)));
  }
  getInactiveUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.api}/users/inactive`)
      .pipe(catchError(err => of(null)));
  }
  getMessages(): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${this.api}/messages`)
      .pipe(catchError(err => of(null)));
  }
}
