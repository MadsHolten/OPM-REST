import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
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
        const url = urljoin(host, db, 'calculations');
        return this._http.get(url);
    }

    public postCalculation(host, db, body): Observable<any>{
        const url = urljoin(host, db, 'calculations');
        return this._http.post(url, body);
    }

}