import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  private isLoading: boolean;
   
  constructor(private loaderService: LoaderService) {
    this.loaderService.isLoading.subscribe(loading => {
      this.isLoading = loading;
    });;
  }

  ngOnInit() {}

}
