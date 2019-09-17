import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface FusekiSettings{
    db: string;
    user: string;
    pass: string;
}

@Injectable()
export class Globals {

    // Global settings
    private fusekiSettings: BehaviorSubject<FusekiSettings>;

    constructor(
    ) {
        this.fusekiSettings = new BehaviorSubject<FusekiSettings>({db: 'duplex', user: 'admin', pass: 'admin'});
    }
    
    public getFusekiSettings(): Observable<FusekiSettings> {
        return this.fusekiSettings.asObservable();
    }

    public setFusekiSettings(newValue: FusekiSettings): void {
        console.log(newValue)
        this.fusekiSettings.next(newValue);
    }

}