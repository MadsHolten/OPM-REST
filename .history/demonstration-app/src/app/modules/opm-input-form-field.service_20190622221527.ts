import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// import * as moment from 'moment';

@Injectable()
export class OPMInputFormFieldService{

    
    constructor(
        public http: HttpClient
    ){}


    public getPropertyHistory(uri, suffix?: string): Observable<any>{

        var projNo = uri.split('/')[4];
        var endpoint = 'http://web-bim:3030/' + projNo + '/query';

        var q = `
            PREFIX opm: <https://w3id.org/opm#>
            CONSTRUCT{
                ?stateURI ?key ?val
            }
            WHERE {
                <${uri}> opm:hasPropertyState ?stateURI .
                ?stateURI ?key ?val .
            }`;

        return this._getQuery(endpoint, q)
            .pipe(
                map(item => {
                    item['@graph'] = item['@graph'].map(x => {
                        // var t = moment(x.generatedAtTime);
                        // x.generatedAtTime = t.format("YYYY-MM-DD HH:mm");
                        // x.timeAgo = t.fromNow();
                        if(suffix) x.value = `${x.value} ${suffix}`;
                        return x;
                    })
                    return item
                })
            )
    }

    public updateProperty(uri, value): Observable<any>{

        var body = {value};
        return this.http.put(uri, body);
        
    }

    public getProperty(URI){
        return this.http.get(URI);
    }

    private _getQuery(endpoint, query){
        
        var options: any = {
            params: {query: query},
            headers: {'Accept': 'application/ld+json'}
        };

        return this.http.get(endpoint, options);

    }

}