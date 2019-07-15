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

    public updateProperty(uri, value): Observable<any>{
        var body = {value};
        return this.http.put(uri, body);
    }

    public getProperty(URI){
        return this.http.get(URI);
    }

}