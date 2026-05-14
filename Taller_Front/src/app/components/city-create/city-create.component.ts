import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Country } from '../../models/country.model';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';

/*
 * Implementar: HU-02 — Crear Ciudad
 */

@Component({
  selector: 'app-city-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './city-create.component.html'
})
export class CityCreateComponent implements OnInit {
  @Output() cityCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private countryService = inject(CountryService);
  private cityService = inject(CityService);

  cityName: string = '';
  selectedCountryId: number | null = null;
  countries: Country[] = [];

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (error) => {
        console.error('Error cargando países:', error);
      }
    });
  }

  onSave(): void {
    if (!this.cityName.trim() || this.selectedCountryId === null) {
      return;
    }

    const newCity = {
      name: this.cityName.trim()
    };

    this.cityService.createCity(this.selectedCountryId, newCity).subscribe({
      next: () => {
        this.cityCreated.emit();
        this.cityName = '';
        this.selectedCountryId = null;
      },
      error: (error) => {
        console.error('Error creando ciudad:', error);
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}