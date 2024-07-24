const { NodeSDK } = require('@opentelemetry/sdk-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');

// Konfigurasi Jaeger exporter
const jaegerExporter = new JaegerExporter({
  serviceName: 'my-express-service',
  endpoint: 'http://jaeger:14268/api/traces', // Updated to use the service name
  logLevel: 1
});

// Konfigurasi Node SDK dengan instrumentasi otomatis
const sdk = new NodeSDK({
  traceExporter: jaegerExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()

// Set up a handler to gracefully shutdown the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
});
