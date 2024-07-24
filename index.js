require('./tracing'); // Import konfigurasi tracing

const express = require('express');
const { trace, context } = require('@opentelemetry/api');
const winston = require('winston');
const { collectDefaultMetrics, Counter, register } = require('prom-client');


const app = express();
const port = 6969;


// Create a new Counter metric
const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route']
});


// Inisialisasi metrik
collectDefaultMetrics();

app.use((req, res, next) => {
  httpRequestsTotal.inc({ method: req.method, route: req.route ? req.route.path : 'unknown' });
  next();
});

  // Endpoint untuk metrik Prometheus
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  

// Konfigurasi winston logger
const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Middleware untuk tracing
app.use((req, res, next) => {
  const tracer = trace.getTracer('default');
  const span = tracer.startSpan('handle_request', {
    attributes: {
      'http.method': req.method,
      'http.url': req.url,
    },
  });

  // Simpan span dalam request object
  req.span = span;

  // Simpan Trace ID dan Span ID dalam request object
  req.traceId = span.spanContext().traceId;
  req.spanId = span.spanContext().spanId;

  // End span saat response selesai
  res.on('finish', () => {
    span.end();
  });

  next();
});

app.get('/', (req, res) => {
  const tracer = trace.getTracer('default');

  // Set context aktif dengan span dari middleware
  context.with(trace.setSpan(context.active(), req.span), () => {
    // Log beberapa informasi
    const logMessage = `Handling request: ${req.method} ${req.url}`;
    logger.info(logMessage);

    // Tambahkan log sebagai event ke span
    req.span.addEvent('log_event', { message: logMessage });

    // Menambahkan trace ID dan span ID ke header respons
    res.setHeader('X-Trace-ID', req.traceId);
    res.setHeader('X-Span-ID', req.spanId);

    // Simulasi pekerjaan yang dilakukan
    setTimeout(() => {
      res.send(`Hello, World! Trace ID: ${req.traceId}, Span ID: ${req.spanId}`);
    }, 100);
  });
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
