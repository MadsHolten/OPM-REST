import { Component, OnInit } from '@angular/core';
import { AppData } from './app.data';
import { AppService } from './app.service';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sparql/sparql';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  public backend: string = 'http://localhost:3000';
  public db: string = 'duplex';

  constructor(){}

  ngOnInit(){

  }

}
