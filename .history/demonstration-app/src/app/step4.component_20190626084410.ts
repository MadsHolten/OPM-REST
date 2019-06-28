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

        this.updateAll();
    }

    public async updateAll(){
        await this.getCalculations();
        this.getTree();
        this.getThermalEnvironmentProperties();
    }

    public getCalculations(): Promise<any>{
        return new Promise((resolve, reject) => {
            this._as.getCalculations(this.backend, this.db).subscribe(res => {
                this.calculations = res['@graph'] ? res['@graph'] : [res];
                resolve(this.calculations);
            }, err => {
                console.log(err);
                reject(err);
            })
        });
    }

    public getTree(){
        this._as.getTree(this.backend, this.db).subscribe(res => {
            res.forEach(calc => {
                console.log(calc);
                const match = this.calculations.find(item => item['@id'] == calc['@id'])
                console.log(match);
            })
        }, err => console.log(err))
    }

    public postAll(){
        const calculations = this.calculations['@graph'] ? this.calculations['@graph'] : [this.calculations];
        calculations.forEach(item => {
            this.postSingle(item);
        })
    }

    public putAll(){
        const calculations = this.calculations['@graph'] ? this.calculations['@graph'] : [this.calculations];
        calculations.forEach(item => {
            this.putSingle(item);
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
            url += '?materialize=true';
        }
        this._http.post(url, {}).subscribe(res => {
            item.result = JSON.stringify(res, null, '\t');
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
            url += '?materialize=true';
        }
        this._http.put(url,{}).subscribe(res => {
            item.result = JSON.stringify(res, null, '\t');
            if(this.materialize) item.writeStatus = 'success';
        }, 
        err => {
            console.log(err)
            item.writeStatus = err;
            item.result = err;
        })
    }

    public getOutdated(){
        this._as.getOutdated(this.backend, this.db).subscribe(res => {
            this.outdated = JSON.stringify(res, null, '\t');
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