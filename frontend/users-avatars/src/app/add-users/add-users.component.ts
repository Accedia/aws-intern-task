import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Input } from '@angular/core';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})

export class AddUsersComponent implements OnInit{
  success:string;
  error:string;
  @Input() users;
  showRegister = false; 
  userFormReady = false;

  public userForm = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl(''),
    image: new FormControl()
  });
  
  constructor(private usersService: UsersService) {}

  ngOnInit(){}

  private onSubmit(){
    console.log(this.userForm.value);
    this.usersService.addUser(this.userForm.value).subscribe(newUser => {
        this.success = "Successfully added user " + newUser[0].username.S;
        this.users.push(newUser[0]);

    }, error => {
        console.log(error);
        this.error = error.error;
    });
  }

  private toggleRegisterForm(){
    this.showRegister = !this.showRegister;  
  }

  private getBase64(event: any) {
    let me = this;
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      me.userForm.value.image = reader.result;
      me.userFormReady = true;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
}
