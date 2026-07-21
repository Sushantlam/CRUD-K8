# Phase 19: Logging

Goal: ship every pod's stdout/stderr logs into Loki, viewable in Grafana
(the same Grafana from the monitoring phase).

## 1. Install Loki

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install loki grafana/loki-stack \
  --namespace logging --create-namespace \
  --set fluent-bit.enabled=true \
  --set promtail.enabled=false
```

The `loki-stack` chart bundles Loki + Fluent Bit as a DaemonSet, which is
exactly what your guide calls for — no separate install needed.

## 2. Add Loki as a Grafana data source

If Grafana was installed by kube-prometheus-stack in a different namespace,
add Loki's URL as a data source:

```
URL: http://loki.logging.svc.cluster.local:3100
```

This can be done in the Grafana UI (Connections → Data sources → Loki) or
via a Helm values override on the monitoring chart.

## 3. Query logs

In Grafana's Explore view, switch to the Loki data source and query:

```
{namespace="mern", app="backend"}
```

Since the backend's error handler (`src/middleware/errorHandler.js`) logs
stack traces to stdout with `console.error`, and normal requests aren't
logged by default, consider adding a request logger (e.g. `morgan`) if you
want request-level logs to show up in Loki too — that's a good stretch goal
for this phase.
