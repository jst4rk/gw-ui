import { HttpErrorResponse } from '@angular/common/http';
import { isEmpty, isNil } from 'lodash-es';

export function isEmptyOrNil(value: unknown) {
  return isEmpty(value) || isNil(value);
}

export function isValidIPv4Address(ipAddress: string) {
  const ipv4Regex = /\b(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))\b/;
  return ipv4Regex.test(ipAddress);
}

export function handleResponseErrorsMsg(error: HttpErrorResponse) {
  const msg = error.error.message as string;
  // E11000 is the error code for duplicated key in mongo
  if (msg.includes('E11000')) {
    // This could be handled in the backend for a better aproach
    // To select the scheme part of the string
    // first split the string by the '.'
    // then take the second part and split it by the ' '
    // then take the first element of the resulting array
    const schemaName = msg.split('.')[1].split(' ')[0];

    switch (schemaName) {
      case 'gateways':
        return 'A Gateway with the same Serial ID already exist.';

      case 'devices':
        return 'A Device with the same UID already exist.';

      default:
        return 'There was an error with your request.';
    }
  }

  return 'There was an error with your request.'
}
