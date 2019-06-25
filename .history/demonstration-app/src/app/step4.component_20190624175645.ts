import { Component, OnInit, Input } from '@angular/core';
import { AppData } from './app.data';
import { HttpClient } from '@angular/common/http';
import { AppService } from './app.service';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sparql/sparql';

@Component({
    selector: 'app-step4',
    templateUrl: './step4.component.html',
    styleUrls: ['./app.component.css']
})
export class Step4Component implements OnInit {

    @Input() backend;
    @Input() db;

    public cmConfigTTL = { 
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'text/turtle'
    };
  
    public cmConfigJSON = this.cmConfigTTL;
    public cmConfigSPARQL = this.cmConfigTTL;

    public calculations;
    public outdated;
    public materialize;

    public thermalEnvProps;

    constructor(
        private _ad: AppData,
        private _as: AppService,
        private _http: HttpClient
    ) { }

    ngOnInit(): void {
        this.cmConfigJSON.mode = 'javascript';
        this.cmConfigSPARQL.mode = 'application/sparql-query';

        this.getCalculations();

        this.getThermalEnvironmentProperties();
    }

    public updateAll(){
        this.getCalculations();
        this.getThermalEnvironmentProperties();
    }

    public getCalculations(){
        this._as.getCalculations(this.backend, this.db).subscribe(res => {
            this.calculations = res['@graph'] ? res['@graph'] : [res];
        }, err => console.log(err))
    }

    public postAll(){
        this.calculations['@graph'].forEach(item => {
            this.postSingle(item);
        })
    }

    public getCalculationResults(item){
        var q =
        `PREFIX  opm: <https://w3id.org/opm#>
        PREFIX  prov: <http://www.w3.org/ns/prov#>

        CONSTRUCT
        WHERE {
            ?prop opm:hasPropertyState ?state .
            ?state prov:wasAttributedTo <${item['@id']}> ;
                ?key ?val .
        }`;

        this._as.getQuery(this.backend, this.db, q).subscribe(res => {
            item.getInferredResults = res;
        }, err => console.log(err))
    }

    public postSingle(item){
        var url = item['@id'];
        if(this.materialize){
            item.writeStatus = null;
            url += '?materialize=true';
        }
        this._http.post(url, {}).subscribe(res => {
            item.result = res;
            if(this.materialize) item.writeStatus = 'success';
        }, 
        err => {
            console.log(err)
            item.writeStatus = err;
            item.result = err;
        })
    }

    public putSingle(item){
        var url = item['@id'];
        if(this.materialize){
            item.writeStatus = null;
            url += '?materialize=true';
        }
        this._http.put(url,{}).subscribe(res => {
            item.result = res;
            if(this.materialize) item.writeStatus = 'success';
        }, 
        err => {
            console.log(err)
            item.writeStatus = err;
            item.result = err;
        })
    }

    public getOutdated(){
        this.outdated = null;
        this._as.getOutdated(this.backend, this.db).subscribe(res => {
            console.log(res);
            this.outdated = JSON.stringify(res, null, '\t');
            console.log(this.outdated);
        }, err => console.log(err))
    }

    public getThermalEnvironmentProperties(){
        this._as.getThermalEnvironmentProperties(this.backend, this.db).subscribe(res => {
            if(res['@graph']){
                this.thermalEnvProps = res['@graph'].map(item => {
                    const keys = Object.keys(item).filter(key => key != '@id');
                    item.propertyKeys = keys;
                    return item;
                });
            }
        }, err => console.log(err))
    }

}