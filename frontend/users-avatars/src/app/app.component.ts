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
    this.updateList(); 
  }  

  protected updateList(){
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
      this.success = deletedUser[0].username + " successfully deleted!";
    }, error => {
      this.error = error;
    })
  }
}
