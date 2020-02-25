import { Component, OnInit } from "@angular/core";
import { User } from "../user";
import { Message } from "../message";
import { interval } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { AppService } from "../app.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  messageForm: FormGroup;
  activeUsers: User[] = [];
  inactiveUsers: User[] = [];
  messages: Message[] = [];
  userForm: FormGroup;
  userId: number;
  user: User;
  test: any;
  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.userId = this.authService.getUserId();
    this.createForm();
    this.createUserForm();
  }

  ngOnInit(): void {
    this.getUser();
    this.test = interval(1000)
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

  createForm() {
    this.messageForm = this.fb.group({
      msg: ["", [Validators.required]],
      userId: ["", []]
    });
  }

  createUserForm() {
    this.userForm = this.fb.group({
      userName: ["", [Validators.required]],
      title: ["", [Validators.required]]
    });
  }

  onSubmit(messageInput) {
    const messageObj = {
      msg: messageInput.value.msg,
      userId: this.user.userId
    };
    this.appService.submitMessage(messageObj).subscribe(res => {
      this.messageForm.reset();
    });
  }

  getUser() {
    this.appService.getUser(this.userId).subscribe(res => {
      this.user = res;
      this.userForm.patchValue(this.user);
    });
  }

  onSubmitUser(userInput) {
    const userObj = {
      title: userInput.value.title,
      userId: this.userId
    };
    this.appService.updateProfile(userObj).subscribe(res => {
      this.getUser();
    });
  }
}
