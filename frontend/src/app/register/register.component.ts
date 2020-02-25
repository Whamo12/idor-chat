import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.registerForm = this.fb.group({
      userName: ["", [Validators.required]],
      title: ["", [Validators.required]],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required]
    });
  }

  onSubmit(registration) {
    const registerObj = {
      userName: registration.value.userName,
      title: registration.value.title,
      password: registration.value.password,
      confirmPassword: registration.value.confirmPassword
    };
    this.authService.register(registerObj).subscribe(res => {
      this.router.navigate(["login"]);
    });
  }
}
