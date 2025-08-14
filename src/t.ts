export interface Config {
  bitmapEncoding: BufferEncoding;
  [key: string]: string | BufferEncoding;
}
export interface KeyValueStringT {
  [key: string]: string;
}

export interface KeyValueT {
  [key: string]: string | boolean;
}

export type RequireFields = {
  [key: string]: number[];
};

export interface RequiredFieldSchemaT {
  processing_code: string;
  required_fields: RequireFields[];
  required_echo: number[];
}

export interface CustomFormatT {
  ContentType?: string;
  Label?: string;
  LenType?: string;
  MaxLen?: number;
  MinLen?: number;
  hasExtentions?: boolean;
}
export interface CustomFormatsT {
  [key: string]: CustomFormatT;
}

export interface Err {
  error: string;
}

export type ISO8583RawT = Buffer;

export interface ISO8583JsonT {
  [key: string | number]: string;
}

export interface BitMap {
  [key: string | number]: number;
}

export type ISOMessageT = ISO8583JsonT | ISO8583RawT;

import * as SpT from './specialFields/tools';
import * as maskPan from './maskPan';
import * as toSafeLog from './safeToLog';

/**
 * Set of methods for unpacking TCP message encoded in ISO 8583 format. Members of Main Class
 * @module Message-UnPackage
 */
import * as unpack_0_127 from './unpack/unpack_0_127';
import * as unpack_127_1_63 from './unpack/unpack_127_1_63';
import * as unpack_127_25_1_63 from './unpack/unpack_127_25_1_63';

/**
 * Set of methods for assembling the bitmaps for message field 0-127, 127.0-63, 127.25.0-39. Members of Main Class
 * @module Bitmap-Assemble
 */
import * as assembleBitMap from './bitmap/assembleBitMap';
import * as assembleBitMap_127 from './bitmap/assembleBitMap_127';
import * as assembleBitMap_127_25 from './bitmap/assembleBitMap_127_25';

/**
 * Set of methods for packing JSON message into a Buffer message. Members of Main Class
 * @module Message-Package
 */
import * as assemble0_127_Fields from './pack/assemble0_127_Fields';
import * as assemble127_extensions from './pack/assemble127_extensions';
import * as assemble127_25_extensions from './pack/assemble127_25_extensions';

/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
export class Main {
  MsgType: string | null = null;
  BufferMsg: ISO8583RawT | null = null;
  Msg: ISO8583JsonT | null = null;
  formats: CustomFormatsT;
  hasSpecialFields: boolean;
  bitmaps: KeyValueStringT | null;
  fields: KeyValueStringT;
  requiredFieldsSchema: RequiredFieldSchemaT;

  metaData: KeyValueStringT = {};

  maskPan: () => void;
  toSafeLog: () => void;

  assembleBitMap: () => Error | BitMap;
  assembleBitMap_127: () => void;
  assembleBitMap_127_25: () => void;

  unpack_0_127: () => void;
  unpack_127_1_63: () => void;
  unpack_127_25_1_63: () => void;

  assemble0_127_Fields: () => void;
  assemble127_extensions: () => void;
  assemble127_25_extensions: () => void;

  includesSecondaryBitmap: boolean;

  constructor(message: ISOMessageT, customFormats: CustomFormatsT, requiredFieldsSchema: RequiredFieldSchemaT) {
    if (Buffer.isBuffer(message)) {
      this.BufferMsg = message;
    } else {
      this.MsgType = message[0];
      this.Msg = message;
    }
    this.formats = customFormats || {};

    this.hasSpecialFields = SpT.validateSpecialFields(this.Msg, this.formats).valid;

    this.bitmaps = null;
    this.fields = {};

    this.requiredFieldsSchema = requiredFieldsSchema;

    this.maskPan = maskPan.maskPan.bind(this);
    this.toSafeLog = toSafeLog.safeToLog.bind(this);

    this.assembleBitMap = assembleBitMap.assembleBitmap.bind(this);
    this.assembleBitMap_127 = assembleBitMap_127.assembleBitmap_127.bind(this);
    this.assembleBitMap_127_25 = assembleBitMap_127_25.assembleBitmap_127_25.bind(this);

    this.unpack_0_127 = unpack_0_127.unpack_0_127.bind(this);
    this.unpack_127_1_63 = unpack_127_1_63.unpack_127_1_63.bind(this);
    this.unpack_127_25_1_63 = unpack_127_25_1_63.unpack_127_25_1_63.bind(this);

    this.assemble0_127_Fields = assemble0_127_Fields.assemble0_127_Fields.bind(this);
    this.assemble127_extensions = assemble127_extensions.assemble0_127_extensions.bind(this);
    this.assemble127_25_extensions = assemble127_25_extensions.assemble127_25_extensions.bind(this);
    this.includesSecondaryBitmap = false;
  }
}
