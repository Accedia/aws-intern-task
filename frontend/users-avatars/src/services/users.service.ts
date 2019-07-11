import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = `${environment.apiHost}/users`;

  constructor(private httpService: HttpClient) { }


  public list(): Observable<any> {
    return this.httpService.get<any>(this.url);
  }

  public searchByName(name: string): Observable<any> {
    return this.httpService.get<any>(this.url+"/"+name);
  }

  public deleteByName(name: string): Observable<any>{
    return this.httpService.delete<any>(this.url+"?username="+name);
  }

  public addUser(body: JSON){
    return this.httpService.post<any>(this.url, body);
  }
}
