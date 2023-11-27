import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface TimeZone {
  countryCode: string;
  countryName: string;
  gmtOffset: number;
  timestamp: number;
  zoneName: string;
}

export interface Conversion {
  fromZoneName: string;
  fromAbbreviation: string;
  fromTimestamp: number;
  toZoneName: string;
  toAbbreviation: string;
  toTimestamp: number;
  offset: number;
}

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  API_KEY = environment.apiKey;
  API_URL = 'http://api.timezonedb.com/v2.1';

  constructor(private http: HttpClient) {}

  getTimeZones() {
    const params = new HttpParams({
      fromObject: { key: this.API_KEY, format: 'json' },
    });
    return this.http
      .get<{ message: string; status: string; zones: TimeZone[] }>(
        `${this.API_URL}/list-time-zone`,
        { params }
      )
      .pipe(map((response) => response.zones));
  }

  convertTime(time: Date, fromTz: string, toTz: string) {
    const params = new HttpParams({
      fromObject: {
        key: this.API_KEY,
        format: 'json',
        from: fromTz,
        to: toTz,
        time: Math.round(time.getTime() / 1000),
      },
    });

    return this.http.get<{ message: string; status: string } & Conversion>(
      `${this.API_URL}/convert-time-zone`,
      { params }
    );
  }
}
