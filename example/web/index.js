import express from 'express';
import bodyParser from 'body-parser';
import xmlparser from 'express-xml-bodyparser';
import config from '../config/env.js';
import pos_route from './routes/pos.js';

const configs = config[process.env.NODE_ENV || 'development'];

const app = express();
app.post('/', (req, res) => {
  res.send({ status: 'ok' });
});

app.use(bodyParser.json());
app.use(xmlparser());

app.use('/pos', pos_route);

app.listen(configs.httpPort, () => {
  console.info({
    MESS: `Web server running at http://localhost:${configs.httpPort}`,
  });
});

export default app;
