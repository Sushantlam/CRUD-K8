# Phase 18: Monitoring

The backend already exposes Prometheus-format metrics at `/metrics`
(request durations, default Node.js process metrics) via `prom-client`.

## 1. Install kube-prometheus-stack (Prometheus + Grafana + Alertmanager)

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

## 2. Point Prometheus at the backend

Apply the ServiceMonitor below (requires the Prometheus Operator CRDs,
which the Helm chart above installs):

```bash
kubectl apply -f k8s/monitoring/servicemonitor.yaml
```

## 3. View dashboards

```bash
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```

Default Grafana login is `admin` / `prom-operator` (check the Helm chart's
`values.yaml` or the auto-generated secret if that's changed).

Import a Node.js/Express dashboard from grafana.com, or build a simple one
tracking:
- `http_request_duration_seconds` (request rate + latency)
- `process_resident_memory_bytes` (memory usage)
- Pod restarts and CPU/memory from `kube-state-metrics` (installed by the chart)
