import { Directive, HostListener, Input } from '@angular/core';  
import { NgControl } from '@angular/forms';

import {
  INPUT_FILTERS,
  InputFilterType
} from '../../shared/directives/input-filters';


@Directive({
  selector: '[appInputFilter]',
  standalone: true
})
export class InputFilterDirective {


  @Input()
  appInputFilter: InputFilterType = 'letters';


  constructor(
    private readonly ngControl: NgControl
  ) {}


  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement): void {

    const filter = INPUT_FILTERS[this.appInputFilter];

    let value = input.value;


    // Quitar caracteres no permitidos
    value = value.replace(filter.regex, '');

    // Aplicar transformación personalizada
    if (filter.transform) {
      value = filter.transform(value);
    }

    // Limitar cantidad de caracteres
    if (filter.maxLength !== undefined) {
      value = value.substring(0, filter.maxLength);
    }


    if (value !== input.value) {
      this.ngControl.control?.setValue(
        value,
        {
          emitEvent: false
        }
      );
    }
  }
}