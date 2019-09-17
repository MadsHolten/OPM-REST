import { Component, OnInit } from '@angular/core';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sparql/sparql';
import { Globals, FusekiSettings } from './app.globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  public backend: string = 'http://localhost:3000';
  public fusekiSettings: FusekiSettings;
  public db: string;

  constructor(
    private _globals: Globals
  ){}

  ngOnInit(){
    // Get settings
    this._globals.getFusekiSettings().subscribe(res => {
      this.fusekiSettings = res;
      this.db = res.db; // Temporary
    });
  }

  public updateFusekiSettings(){
    this.db = this.fusekiSettings.db;  // Temporary
    this._globals.setFusekiSettings(this.fusekiSettings);
  }

}
