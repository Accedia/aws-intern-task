import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';
import { ConsoleReporter } from 'jasmine';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})

export class AddUsersComponent implements OnInit{
  @Input() users;
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  showRegister = false; 
  userFormReady = false;
  imageBase64;
  public userForm = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl(''),
    image: new FormControl('')
  });
  
  constructor(private usersService: UsersService) {}

  ngOnInit(){}

  private onSubmit(){

    this.userForm.value.image = this.imageBase64;
    this.usersService.addUser(this.userForm.value).subscribe(newUser => {
        this.success.emit("Successfully added user " + newUser.username.S);
        console.log(this.userForm.value);
        this.users.push(newUser);
    }, error => {
        this.error.emit(error.error);
    });
  }

  private toggleRegisterForm(){
    this.showRegister = !this.showRegister;  
  }

  public getBase64(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.imageBase64 = reader.result;
      me.userFormReady = true;
      console.log(me.userForm.value);
    };
    reader.onerror = function (error) {
      console.log(error);
    };
 }
}
