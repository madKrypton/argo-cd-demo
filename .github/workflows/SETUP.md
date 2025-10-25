# Setup Guide for GitHub Actions CI/CD with ArgoCD and Kustomize

## 🚀 Quick Setup Checklist

- [ ] Create DockerHub Access Token
- [ ] Configure GitHub Repository Secrets
- [ ] Set Up ArgoCD Applications
- [ ] Verify Pipeline Configuration
- [ ] Test Initial Deployment
- [ ] Validate Multi-Environment Setup

## 📝 Step-by-Step Setup

### Step 1: Create DockerHub Access Token

1. **Login to DockerHub**
   - Go to: https://hub.docker.com/
   - Sign in with your credentials

2. **Generate Access Token**
   - Click your profile icon (top right)
   - Click **Account Settings**
   - Click **Security** in the left sidebar
   - Click **New Access Token**

3. **Configure Token**
   - **Access Token Description:** `GitHub Actions - Music Dashboard`
   - **Access permissions:** Read, Write, Delete
   - Click **Generate**

4. **Copy Token**
   - ⚠️ **IMPORTANT:** Copy the token immediately!
   - Format: `dckr_pat_abc123...`
   - You won't be able to see it again

### Step 2: Add GitHub Secrets

1. **Go to Repository Settings**
   ```
   Your GitHub Repo → Settings → Secrets and variables → Actions
   ```

2. **Click "New repository secret"**

3. **Add First Secret**
   - **Name:** `DOCKERHUB_USERNAME`
   - **Secret:** `appukuttan`
   - Click **Add secret**

4. **Add Second Secret**
   - **Name:** `DOCKERHUB_TOKEN`
   - **Secret:** Paste your DockerHub access token
   - Click **Add secret**

### Step 3: ArgoCD Application Setup

1. **Deploy ArgoCD Applications**
   ```bash
   # Deploy project
   kubectl apply -f argocd-application/project.yaml
   
   # Deploy dev environment
   kubectl apply -f argocd-application/dev-application.yaml
   
   # Deploy qa environment
   kubectl apply -f argocd-application/qa-application.yaml
   ```

2. **Verify Applications**
   ```bash
   # Check ArgoCD applications
   kubectl get applications -n argocd
   
   # Should see:
   # music-dashboard-dev   Synced   Healthy
   # music-dashboard-qa    Synced   Healthy
   ```

### Step 4: Verify Configuration

1. **Check GitHub Secrets**
   ```
   Settings → Secrets and variables → Actions → Repository secrets
   ```
   Should see:
   - ✅ `DOCKERHUB_USERNAME`
   - ✅ `DOCKERHUB_TOKEN`

2. **Verify Kustomize Structure**
   ```bash
   # Check base resources
   ls -la k8s/base/
   
   # Check environment overlays
   ls -la k8s/overlays/dev/
   ls -la k8s/overlays/qa/
   ```

### Step 4: Test the Pipeline

#### Option 1: Trigger by Push
```bash
# Make a change to any file in app/ folder
# Commit and push to main/master branch
git add .
git commit -m "Test pipeline"
git push origin main
```

#### Option 2: Manual Trigger
1. Go to **Actions** tab in GitHub
2. Click **Build and Deploy Music Dashboard**
3. Click **Run workflow** (right side)
4. Select branch: `main` or `master`
5. Click **Run workflow**

### Step 5: Monitor Pipeline

1. Go to **Actions** tab
2. Click on the running workflow
3. Watch the progress:
   - ✅ Build and Push job
   - ✅ Update K8s Manifest job

## ⚙️ Pipeline Configuration

### Current Settings

```yaml
env:
  DOCKERHUB_USERNAME: appukuttan
  IMAGE_NAME: mastersong
  IMAGE_TAG: main-${{ github.run_number }}  # Automatically increments with each run
```

### Environment-Specific Settings

#### Development Environment
```yaml
# k8s/overlays/dev/kustomization.yaml
namePrefix: dev-
namespace: music-app-dev
replicas:
  - name: music-dashboard
    count: 2
resources:
  - ../../base
```

#### QA Environment
```yaml
# k8s/overlays/qa/kustomization.yaml
namePrefix: qa-
namespace: music-app-qa
replicas:
  - name: music-dashboard
    count: 3
resources:
  - ../../base
```

## 🔍 CI/CD Pipeline Workflow

### Stage 1: Build and Push
1. ✅ Checks out code
2. ✅ Sets up Docker Buildx
3. ✅ Logs in to DockerHub
4. ✅ Builds Docker image with tag `main-${run_number}`
5. ✅ Pushes to DockerHub:
   - `appukuttan/mastersong:main-${run_number}`
   - `appukuttan/mastersong:latest`

