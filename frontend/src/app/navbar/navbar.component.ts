import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { GlobalManagerService } from "../global-manager.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  loggedIn$ = this.globalManager.loggedIn$;

  constructor(
    public authService: AuthService,
    private globalManager: GlobalManagerService
  ) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
