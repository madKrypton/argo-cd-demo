# GitHub Actions CI/CD Pipeline

This pipeline automates the build, versioning, and deployment process for the Music Dashboard application.

## 🚀 Pipeline Overview

The pipeline consists of two main jobs:

1. **Build and Push** - Builds Docker image and pushes to DockerHub
2. **Update K8s Manifest** - Updates Kubernetes deployment with new image tag

## 📋 Pipeline Workflow

```
┌─────────────────────────────────────────────────────────┐
│  Trigger: Push to main/master (app/** or Dockerfile)   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Job 1: Build and Push                                  │
│  ├─ Checkout code                                       │
│  ├─ Get latest tag (e.g., v1)                          │
│  ├─ Increment tag (v1 → v2)                            │
│  ├─ Build Docker image                                  │
│  ├─ Push to DockerHub (appukuttan/mastersong:v2)      │
│  └─ Create Git tag (v2)                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  Job 2: Update K8s Manifest                            │
│  ├─ Checkout code                                       │
│  ├─ Update k8s/deployment.yaml                         │
│  │  (image: appukuttan/mastersong:v2)                 │
│  ├─ Commit changes                                      │
│  └─ Push to repository                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  ArgoCD detects change and syncs new image             │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Setup Instructions

### 1. Create DockerHub Access Token

1. Go to [DockerHub](https://hub.docker.com/)
2. Click your profile → **Account Settings** → **Security**
3. Click **New Access Token**
4. Name: `GitHub Actions Music Dashboard`
5. Permissions: **Read, Write, Delete**
6. Copy the token

### 2. Add GitHub Secrets

Go to your GitHub repository:
```
Settings → Secrets and variables → Actions → New repository secret
```

Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `DOCKERHUB_USERNAME` | `appukuttan` | Your DockerHub username |
| `DOCKERHUB_TOKEN` | `dckr_pat_...` | Your DockerHub access token |

### 3. Update Pipeline Configuration (if needed)

Edit `.github/workflows/build-deploy.yml`:

```yaml
env:
  DOCKERHUB_USERNAME: appukuttan    # Change if different
  IMAGE_NAME: mastersong            # Change if different
```

## 🎯 Automatic Versioning

### How It Works

- Pipeline fetches all Git tags matching `v*` pattern
- Finds the latest version (e.g., `v1`, `v5`, `v23`)
- Increments by 1 (e.g., `v1` → `v2`)
- Tags the commit with new version
- Builds and pushes Docker image with new tag

### Version Examples

| Current Tags | Latest Tag | New Tag |
|--------------|------------|---------|
| (none) | - | v1 |
| v1 | v1 | v2 |
| v1, v2, v3 | v3 | v4 |
| v1, v10, v100 | v100 | v101 |

## 📦 Docker Images

Images are pushed to DockerHub with two tags:

- **Versioned tag:** `appukuttan/mastersong:v2`
- **Latest tag:** `appukuttan/mastersong:latest`

### Image Naming

```
docker.io/appukuttan/mastersong:v2
    ↓         ↓          ↓       ↓
registry  username  image-name tag
```

## 🔄 Kubernetes Update Process

### What Gets Updated

File: `k8s/deployment.yaml`

Before:
```yaml
containers:
- name: music-dashboard
  image: appukuttan/mastersong:v1
```

After:
```yaml
containers:
- name: music-dashboard
  image: appukuttan/mastersong:v2
```

### Commit Message

Automated commit message format:
```
🚀 Update deployment image to v2
```

## 🎬 Pipeline Triggers

The pipeline runs on:

1. **Push to main/master branch** when these files change:
   - Any file in `app/` folder
   - `Dockerfile`
   - Pipeline file itself

2. **Manual trigger** via GitHub Actions UI (workflow_dispatch)

## 📊 Pipeline Output

After successful run, you'll see:

- ✅ Docker image built and pushed
- ✅ Git tag created (e.g., `v2`)
- ✅ Deployment manifest updated
- ✅ Changes committed and pushed

### GitHub Summary

Each run creates a summary:
```
🎉 Deployment Summary

- New Docker Image: appukuttan/mastersong:v2
- DockerHub Link: https://hub.docker.com/r/appukuttan/mastersong
- Deployment Updated: k8s/deployment.yaml
- Git Tag Created: v2

ArgoCD will automatically sync the new image! 🔄
```

## 🔍 Monitoring Pipeline

### View Pipeline Runs

1. Go to your GitHub repository
2. Click **Actions** tab
3. See all pipeline runs

### Check Build Status

[![Build Status](https://github.com/madKrypton/argo-cd-demo/workflows/Build%20and%20Deploy%20Music%20Dashboard/badge.svg)](https://github.com/madKrypton/argo-cd-demo/actions)

### View Logs

Click on any pipeline run to see detailed logs for each step.

## 🐛 Troubleshooting

### Issue: Authentication Failed to DockerHub

**Solution:** 
- Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets are set correctly
- Ensure token has Read/Write permissions

### Issue: Git Push Failed

**Solution:**
- GitHub Actions automatically uses `GITHUB_TOKEN`
- Ensure repository permissions allow Actions to push

### Issue: Tag Already Exists

**Solution:**
- Delete the existing tag or manually increment
- Pipeline will continue from the latest tag

### Issue: Image Not Updating in Kubernetes

**Solution:**
- Check if ArgoCD is watching the repository
- Verify ArgoCD sync policy is set to automated
- Manually sync in ArgoCD UI if needed

## 🔐 Security Best Practices

1. ✅ Use GitHub Secrets for sensitive data
2. ✅ DockerHub token has minimal required permissions
3. ✅ Pipeline only triggers on specific file changes
4. ✅ Automated commits use GitHub Actions bot account

## 🚀 Manual Trigger

To manually run the pipeline:

1. Go to **Actions** tab
2. Select **Build and Deploy Music Dashboard**
3. Click **Run workflow**
4. Select branch (usually `main` or `master`)
5. Click **Run workflow**

## 📝 Customization

### Change Image Name

Edit pipeline file:
```yaml
env:
  IMAGE_NAME: your-image-name
```

### Change Versioning Pattern

Modify the `increment_tag` step to use different patterns:
- Semantic versioning: `v1.0.0` → `v1.0.1`
- Date-based: `v2024.10.24`
- Build number: `build-123`

### Add Additional Steps

You can add steps like:
- Run tests before building
- Scan image for vulnerabilities
- Send notifications (Slack, Discord)
- Deploy to staging environment first

## 🎯 Next Steps

1. ✅ Set up GitHub Secrets
2. ✅ Push code to trigger pipeline
3. ✅ Monitor pipeline execution
4. ✅ Verify image on DockerHub
5. ✅ Check ArgoCD syncs the new image

## 🔗 Related Files

- Pipeline: `.github/workflows/build-deploy.yml`
- Dockerfile: `Dockerfile`
- K8s Deployment: `k8s/deployment.yaml`
- ArgoCD App: `argocd-application/application.yaml`
