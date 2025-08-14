import { EventEmitter } from 'node:events';
import { ISO8583 } from 'iso8583_esm';
import client from '../../client/index.js';

class OnDataEmitter extends EventEmitter {}
const onThisData = new OnDataEmitter();

export { onThisData };

export const sender = (message) =>
  new Promise((resolve) => {
    const mess = new ISO8583(message);
    const buffer = mess.getBufferMessage();
    const tras_unique = `${message['42']}_${message['11']}_${message['37']}`;

    // write to socket
    client.write(buffer);

    // Create event listener to listen for response message event.
    onThisData.on(tras_unique, (isoRes) => {
      resolve(isoRes);
      onThisData.removeAllListeners(tras_unique);
    });
  })
    .then((success) => success)
    .catch((e) => e);
