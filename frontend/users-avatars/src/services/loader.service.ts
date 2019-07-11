import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import { Subject }    from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: Subject<boolean> = new Subject<boolean>();
  constructor() {}
  
  get isLoading (){
    return this.loading.asObservable();
  }

  public load(): void{
    this.loading.next(true);
  }
  
  public stopLoading(): void{
    this.loading.next(false);
  }
}
