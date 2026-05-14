import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { City } from '../../models/city.model';
import { WeatherDetail } from '../../models/weather.model';
import { WeatherRecord } from '../../models/weather-record.model';

import { WeatherService } from '../../services/weather.service';
import { WeatherRecordService } from '../../services/weather-record.service';

/*
 * Implementar:
 * HU-03 — Detalle de Ciudad con Clima
 * HU-04 — Historial de Registros de Clima
 */

@Component({
  selector: 'app-city-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './city-detail.component.html'
})
export class CityDetailComponent implements OnChanges {
  private weatherService = inject(WeatherService);
  private weatherRecordService = inject(WeatherRecordService);

  @Input() city!: City;

  weatherDetail: WeatherDetail | null = null;
  weatherRecords: WeatherRecord[] = [];
  loading: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['city'] && this.city) {
      this.loadWeather();
      this.loadWeatherRecords();
    }
  }

  loadWeather(): void {
    this.loading = true;
    this.weatherDetail = null;

    this.weatherService.getWeather(this.city.name).subscribe({
      next: (weather) => {
        this.weatherDetail = weather;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando clima:', error);
        this.weatherDetail = null;
        this.loading = false;
      }
    });
  }

  loadWeatherRecords(): void {
    this.weatherRecordService.getRecords(this.city.id).subscribe({
      next: (records) => {
        this.weatherRecords = records;
      },
      error: (error) => {
        console.error('Error cargando historial:', error);
        this.weatherRecords = [];
      }
    });
  }

  saveWeather(): void {
    if (!this.weatherDetail) {
      return;
    }

    const record = {
      tempC: this.weatherDetail.temp_c,
      condition: this.weatherDetail.condition,
      humidity: this.weatherDetail.humidity
    };

    this.weatherRecordService.saveRecord(this.city.id, record).subscribe({
      next: () => {
        this.loadWeatherRecords();
      },
      error: (error) => {
        console.error('Error guardando clima:', error);
      }
    });
  }
}