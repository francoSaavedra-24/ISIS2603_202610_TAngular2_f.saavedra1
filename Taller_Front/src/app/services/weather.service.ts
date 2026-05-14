import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { WeatherDetail } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = environment.weatherApiKey;

  getWeather(cityName: string): Observable<WeatherDetail> {
    const url = `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${cityName}`;

    return this.http.get<any>(url).pipe(
      map(response => ({
        temp_c: response.current.temp_c,
        condition: response.current.condition.text,
        humidity: response.current.humidity
      }))
    );
  }
}