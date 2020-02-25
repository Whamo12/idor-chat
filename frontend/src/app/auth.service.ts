import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { User } from "./user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient) {}
  api = environment.apiUrl;
  isLoggedIn = false;
  loggedInUser: User;

  register(registraion) {
    return this.http.post(`${this.api}/register`, registraion);
  }

  login(creds) {
    return this.http.post(`${this.api}/login`, creds);
  }

  logout() {
    return this.http.patch(`${this.api}/logout`, this.loggedInUser);
  }

  removeToken() {
    localStorage.removeItem("AUTH_TOKEN");
  }

  getUserToken() {
    return localStorage.getItem("AUTH_TOKEN");
  }

  getUserId() {
    let jwt = localStorage.getItem("AUTH_TOKEN");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    let user: User = decodedJwtData;
    this.loggedInUser = user;
    return user.userId;
  }
}