### Stage 2: Update Kustomize Overlays
1. ✅ Updates image tag in dev overlay:
   ```yaml
   # k8s/overlays/dev/kustomization.yaml
   images:
     - name: appukuttan/mastersong
       newTag: main-${run_number}
   ```
2. ✅ Updates image tag in qa overlay
3. ✅ Commits changes with message: "🚀 Update image to main-${run_number}"
4. ✅ Pushes to repository

### Stage 3: ArgoCD Sync (Automatic)
1. ✅ ArgoCD detects changes in overlays
2. ✅ Syncs dev environment:
   - Updates image tag
   - Maintains dev-specific configurations
3. ✅ Syncs qa environment:
   - Updates image tag
   - Maintains qa-specific configurations
4. ✅ Pods roll out with new image in both environments

## 🎯 Verification Steps

### 1. Check DockerHub Images
```bash
# Check latest image
docker pull appukuttan/mastersong:latest

# Check specific run version
docker pull appukuttan/mastersong:main-${run_number}
```

### 2. Verify Kustomize Overlays
```bash
# Preview dev manifests
kubectl kustomize k8s/overlays/dev

# Preview qa manifests
kubectl kustomize k8s/overlays/qa
```

### 3. Check ArgoCD Applications
```bash
# Check dev environment
kubectl get application music-dashboard-dev -n argocd
kubectl get pods -n music-app-dev

# Check qa environment
kubectl get application music-dashboard-qa -n argocd
kubectl get pods -n music-app-qa
```

### 4. Monitor Deployments
```bash
# Watch dev pods
kubectl get pods -n music-app-dev -w

# Watch qa pods
kubectl get pods -n music-app-qa -w
```

## 🐛 Troubleshooting Guide

### 1. Pipeline Issues

#### DockerHub Authentication Failed
```bash
# Verify DockerHub login
docker login -u $DOCKERHUB_USERNAME
```
- Check GitHub secret values
- Regenerate DockerHub token if needed
- Update `DOCKERHUB_TOKEN` in GitHub secrets

#### GitHub Actions Permission Error
1. Go to Repository Settings → Actions → General
2. Enable "Read and write permissions"
3. Allow GitHub Actions to create PRs

### Error: "Permission denied (push to repository)"

**Cause:** GitHub Actions doesn't have push permissions

**Solution:**
1. Go to: Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select: **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 2. ArgoCD Sync Issues

#### Application Not Syncing
```bash
# Check app status
argocd app get music-dashboard-dev

# Check sync errors
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller

# Force sync if needed
argocd app sync music-dashboard-dev
```

#### Kustomize Build Errors
```bash
# Test kustomize locally
kubectl kustomize k8s/overlays/dev
kubectl kustomize k8s/overlays/qa

# Check kustomization.yaml syntax
```

### Warning: "No changes to commit"

**Cause:** Image tag in deployment.yaml already up to date

**Solution:** This is normal if the pipeline runs twice with same tag

## 📊 Monitoring and Status

### Pipeline Status Badge
```markdown
[![Build and Deploy](https://github.com/madKrypton/argo-cd-demo/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/madKrypton/argo-cd-demo/actions)
```

### Real-time Monitoring
```bash
# Watch pipeline runs
open https://github.com/madKrypton/argo-cd-demo/actions

# Monitor ArgoCD sync status
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Then open: https://localhost:8080

# Watch deployments
kubectl get pods -n music-app-dev -w
kubectl get pods -n music-app-qa -w
```

## 🔐 Security Best Practices

- ✅ Use encrypted GitHub secrets
- ✅ Rotate DockerHub tokens regularly
- ✅ Implement least privilege access
- ✅ Monitor ArgoCD audit logs
- ✅ Use separate namespaces for environments

## 📝 Development Workflow

1. **Make Code Changes**
   ```bash
   # Edit application code
   cd app/
   # Make your changes
   ```

2. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin main
   ```

3. **Automatic Pipeline Flow**
   - GitHub Actions builds new image
   - Updates Kustomize overlays
   - ArgoCD detects changes
   - Syncs both environments
   - Rolls out new version

4. **Monitor Deployment**
   ```bash
   # Check build status
   open https://github.com/madKrypton/argo-cd-demo/actions

   # Monitor ArgoCD sync
   kubectl get applications -n argocd -w

   # Watch pods update
   kubectl get pods -n music-app-dev -w
   ```

## 🆘 Support and Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Kustomize Documentation](https://kubectl.docs.kubernetes.io/guides/introduction/kustomize/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- Pipeline logs in GitHub Actions tab
- ArgoCD UI for detailed sync status
