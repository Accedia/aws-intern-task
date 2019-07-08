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

  private updateList(){
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
    
    this.userService.deleteByName(username).subscribe(deletedUser => {
      this.updateList();
      console.log(deletedUser);
      // this.success = deletedUser.username + "successfully deleted!";
    }, error => {
      // this.error = error;
    })
  }
}
