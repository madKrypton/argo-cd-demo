# Setup Guide for GitHub Actions CI/CD

## Quick Setup Checklist

- [ ] Create DockerHub Access Token
- [ ] Add GitHub Secrets
- [ ] Verify pipeline configuration
- [ ] Test pipeline run

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

### Step 3: Verify Configuration

Check that your secrets are added:
```
Settings → Secrets and variables → Actions → Repository secrets
```

You should see:
- ✅ `DOCKERHUB_USERNAME`
- ✅ `DOCKERHUB_TOKEN`

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
DOCKERHUB_USERNAME: appukuttan
IMAGE_NAME: mastersong
Starting Tag: v1 (auto-increments to v2, v3, etc.)
```

### If You Need to Change Settings

Edit `.github/workflows/build-deploy.yml`:

```yaml
env:
  DOCKERHUB_USERNAME: appukuttan    # Change to your DockerHub username
  IMAGE_NAME: mastersong            # Change to your image name
```

## 🔍 What Happens When Pipeline Runs

### Stage 1: Build and Push
1. ✅ Checks out code
2. ✅ Finds latest Git tag (e.g., `v1`)
3. ✅ Increments tag to `v2`
4. ✅ Builds Docker image
5. ✅ Pushes to DockerHub as:
   - `appukuttan/mastersong:v2`
   - `appukuttan/mastersong:latest`
6. ✅ Creates Git tag `v2`

### Stage 2: Update Kubernetes
1. ✅ Updates `k8s/deployment.yaml`
2. ✅ Changes image from `v1` to `v2`
3. ✅ Commits change with message: "🚀 Update deployment image to v2"
4. ✅ Pushes to repository

### Stage 3: ArgoCD (Automatic)
1. ✅ ArgoCD detects change in deployment.yaml
2. ✅ Automatically syncs new image
3. ✅ Kubernetes pulls `appukuttan/mastersong:v2`
4. ✅ Pods restart with new image

## 🎯 Verify Everything Works

### 1. Check DockerHub
- Go to: https://hub.docker.com/r/appukuttan/mastersong
- You should see new tag (e.g., `v2`)

### 2. Check Git Tags
```bash
git fetch --tags
git tag -l
# Should show: v1, v2, v3, etc.
```

### 3. Check Deployment File
```bash
cat k8s/deployment.yaml | grep image:
# Should show: image: appukuttan/mastersong:v2
```

### 4. Check ArgoCD
```bash
kubectl get application music-dashboard -n argocd
# STATUS should be: Synced
```

## 🐛 Troubleshooting

### Error: "DockerHub authentication failed"

**Cause:** Invalid DockerHub credentials

**Solution:**
1. Verify your DockerHub token is correct
2. Create a new token if needed
3. Update `DOCKERHUB_TOKEN` secret in GitHub

### Error: "Permission denied (push to repository)"

**Cause:** GitHub Actions doesn't have push permissions

**Solution:**
1. Go to: Settings → Actions → General
2. Scroll to "Workflow permissions"
3. Select: **Read and write permissions**
4. Check: **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### Error: "Tag already exists"

**Cause:** Git tag already created

**Solution:**
```bash
# Delete local and remote tag
git tag -d v2
git push origin :refs/tags/v2

# Or just let pipeline increment to v3
```

### Warning: "No changes to commit"

**Cause:** Image tag in deployment.yaml already up to date

**Solution:** This is normal if the pipeline runs twice with same tag

## 📊 Pipeline Badges

Add to your README to show build status:

```markdown
[![Build and Deploy](https://github.com/madKrypton/argo-cd-demo/actions/workflows/build-deploy.yml/badge.svg)](https://github.com/madKrypton/argo-cd-demo/actions)
```

## 🔐 Security Notes

- ✅ Secrets are encrypted by GitHub
- ✅ Secrets are not visible in logs
- ✅ DockerHub token can be revoked anytime
- ✅ Use minimal permissions for tokens

## 📝 Next Steps

After successful setup:

1. Make changes to your app code
2. Commit and push to main/master
3. Pipeline automatically:
   - Builds new image
   - Increments version
   - Updates deployment
4. ArgoCD automatically deploys new version

## 🆘 Need Help?

- Check pipeline logs in Actions tab
- Review this setup guide
- Verify all secrets are set correctly
- Ensure DockerHub credentials are valid
