import { FormGroup } from "@angular/forms";

export function isValid(form: FormGroup) {
  form.updateValueAndValidity();
  form.markAllAsTouched();

  return form.valid;
}
