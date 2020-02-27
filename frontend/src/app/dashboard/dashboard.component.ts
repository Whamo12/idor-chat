import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../user";
import { Message } from "../message";
import { interval, Subscription } from "rxjs";
import { startWith, switchMap } from "rxjs/operators";
import { AppService } from "../app.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  faPencilAlt = faPencilAlt;
  faTrash = faTrash;
  messageForm: FormGroup;
  activeUsers: User[] = [];
  inactiveUsers: User[] = [];
  messages: Message[] = [];
  userForm: FormGroup;
  userId: number;
  user: User;
  activeSub: Subscription;
  inactiveSub: Subscription;
  messageSub: Subscription;
  isMsgUpdate = false;
  tempMsgId: number;
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
    this.activeSub = interval(1500)
      .pipe(
        startWith(0),
        switchMap(() => this.appService.getActiveUsers())
      )
      .subscribe(res => {
        this.activeUsers = res;
      });
    this.inactiveSub = interval(1500)
      .pipe(
        startWith(0),
        switchMap(() => this.appService.getInactiveUsers())
      )
      .subscribe(res => {
        this.inactiveUsers = res;
      });
    this.messageSub = interval(1500)
      .pipe(
        startWith(0),
        switchMap(() => this.appService.getMessages())
      )
      .subscribe(res => {
        this.messages = res;
      });
  }

  ngOnDestroy() {
    this.activeSub.unsubscribe();
    this.inactiveSub.unsubscribe();
    this.messageSub.unsubscribe();
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

  scroll(id: string) {
    const objDiv = document.getElementById(id);
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  onSubmit(messageInput) {
    const messageObj = {
      msg: messageInput.value.msg,
      userId: this.userId
    };
    if (!this.isMsgUpdate) {
      this.appService.submitMessage(messageObj).subscribe(res => {
        this.messageForm.reset();
        this.scroll("chatroom");
      });
    } else {
      this.appService.updateMessage(this.tempMsgId, messageObj).subscribe(_ => {
        this.isMsgUpdate = false;
        this.messageForm.reset();
      });
    }
  }

  deleteMessageById(message) {
    let r = confirm(`Delete message? "${message.message}"`);
    if (r == true) {
      this.appService.deleteMessage(message.id).subscribe();
    }
  }

  updateMessageById(message) {
    const tempMsgFormObj = { msg: message.message };
    this.tempMsgId = message.id;
    this.messageForm.patchValue(tempMsgFormObj);
    this.isMsgUpdate = true;
  }

  belongsToUser(message) {
    if (this.user) {
      return message.createdBy === this.user.userName;
    }
  }
}
