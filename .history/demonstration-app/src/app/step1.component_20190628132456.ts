import { Component, OnInit, Input } from '@angular/core';
import { AppData } from './app.data';
import { AppService } from './app.service';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sparql/sparql';

@Component({
    selector: 'app-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./app.component.css']
})
export class Step1Component implements OnInit {

    @Input() backend;
    @Input() db;

    public rvtUploadData = [
        {
          title: 'Load spaces', 
          description: 'Fitst step is to upload the spaces as instances of bot:Space.', 
          response: null,
          responseError: null,
          endpoint: 'class-assignment',
          triples: this._ad.spaceTriples, 
          dynamoScript: 'class-assignment.dyn'
        },
        {
          title: 'Load space names', 
          description: 'Next step is to upload the space names.', 
          response: null,
          responseError: null,
          endpoint: 'property-assignment',
          triples: this._ad.spaceNameTriples, 
          dynamoScript: 'property-assignment.dyn'
        },
        {
          title: 'Load space areas', 
          description: 'This step uploads the space areas.', 
          response: null,
          responseError: null,
          endpoint: 'property-assignment',
          triples: this._ad.spaceAreasTriples, 
          dynamoScript: 'property-assignment.dyn'
        },
        {
          title: 'Load walls', 
          description: 'This step uploads the walls as instances of bot:Element.', 
          response: null,
          responseError: null,
          endpoint: 'class-assignment',
          triples: this._ad.wallTriples, 
          dynamoScript: 'class-assignment.dyn'
        },
        {
          title: 'Load space/wall adjacencies', 
          description: 'This step uploads the space/wall adjacency relationships.', 
          response: null,
          responseError: null,
          endpoint: 'relationship-assignment',
          triples: this._ad.adjWallTriples, 
          dynamoScript: 'space-element-adjacency.dyn'
        },
        {
          title: 'Assign Revit Wall Types as classes', 
          description: 'This step uploads the Revit wall family types.', 
          response: null,
          responseError: null,
          endpoint: 'class-create',
          triples: this._ad.wallClassTriples, 
          dynamoScript: 'class-create.dyn'
        },
        {
          title: 'Assign walls to Revit Wall Type classes', 
          description: 'This step uploads the walls as instances of their Revit specific class.', 
          response: null,
          responseError: null,
          endpoint: 'class-assignment',
          triples: this._ad.wallClassAssTriples, 
          dynamoScript: 'class-create.dyn'
        }
      ]
    
      public miscUploadData = [
        {
          title: 'Create thermal environments', 
          description: 'First step is to create the project specific thermal environmens as subclasses of ice:ThermalEnvironment.', 
          response: null,
          responseError: null,
          endpoint: 'class-create',
          triples: this._ad.thermalEnvironmentTriples
        },
        {
          title: 'Create an outdoor environment', 
          description: 'Create an outdoor environment as an instance of ont:OutdoorsAir.', 
          response: null,
          responseError: null,
          endpoint: 'class-assignment',
          triples: this._ad.outdoorEnvironmentTriples
        },
        {
          title: 'Assign properties to thermal environments', 
          description: 'Next step is to assign property restrictions to the thermal environmens. These will be inherited by all instances of the class.', 
          response: null,
          responseError: null,
          endpoint: 'class-property-assignment',
          triples: this._ad.thermalEnvironmentPropertyTriples
        },
        {
          title: 'Assign heated room class to all spaces', 
          description: 'All spaces are assigned to the new HeatedRoom class by doing string replacements in the space assignment triples. In a real world situation these should be mapped by the engineer.', 
          response: null,
          responseError: null,
          endpoint: 'class-assignment',
          triples: this._ad.spaceTriples
            .replace('bot: <https://w3id.org/bot#>', 'ont: <http://localhost:3000/duplex/ice/ontology#>')
            .replace(/bot:Space/g, 'ont:HeatedRoom')
        },
        {
          title: 'Create dummy ICE wall class', 
          description: 'A dummy ICE wall class is created. This is a project specific class that holds thermal properties of the wall.', 
          response: null,
          responseError: null,
          endpoint: 'class-create',
          triples: this._ad.dymmyElementTriples
        },
        {
          title: 'Set U-value of dummy ICE wall element', 
          description: 'The dummy ICE wall class is assigned a U-value of 0.2 W/m2K.', 
          response: null,
          responseError: null,
          endpoint: 'class-property-assignment',
          triples: this._ad.dymmyElementPropertyTriples
        },
        {
          title: 'Assign dummy element class to all walls', 
          description: 'All walls are assigned to the new Dummy Element class by doing string replacements in the wall assignment triples. In a real world situation these should be mapped by the engineer.', 
          response: null,
          responseError: null,
          endpoint: 'class-assignment',
          triples: this._ad.wallTriples
            .replace('bot: <https://w3id.org/bot#>', 'ont: <http://localhost:3000/duplex/ice/ontology#>')
            .replace(/bot:Element/g, 'ont:DummyElement')
        }
      ]

    public cmConfigTTL = { 
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'text/turtle'
    };
  
    public cmConfigJSON = this.cmConfigTTL;
    public cmConfigSPARQL = this.cmConfigTTL;

    constructor(
        private _ad: AppData,
        private _as: AppService
    ) { }

    ngOnInit(): void { 
        this.cmConfigJSON.mode = 'javascript';
        this.cmConfigSPARQL.mode = 'application/sparql-query';
    }

    public uploadAll(){
        this.rvtUploadData.forEach(item => this.uploadSingle(item));
        this.miscUploadData.forEach(item => this.uploadSingle(item));
    }

    public uploadSingle(item){
        const triples = item.triples;
        const endpoint = item.endpoint;
        this._as.batchOPMAssign(this.backend, this.db, endpoint, triples).subscribe(res => {
          item.response = res;
          item.responseError = null;
        }, err => {
          console.log(err)
          item.responseError = err;
          item.response = null;
        })
    }

}
