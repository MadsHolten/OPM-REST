import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

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

    public getSpaceWalls(host, db): Observable<any>{

        var url = urljoin(host, db, 'query');
        var query = `
            CONSTRUCT
            WHERE {
                ?s bot:adjacentElement ?el
            }`;

        var params = new HttpParams()
            .set('query', query)

        return this._http.get(url, {params});
    }

}