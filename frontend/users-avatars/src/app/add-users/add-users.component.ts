import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})

export class AddUsersComponent implements OnInit {
  public userForm = new FormGroup({
    username: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl(''),
    image: new FormControl('')
  });
  
  constructor(private usersService: UsersService) { }

  ngOnInit() {
  }

  private onSubmit(){
    this.usersService.addUser(this.userForm.value).subscribe(newUser => {
        console.log("Successfully added user " + newUser);
    }, error => {
        console.log(error);
    });
  }
}
