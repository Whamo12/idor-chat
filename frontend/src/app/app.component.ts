import { Component, OnInit } from "@angular/core";
import { AppService } from "./app.service";
import { interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { User } from "./user";
import { Message } from "./message";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "frontend";
  source: any;
  activeUsers: User[] = [];
  inactiveUsers: User[] = [];
  messages: Message[] = [];
  constructor(private appService: AppService) {}

  ngOnInit() {
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.appService.getActiveUsers())
      )
      .subscribe(res => {
        this.activeUsers = res;
      });
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.appService.getInactiveUsers())
      )
      .subscribe(res => {
        this.inactiveUsers = res;
      });
    interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.appService.getMessages())
      )
      .subscribe(res => {
        this.messages = res;
      });
  }
}
