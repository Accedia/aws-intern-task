import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public title = 'users-avatars';
  public displayedUsers: any[] = [];
  public allUsers: any[] = [];
  public success = null;
  public error = null
  private messageDisplayTimeMs = 3000;

  public constructor(private userService: UsersService) {}
  
  public ngOnInit() {
    this.userService.list().subscribe(users => {
      this.displayedUsers = users;
      this.allUsers = users;
    });
  }  
  
  public search(event: any){
    let searchedUsers:any[] = [];
    let searchingFor = event.target.value.toLowerCase();
    for(var i = 0; i < this.allUsers.length; i++){
      if(this.allUsers[i].username.S.toLowerCase().includes(searchingFor)){
        searchedUsers.push(this.allUsers[i]);
      }
    }
    this.displayedUsers = searchedUsers;
  }

  public delete(username) {
    for( var i = 0; i < this.displayedUsers.length; i++){ 
      if (this.displayedUsers[i].username.S === username) {
        this.displayedUsers.splice(i, 1); 
      }
    }
    this.userService.deleteByName(username).subscribe(deletedUser => {
      this.updateSuccess(deletedUser.username + " successfully deleted!");
    }, error => {
      this.updateError(error);
    });
  }

  private capitalize(str: string):string{
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  openModal(avatarUrl: string):void{
    document.getElementById("avatar-modal").style.display = "block";
    let avatarImage = document.getElementById("avatar-image") as HTMLImageElement;
    avatarImage.src = avatarUrl;
  }

  closeModal(){
    document.getElementById("avatar-modal").style.display = "none";
  }

  updateSuccess(message: string):void{
    this.success = this.capitalize(message);
    setTimeout(() => {
      this.success=null;
    }, this.messageDisplayTimeMs);
  }

  updateError(message: string):void{
    this.error = this.capitalize(message);
    setTimeout(() => {
      this.error=null;
    }, this.messageDisplayTimeMs);
  }
}
