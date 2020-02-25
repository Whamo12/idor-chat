import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { GlobalManagerService } from "../global-manager.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  loggedIn$ = this.globalManager.loggedIn$;

  constructor(
    public authService: AuthService,
    private globalManager: GlobalManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  logout() {
    this.router.navigate(["login"]);

    this.authService
      .logout()
      .toPromise()
      .then(_ => {
        this.router.navigate(["login"]);
      })
      .then(_ => {
        localStorage.removeItem("AUTH_TOKEN");
      });
  }
}
