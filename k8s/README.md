# Kubernetes Deployment for Music Dashboard

This folder contains Kubernetes manifests for deploying the Music Dashboard application on Minikube.

## 📦 Image Information

- **Docker Image:** `appukuttan/mastersong:v1`
- **Application Version:** v1.0.0
- **Author:** Akash

## 📁 Files

- `namespace.yaml` - Creates a dedicated namespace for the application
- `deployment.yaml` - Deployment configuration with 3 replicas
- `service.yaml` - NodePort service exposing the application
- `ingress.yaml` - Ingress configuration for external access
- `configmap.yaml` - Configuration data for the application

## 🚀 Minikube Setup

### Start Minikube

```powershell
# Start Minikube
minikube start

# Enable ingress addon (optional)
minikube addons enable ingress

# Verify cluster is running
kubectl cluster-info
```

## � Deployment Instructions

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

To update to a new version:

```bash
# Update image tag
kubectl set image deployment/music-dashboard -n music-dashboard music-dashboard=appukuttan/mastersong:v2

# Or edit the deployment
kubectl edit deployment music-dashboard -n music-dashboard

# Check rollout status
kubectl rollout status deployment/music-dashboard -n music-dashboard

# View rollout history
kubectl rollout history deployment/music-dashboard -n music-dashboard

# Rollback if needed
kubectl rollout undo deployment/music-dashboard -n music-dashboard
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
