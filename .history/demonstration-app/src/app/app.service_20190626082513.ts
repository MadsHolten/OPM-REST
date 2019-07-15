import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as urljoin from 'url-join';

@Injectable()
export class AppService {

    constructor(
        private _http: HttpClient
    ){}

    public batchOPMAssign(host, db, ep, triples): Observable<string>{
        const url = urljoin(host, db, 'opm-upload', ep);
        return this._http.post(url, triples, {headers: {'content-type': 'text/turtle'}, responseType: 'text'});
    }

    public getQuery(host, db, query, mimeType?): Observable<any>{

        const url = urljoin(host, db, 'query');

        var params: any = {query};
        var options: any = {};

        if(mimeType){
            params.mimeType = mimeType;
            options.responseType = 'text';
        }

        options.params = params;

        return this._http.get(url, options);
    }

    public updateQuery(host, db, query): Observable<any>{

        const url = urljoin(host, db, 'update');
        var params: any = {query};

        return this._http.get(url, {params, responseType: 'text'});

    }

    public getCalculations(host, db): Observable<any>{
        const url = urljoin(host, db, 'ice', 'calculations');
        return this._http.get(url);
    }

    public postCalculation(host, db, body): Observable<any>{
        const url = urljoin(host, db, 'ice', 'calculations');
        return this._http.post(url, body);
    }

    public getOutdated(host, db): Observable<any>{
        const url = urljoin(host, db, 'ice', 'calculations', 'outdated');
        return this._http.get(url);
    }

    public getTree(host, db): Observable<any>{
        const url = urljoin(host, db, 'ice', 'calculations', 'tree');
        return this._http.get(url);
    }

    public getThermalEnvironmentProperties(host, db){
        var q = `
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX ice: <https://w3id.org/ice#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX opm: <https://w3id.org/opm#>
            CONSTRUCT{
                ?foi ?prop ?propURI .
            }
            WHERE{
                ?foi rdfs:subClassOf ice:ThermalEnvironment , ?restr .
                ?restr a owl:Restriction ;
                    owl:onProperty ?prop ;
                    owl:hasValue ?propURI .
            }`;

        return this.getQuery(host, db, q);
    }

}