import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { LoaderService } from 'src/services/loader.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})

export class AddUsersComponent implements OnInit{
  @Input() users;
  @Output() isLoading = new EventEmitter<boolean>();
  @Output() success = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  showRegister = false; 
  userFormReady = false;
  imageBase64;
  userForm: any;
  
  private createForm() {
    this.userForm = new FormGroup({
      username: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      password: new FormControl(''),
      email: new FormControl(''),
      image: new FormControl('')
    });
  }
  
  constructor(private usersService: UsersService, private loaderService: LoaderService) {}

  ngOnInit(){
    this.createForm();
  }

  private onSubmit(){
    this.loaderService.load();;
    // this.isLoading.emit(true);
    this.userForm.value.image = this.imageBase64;
    this.usersService.addUser(this.userForm.value).subscribe(newUser => {
        this.success.emit("Successfully added user " + newUser.username.S);
        console.log(this.userForm.value);
        this.users.push(newUser);
        this.createForm();
        // this.isLoading.emit(false);
        this.loaderService.stopLoading();
      }, error => {
        this.error.emit(error.error);
        // this.isLoading.emit(false);
        this.loaderService.stopLoading();
    });
  }

  private toggleRegisterForm(){
    this.showRegister = !this.showRegister;  
  }

  public getBase64(event: any) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageBase64 = reader.result;
      this.userFormReady = true;
      console.log(this.userForm.value);
    };
    reader.onerror = (error) => {
      console.log(error);
    };
 }
}
