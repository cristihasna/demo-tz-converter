import { Component, OnInit } from '@angular/core';
import {
  ConverterService,
  TimeZone,
} from './services/converter/converter.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  timeZones: TimeZone[] = [];

  fromDate: string = '';
  fromTime: string = '';
  fromTz: string | null = null;
  toTz: string | null = null;

  isConverting: boolean = false;
  convertedDate: string | null = null;

  constructor(private converter: ConverterService) {}

  ngOnInit() {
    console.log('App initialized');
    const cachedTz = localStorage.getItem('timezones');
    if (cachedTz) {
      this.timeZones = JSON.parse(cachedTz) as TimeZone[];
      this.fromTz = this.timeZones[0].zoneName;
      this.toTz = this.timeZones[1].zoneName;
      console.info('Loaded from local storage');

      return;
    }

    this.converter
      .getTimeZones()
      .pipe(delay(1000))
      .subscribe((response) => {
        this.timeZones = response;
        localStorage.setItem('timezones', JSON.stringify(response));

        this.fromTz = response[0].zoneName;
        this.toTz = response[1].zoneName;
        console.info('Response from the server');
        console.table([this.fromTz, this.toTz]);
      });
  }

  formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const datePart = `${month}/${date.getDate()}/${date.getFullYear()}`;
    const timePart = `${date.getHours()}:${date.getMinutes()}`;

    console.count('formatting');
    return `${datePart} ${timePart}`;
  }

  convert() {
    const localTime = new Date(`${this.fromDate} ${this.fromTime}`);
    this.isConverting = true;

    console.count('clicking button');
    console.assert(
      !!this.fromDate && !!this.fromTime,
      'Oops. No date or time selected'
    );

    if (!this.fromDate || !this.fromTime) {
      throw new Error('No date or time selected.');
    }

    console.time('Converting');

    this.converter
      .convertTime(localTime, this.fromTz as string, this.toTz as string)
      .subscribe((response) => {
        this.isConverting = false;

        const date = new Date();
        date.setTime(response.toTimestamp * 1000);
        this.convertedDate = this.formatDate(date);

        console.timeEnd('Converting');
      });
  }
}
