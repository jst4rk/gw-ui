import { AbstractControl, ValidationErrors } from "@angular/forms";
import { isValidIPv4Address } from "./functions";

export class CustomValidators {
  static ipv4(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
      if (!isValidIPv4Address(value)) {
        return { invalidIPv4: { value: control.value } };
      }
      return null;
  }
}
