import { InputFilter } from '../../shared/directives/input-filter.model';

export const INPUT_FILTERS: Record<string, InputFilter> = {
  letters: {
    regex: /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g,
    maxLength: 50
  },

  numbers: {
    regex: /[^0-9]/g,
    maxLength: 10
  },

  alphanumeric: {
    regex: /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]/g
  },

  cellphone: {
    regex: /[^0-9]/g,
    maxLength: 9
  },

  document: {
    regex: /[^0-9]/g,
    maxLength: 8
  },

  ruc: {
    regex: /[^0-9]/g,
    maxLength: 11
  },

  precio: {
    regex: /[^0-9.]/g,
    maxLength: 11,
    transform: (value: string) => {
      // Permitir solo un punto decimal
      value = value.replace(/(\..*)\./g, '$1');

      // Máximo 2 decimales
      const match = value.match(/^(\d+)(\.\d{0,2})?/);

      return match ? match[0] : '';
    }
  },

  lote: {
    regex: /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g,
    maxLength: 10,
  },

  codProducto: {
    regex: /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s-]/g,
    maxLength: 10,
  }

};


export type InputFilterType = keyof typeof INPUT_FILTERS;