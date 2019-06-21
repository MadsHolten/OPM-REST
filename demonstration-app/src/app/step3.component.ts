import { Component, OnInit, Input } from '@angular/core';
import { AppData } from './app.data';
import { AppService } from './app.service';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sparql/sparql';
// import { OPMCalc } from '../../../../opm-qg/dist'
import { OPMCalc } from 'opm-qg';
import * as urljoin from 'url-join';

@Component({
    selector: 'app-step3',
    templateUrl: './step3.component.html',
    styleUrls: ['./app.component.css']
})
export class Step3Component implements OnInit {

    @Input() backend;
    @Input() db;

    public calculationData = [];
    public opmCalc;

    public cmConfigTTL = { 
        lineNumbers: true,
        firstLineNumber: 1,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'text/turtle'
    };
  
    public cmConfigJSON = this.cmConfigTTL;
    public cmConfigSPARQL = this.cmConfigTTL;

    public materializeCalculation: boolean = false;
    public calculations;

    constructor(
        private _ad: AppData,
        private _as: AppService
    ) { }

    ngOnInit(): void {
        this.cmConfigJSON.mode = 'javascript';
        this.cmConfigSPARQL.mode = 'application/sparql-query';

        this.calculationData = this._ad.calculationData.map(item => {
            return {def: item};
        })

        // Initialize class if not already initialized
        const prefixes = [{"prefix": "props", "uri": "https://w3id.org/props#"}];
        this.opmCalc = new OPMCalc(urljoin(this.backend, this.db, 'ice'), prefixes);
    }

    public createAll(){
        this.calculationData.forEach(item => {
            this.buildQuery(item);
            this.materialize(item);
        })
    }

    public buildQuery(item){       
        // Build query and append it to calculationData array item
        const q = this.opmCalc.postCalcData(item.def);
        item.query = q;
    }

    public runQuery(item){
        this._as.getQuery(this.backend, this.db, item.query, 'text/turtle').subscribe(res => {
            item.qRes = res;
            if(this.materializeCalculation){
                this.materialize(item);
            }
        }, err => console.log(err));
    }

    public materialize(item){
        this._as.postCalculation(this.backend, this.db, item.def).subscribe(res => {
            item.writeStatus = 'success';
        }, err => {
            item.writeStatus = err;
            console.log(err)
        });
    }

    public getCalculations(){
        this._as.getCalculations(this.backend, this.db).subscribe(res => {
            this.calculations = res;
        }, err => console.log(err))
    }

}