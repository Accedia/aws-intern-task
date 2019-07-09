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

  public userForm = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl('')
  });
  
  constructor(private usersService: UsersService) {}

  ngOnInit(){}

  private onSubmit(){
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
}
