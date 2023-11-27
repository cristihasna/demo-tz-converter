import { Component, OnInit } from '@angular/core';
import {
  ConverterService,
  TimeZone,
} from './services/converter/converter.service';

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
    this.converter.getTimeZones().subscribe((response) => {
      this.timeZones = response;
    });
  }

  formatDate(date: Date): string {
    const month = date.getMonth() + 1;
    const datePart = `${month}/${date.getDate()}/${date.getFullYear()}`;
    const timePart = `${date.getHours()}:${date.getMinutes()}`;
    return `${datePart} ${timePart}`;
  }

  convert() {
    const localTime = new Date(`${this.fromDate} ${this.fromTime}`);
    this.isConverting = true;

    this.converter
      .convertTime(localTime, this.fromTz as string, this.toTz as string)
      .subscribe((response) => {
        this.isConverting = false;

        const date = new Date();
        date.setTime(response.toTimestamp * 1000);
        this.convertedDate = this.formatDate(date);
      });
  }
}
