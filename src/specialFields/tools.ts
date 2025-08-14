import { DefaultError } from './../errors';
import type { ISO8583JSONMessageType } from './../ISO8583Base';
import * as Types from './../t';
import { formats } from './formats';

export const validateSpecialFields = (
  msg: ISO8583JSONMessageType,
  customFormats: Types.CustomFormatsT,
):
  | { valid: true }
  | {
      valid: false;
      error: DefaultError;
    } => {
  const fields = Object.keys(msg);
  let i = 0;
  for (i; i < fields.length; i++) {
    // @ts-ignore
    // @ts-ignore
    if (formats[fields[i]] && !customFormats[fields[i]]) {
      return {
        error: new DefaultError(`Special field ${fields[i]} has no custom formats`),
        valid: false,
      };
    }
  }
  if (i === fields.length) {
    return { valid: true };
  }
};
export const detectSpecial = (msg: ISO8583JSONMessageType) => {
  const state = false;
  const fields = Object.keys(msg);
  let i = 0;
  for (i; i < fields.length; i++) {
    // @ts-ignore
    if (formats[fields[i]]) {
      return true;
    }
  }
  if (i === fields.length) {
    return state;
  }

  return state;
};
