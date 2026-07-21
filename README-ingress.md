# Ingress and Gateway API Notes

## 1. What is Ingress?

**Ingress** is a Kubernetes resource that lets users access your application from outside the cluster.

Think of it as a **receptionist**.

A user comes to the receptionist.

The receptionist checks:

- Which website (Host)?
- Which URL path?

Then sends the request to the correct service.

Example:

```text
example.com/api  → API Service
example.com/web  → Frontend Service
```

### What Ingress can do natively

✅ HTTP routing

✅ HTTPS routing

✅ Host-based routing

```text
api.example.com
shop.example.com
```

✅ Path-based routing

```text
/api
/admin
/images
```

That's basically all.

---

## 2. What Ingress cannot do by itself

Ingress **doesn't know** how to perform advanced networking.

Things like:

- SSL Redirect
- Rate Limiting
- Canary Deployment
- Traffic Splitting
- TCP
- UDP
- gRPC

are **NOT built into Ingress**.

For these features it needs an **Ingress Controller**.

---

## 3. What is an Ingress Controller?

Ingress is only a **rule**.

Someone has to actually enforce those rules.

That someone is the **Ingress Controller**.

Examples:

- NGINX Ingress Controller
- AWS Load Balancer Controller
- Traefik
- HAProxy

Example:

```text
Ingress

/api  → API Service

↓

NGINX Controller

↓

Actually routes traffic
```

Without a controller, Ingress does absolutely nothing.

---

## 4. What are Annotations?

Annotations are extra instructions.

Example:

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
```

or

```yaml
alb.ingress.kubernetes.io/scheme: internet-facing
```

Kubernetes itself **doesn't understand these.**

The controller reads them.

Think of annotations as sticky notes.

```text
Ingress

+ Sticky Note

↓

NGINX reads it

↓

Does something special
```

---

## 5. Problems with Ingress

### Problem 1

Only works inside one namespace.

Example:

```text
Frontend namespace
Backend namespace
Payments namespace
```

One Ingress cannot easily manage all of them.

### Problem 2

No team isolation.

Suppose:

```text
Team A
Team B
Team C
```

All edit the same Ingress.

Someone can accidentally break another team's routes.

### Problem 3

Advanced features depend on the controller.

Example:

```text
alb.ingress.kubernetes.io/ssl-policy
```

NGINX doesn't understand it.

If you move to NGINX, everything must be rewritten.

This is called **Vendor Lock-in**.

### Problem 4

Annotations are not validated.

Suppose:

Correct:

```text
alb.ingress.kubernetes.io/scheme
```

Wrong:

```text
alb.kubernets.io/scheme
```

Kubernetes says:

```text
Looks okay.
```

The controller silently ignores it.

---

## 6. What is gRPC?

gRPC is a very fast way for services to talk to each other.

Instead of:

```text
Browser
↓
REST API
↓
JSON
```

gRPC uses:

```text
HTTP/2
Binary Data
Much Faster
```

Used in microservices.

---

## 7. What is Gateway API?

Gateway API is the **next generation of Ingress**.

It solves many of Ingress's problems.

Think of it like:

```text
Ingress = Windows XP
Gateway API = Windows 11
```

or

```text
Ingress = Old phone
Gateway API = New smartphone
```

---

## 8. Why was Gateway API created?

Because people wanted:

- Better security
- Better routing
- Multiple protocols
- Multi-team support
- Less annotations
- Standard API

---

## 9. Gateway API supports

Unlike Ingress, Gateway API supports:

✅ HTTP

✅ HTTPS

✅ TCP

✅ UDP

✅ gRPC

---

## 10. Gateway API Resources

There are **3 main resources**.

### GatewayClass

Think of it as a blueprint.

Example:

```text
We want NGINX Gateway.
```

or

```text
We want AWS Gateway.
```

It defines which controller should manage the Gateway.

### Gateway

Gateway is the actual entry point.

Example:

```text
Listen on
Port 80
Port 443
TLS
HTTPS
```

It creates/configures the load balancer or proxy.

### HTTPRoute

This defines where traffic goes.

Example:

```text
/api → API Service
/admin → Admin Service
```

It contains the routing rules.

---

## 11. Easy Analogy

Imagine a shopping mall.

```text
Mall Design → GatewayClass
Main Entrance → Gateway
Directions inside mall → HTTPRoute
```

---

## 12. Gateway API Flow

```text
User
↓
Gateway
↓
HTTPRoute
↓
Service
↓
Pods
```

---

## 13. Control Plane vs Data Plane

### Control Plane

Makes decisions.

Example:

```text
Controller
Reads Gateway
Reads Routes
Updates configuration
```

No user traffic passes through it.

### Data Plane

Actually handles requests.

Example:

```text
User
↓
NGINX Proxy
↓
Backend
```

All traffic flows here.

### Easy way to remember

```text
Control Plane = Brain 🧠
Data Plane = Hands ✋
```

---

## 14. Cloud vs In-Cluster Gateway

### Cloud-managed

```text
Client → AWS ALB → Service → Pods
```

### In-cluster

```text
Client → NGINX Pods → Service → Pods
```

---

## 15. Quick Comparison

```text
Feature                Ingress         Gateway API
Easy Routing           ✅              ✅
HTTP/HTTPS             ✅              ✅
TCP/UDP                ❌              ✅
gRPC                  ❌              ✅
Multi-team support    ❌              ✅
Cross-namespace       Limited         ✅
Traffic splitting     Mostly via annotations   ✅ Built-in
Canary deployment      Via annotations          ✅ Built-in
Header-based routing   Mostly via annotations   ✅ Built-in
Better security       ❌              ✅
Standardized          Limited         ✅
```
