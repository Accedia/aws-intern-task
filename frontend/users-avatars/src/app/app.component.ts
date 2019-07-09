import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public title = 'users-avatars';
  public users: any[];
  public success = null;
  public error = null

  public constructor(private userService: UsersService) {}
  
  public ngOnInit() {
    this.userService.list().subscribe(users => {
      this.users = users;
    });
  }  
  
  public search(event: any){
    this.userService.searchByName(event.target.value).subscribe(users => {
        this.users = users
    }, error => {
        this.users = null;
    })    
  }

  public delete(username) {
    for( var i = 0; i < this.users.length; i++){ 
      if (this.users[i].username.S === username) {
        this.users.splice(i, 1); 
      }
    }
    this.userService.deleteByName(username).subscribe(deletedUser => {
      console.log(deletedUser);
      this.updateSuccess(deletedUser.username + " successfully deleted!", 3000);
    }, error => {
      this.updateError(error, 3000);
    });
  }

  updateSuccess(message: string, delayDestroy: number){
    this.success = message;
    setTimeout(() => {
      this.success=null;
    }, delayDestroy);
  }

  updateError(message: string, delayDestroy: number){
    this.error = message;
    setTimeout(() => {
      this.error=null;
    }, delayDestroy);
  }
}
