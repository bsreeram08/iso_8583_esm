import { Tools as T } from '../tools';
import { Formats as formats } from '../formats';

/**
 * Unpack fields 127.25.0-127 from an ISO 8583 encoded string into a JSON
 * @method unpack_127_25_1_63
 * @memberof module:Message-UnPackage
 */
export function unpack_127_25_1_63(slice_127_25, isoJSON) {
  if (slice_127_25.byteLength > 10 && T.isXmlEncoded(slice_127_25.slice(4, slice_127_25.length).toString())) {
    isoJSON['127.25'] = slice_127_25.slice(4, slice_127_25.length).toString();
    return {
      json: isoJSON,
      remSlice: Buffer.alloc(0, 0),
    };
  }
  if (slice_127_25.byteLength < 10) {
    return {
      json: isoJSON,
      remSlice: slice_127_25,
    };
  } else {
    slice_127_25 = slice_127_25.slice(4, slice_127_25.length);
    const bitmap = T.getHex(slice_127_25.slice(0, 16).toString()).split('').map(Number);
    slice_127_25 = slice_127_25.slice(16, slice_127_25.length);
    for (let i = 0; i < 34; i++) {
      if (bitmap[i] === 1) {
        const subField = '127.25.' + (i + 1);
        const this_format = this.formats[subField] || formats[subField];
        if (this_format) {
          if (this_format.LenType === 'fixed') {
            if (this_format.ContentType === 'b') {
              isoJSON[subField] = slice_127_25.slice(0, this_format.MaxLen / 2).toString('hex');
              slice_127_25 = slice_127_25.slice(this_format.MaxLen / 2, slice_127_25.length);
            } else {
              isoJSON[subField] = slice_127_25.slice(0, this_format.MaxLen).toString();
              slice_127_25 = slice_127_25.slice(this_format.MaxLen, slice_127_25.length);
            }
          } else {
            const thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen) return T.toErrorObject(['max length not implemented for ', this_format.LenType]);
            if (this.Msg[subField] && this.Msg[subField].length > this_format.MaxLen)
              return T.toInvalidLengthErrorObject(subField, this.Msg[subField].length);
            if (thisLen === 0) {
              throw T.toErrorObject(['field ', subField, ' format not implemented']);
            } else {
              const len = slice_127_25.slice(0, thisLen).toString();
              slice_127_25 = slice_127_25.slice(thisLen, slice_127_25.length);
              isoJSON[subField] = slice_127_25.slice(0, Number(len)).toString();
              slice_127_25 = slice_127_25.slice(Number(len), slice_127_25.length);
            }
          }
        } else {
          return T.toErrorObject(['field ', subField, ' format not implemented']);
        }
      }
    }

    return {
      json: isoJSON,
      remSlice: slice_127_25,
    };
  }
}
