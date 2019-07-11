import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/services/users.service';
import { LoaderService } from 'src/services/loader.service';

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
  // public isLoading = true;

  public constructor(private userService: UsersService, private loaderService: LoaderService) {}
  
  public ngOnInit() {
    this.loaderService.load();;
    this.userService.list().subscribe(users => {
      this.displayedUsers = users;
      this.allUsers = users;
      this.loaderService.stopLoading();
      // this.isLoading = false;
    });
  }  
  
  public search(event: any){
    // this.isLoading = true;
    // LoaderService.load();;
    let searchedUsers:any[] = [];
    let searchingFor = event.target.value.toLowerCase();
    for(var i = 0; i < this.allUsers.length; i++){
      if(this.allUsers[i].username.S.toLowerCase().includes(searchingFor)){
        searchedUsers.push(this.allUsers[i]);
      }
    }
    this.displayedUsers = searchedUsers;
    // LoaderService.stopLoading();;
    // this.isLoading = false;
  }

  public delete(username) {
    // this.isLoading = true;
    this.loaderService.load();;

    for( var i = 0; i < this.displayedUsers.length; i++){ 
      if (this.displayedUsers[i].username.S === username) {
        this.displayedUsers.splice(i, 1); 
      }
    }
    this.userService.deleteByName(username).subscribe(deletedUser => {
      this.updateSuccess(deletedUser.username + " successfully deleted!");
      this.loaderService.stopLoading();
      // this.isLoading = false;
    }, error => {
      this.updateError(error);
      // this.isLoading = false;
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

  updateError( message: string):void{
    this.error = this.capitalize(message);
    setTimeout(() => {
      this.error = null;
    }, this.messageDisplayTimeMs);
  }

  // loading(isLoading: boolean){
    // this.isLoading = isLoading;
  // }
}
