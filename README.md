docker run -d --name prometheus -p 9090:9090 -v prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus

docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 14250:14250 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest

docker run -d --name grafana -p 3000:3000 grafana/grafana


how to run?
```
docker compose up --build -d
```

how to access 
```
localhost:6969 = apps
localhost:9090 = prometheus 
localhost:3000 = grafana
localhost:16686 = jaeger
```