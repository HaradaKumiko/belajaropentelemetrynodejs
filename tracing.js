// tracing.js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Konfigurasi Jaeger exporter
const jaegerExporter = new JaegerExporter({
  serviceName: 'my-express-service', // Nama service yang sesuai
  endpoint: 'http://localhost:14268/api/traces',
  logLevel: 1
});

// Konfigurasi Node SDK dengan instrumentasi otomatis
const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// Set up a handler to gracefully shutdown the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
