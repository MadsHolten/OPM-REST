import { Component, OnInit, Input } from '@angular/core';
import { AppData } from './app.data';
import { AppService } from './app.service';
import 'codemirror/mode/turtle/turtle';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/sparql/sparql';

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./app.component.css']
})
export class Step2Component implements OnInit {

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

    public createInterfacesQuery: string = this._ad.createInterfacesQuery;
    public interfaceTriples;
    public materializeInterfaces: boolean = true;
    public writeInterfacesStatus: string;
  
    public getSpaceEnvelopeQuery: string = this._ad.getSpaceEnvelopeQuery;
    public spaceEnvelopeTriples: string;
    public getSpaceEnvelopeStatus: string;
    public spaceEnvelopeCount: number;

    constructor(
        private _ad: AppData,
        private _as: AppService
    ) { }

    ngOnInit(): void { 
        this.cmConfigJSON.mode = 'javascript';
        this.cmConfigSPARQL.mode = 'application/sparql-query';
    }

    public createInterfaces(){
    this._as.getQuery(this.backend, this.db, this.createInterfacesQuery, 'text/turtle').subscribe(res => {
        this.interfaceTriples = res;
        
        // Write triples to store by also firing an INSERT query
        if(this.materializeInterfaces){
        const q = this.createInterfacesQuery.replace('CONSTRUCT', 'INSERT');
        this._as.updateQuery(this.backend, this.db, q).subscribe(res => {
            if(res.indexOf('Success') != -1){
            this.writeInterfacesStatus = 'success';
            }else{
            this.writeInterfacesStatus = 'Failed writing interfaces to store';
            }
        }, err => {
            this.writeInterfacesStatus = err;
            console.log(err)
        });
        }

    }, err => console.log(err))
    }

    public getSpaceEnvelopeTriples(){

    this._as.getQuery(this.backend, this.db, this.getSpaceEnvelopeQuery).subscribe(res => {

        // Count number of interfaces
        var counter = 0;

        // Create tree structure
        var formatted = [];
        const root = res['@graph'];

        if(root){
            root.forEach(item => {
                if(item['@type'].includes('bot:Space')){
                    if(item.hasEnvelope){
                        var envelope = [];
                        item.hasEnvelope.forEach(envURI => {
                            counter++;
                            var envProps = root.find(x => x['@id'] == envURI);
                            envelope.push(envProps);
                        })
                        item.hasEnvelope = envelope;
                        formatted.push(item);
                    }
                }
            })
        }else{
            console.log(res);
        }

        // Update to new structure and update public var
        res['@graph'] = formatted;
        this.spaceEnvelopeTriples = JSON.stringify(res, null, 2);
        this.spaceEnvelopeCount = counter;

    }, err => {
        this.getSpaceEnvelopeStatus = err;
        console.log(err)
    });

    }
}
