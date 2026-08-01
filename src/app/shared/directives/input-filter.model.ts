export interface InputFilter {
  regex: RegExp;
  maxLength?: number;
  transform?: (value: string) => string;
}