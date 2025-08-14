import { Tools as T } from '../tools';

/**
 * Assembles the Bitmap of field 127.0-63 for the ISO 8583 message in the Main class Instance.
 * @function assembleBitmap_127
 * @memberof module:Bitmap-Assemble
 */
export function assembleBitmap_127() {
  const extend = this.rebuildExtensions();
  const state = this.checkMTI();
  if (state && !extend.error) {
    if (this.Msg['0'] && state) {
      const _map = new Uint8Array(64);
      for (let i = 0; i < _map.length; i++) {
        const field = '127.' + (i + 1);

        if (this.Msg[field]) {
          _map[i] = 1;
        }
      }
      return _map;
    } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
  } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
}
