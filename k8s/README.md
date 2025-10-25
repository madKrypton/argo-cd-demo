# Kubernetes Deployment for Music Dashboard

This folder contains Kubernetes manifests for deploying the Music Dashboard application using Kustomize overlays for different environments.

## 📂 Directory Structure

```
k8s/
├── base/                   # Base Kubernetes configurations
│   ├── namespace.yaml     # Namespace definition
│   ├── deployment.yaml    # Main application deployment
│   ├── service.yaml       # Service configuration
│   ├── configmap.yaml     # Application configuration
│   └── kustomization.yaml # Base kustomization file
└── overlays/              # Environment-specific overlays
    ├── dev/              # Development environment
    │   └── kustomization.yaml
    └── qa/               # QA environment
        └── kustomization.yaml
```

## 🌟 Environment Configurations

### Development (dev)
- **Namespace:** `music-app-dev`
- **Resource Prefix:** `dev-`
- **Replicas:** 2
- **Resources:**
  - Memory Requests: 64Mi
  - Memory Limits: 128Mi

### QA
- **Namespace:** `music-app-qa`
- **Resource Prefix:** `qa-`
- **Replicas:** 3
- **Resources:**
  - Memory Requests: 128Mi
  - Memory Limits: 256Mi
  - CPU Requests: 200m
  - CPU Limits: 500m

## 📦 Image Information

- **Docker Image:** `appukuttan/mastersong`
- **Author:** Akash

## 🚀 Deployment with Kustomize

### Testing Configurations

You can preview the generated manifests for each environment using:

```bash
# Preview dev environment manifests
kubectl kustomize overlays/dev

# Preview qa environment manifests
kubectl kustomize overlays/qa
```

### Manual Deployment (if not using ArgoCD)

```bash
# Deploy to dev environment
kubectl apply -k overlays/dev

# Deploy to qa environment
kubectl apply -k overlays/qa
```

## 🔄 ArgoCD Integration

### Option 1: Deploy All Resources at Once

```powershell
kubectl apply -f k8s/
```

### Option 2: Deploy Individual Resources (Recommended)

```powershell
# Create namespace first
kubectl apply -f k8s/namespace.yaml

# Deploy application components
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Optional: Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

## 🔍 Verify Deployment

```bash
# Check namespace
kubectl get namespace music-dashboard

# Check all resources in the namespace
kubectl get all -n music-dashboard

# Check pods
kubectl get pods -n music-dashboard

# Check service
kubectl get svc -n music-dashboard

# Check ingress
kubectl get ingress -n music-dashboard

# View pod logs
kubectl logs -n music-dashboard -l app=music-dashboard

# Describe deployment
kubectl describe deployment music-dashboard -n music-dashboard
```

## 🌐 Access the Application in Minikube

### Option 1: Using NodePort (Easiest)

```powershell
# Get the Minikube IP
minikube ip

# Access the application using Minikube IP and NodePort
# http://<MINIKUBE-IP>:30080
```

Example: If minikube IP is `192.168.49.2`, access via:
```
http://192.168.49.2:30080
```

### Option 2: Using Minikube Service Command

```powershell
# This will automatically open the service in your browser
minikube service music-dashboard -n music-dashboard
```

### Option 3: Via Port Forward

```powershell
kubectl port-forward -n music-dashboard svc/music-dashboard 8080:80

# Access via browser
# http://localhost:8080
```

### Option 4: Via Ingress (if enabled)

```powershell
# Get Minikube IP
minikube ip

# Add to C:\Windows\System32\drivers\etc\hosts (as Administrator)
# <MINIKUBE-IP> music-dashboard.local

# Then access
# http://music-dashboard.local
```

## 📊 Resources Configuration

- **Platform:** Minikube
- **Service Type:** NodePort (port 30080)
- **Replicas:** 3
- **CPU Request:** 100m
- **CPU Limit:** 200m
- **Memory Request:** 64Mi
- **Memory Limit:** 128Mi
- **Health Checks:** Liveness and Readiness probes configured

## 🔄 Update Deployment

To update the application version:

1. Update the image tag in the respective environment's kustomization.yaml:

```yaml
# k8s/overlays/dev/kustomization.yaml or k8s/overlays/qa/kustomization.yaml
images:
  - name: appukuttan/mastersong
    newTag: main-19  # Update this to the desired version
```

2. Commit and push the changes
3. ArgoCD will automatically detect and apply the changes

For manual deployments:
```bash
# After updating kustomization.yaml, apply the changes
kubectl apply -k overlays/dev  # or overlays/qa
```

## 🔧 Scale Application

```bash
# Scale to 5 replicas
kubectl scale deployment music-dashboard -n music-dashboard --replicas=5

# Auto-scale based on CPU
kubectl autoscale deployment music-dashboard -n music-dashboard --cpu-percent=70 --min=3 --max=10
```

## 🗑️ Delete Deployment

```powershell
# Delete all resources
kubectl delete -f k8s/

# Or delete namespace (will delete all resources in it)
kubectl delete namespace music-dashboard
```

## 🛑 Stop Minikube

```powershell
# Stop Minikube
minikube stop

# Delete Minikube cluster
minikube delete
```

## 🐛 Troubleshooting

```bash
# Check pod status
kubectl get pods -n music-dashboard

# View pod logs
kubectl logs -n music-dashboard <pod-name>

# Get into a pod
kubectl exec -it -n music-dashboard <pod-name> -- /bin/sh

# Check events
kubectl get events -n music-dashboard --sort-by='.lastTimestamp'

# Check pod details
kubectl describe pod -n music-dashboard <pod-name>
```

## 📝 Notes

- This configuration is optimized for Minikube testing
- The application runs on port 80 inside the container
- NodePort 30080 is used for easy access in Minikube
- Health checks are configured for both liveness and readiness
- Resource limits are set to ensure efficient cluster usage

## 🎯 Quick Start Guide for Minikube

```powershell
# 1. Start Minikube
minikube start

# 2. Deploy the application
kubectl apply -f k8s/

# 3. Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=music-dashboard -n music-dashboard --timeout=120s

# 4. Access the application
minikube service music-dashboard -n music-dashboard

# Or get the URL
minikube service music-dashboard -n music-dashboard --url
```
