import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.loginForm = this.fb.group({
      userName: ["", [Validators.required]],
      password: ["", Validators.required]
    });
  }

  onSubmit(creds) {
    const login = {
      userName: creds.value.userName,
      password: creds.value.password
    };
    this.authService.login(login).subscribe(res => {
      localStorage.setItem("AUTH_TOKEN", res.toString());
      this.router.navigate(["dashboard"]);
    });
  }
}
