# ArgoCD Application Configuration

This folder contains ArgoCD application manifests for deploying the Music Dashboard application using GitOps.

## 📦 Repository Information

- **Repository:** https://github.com/madKrypton/argo-cd-demo (Public Repository)
- **Path:** k8s
- **Author:** Akash### Repository Connection Issues

```powershell
# Test repository connection
argocd repo list

# For public repos, ArgoCD should connect automatically without credentials
```lication:** Music Dashboard v1.0.0
- **Authentication:** ✅ Not required (public repository)

## 📁 Files

- `application.yaml` - ArgoCD Application definition
- `project.yaml` - ArgoCD AppProject definition (optional)tion Configuration

This folder contains ArgoCD application manifests for deploying the Music Dashboard application using GitOps.

## 📦 Repository Information

- **Repository:** https://dev.azure.com/AkashHaridasan/My-work-at-HRB/_git/argocd-demo-app
- **Path:** k8s
- **Author:** Akash
- **Application:** Music Dashboard v1.0.0

## 📁 Files

- `application.yaml` - ArgoCD Application definition
- `project.yaml` - ArgoCD AppProject definition (optional)
- `repository-secret.yaml` - Repository credentials template for Azure DevOps
- `AUTHENTICATION.md` - Detailed authentication setup guide
- `create-secret.ps1` - PowerShell script to create secret
- `create-secret.sh` - Bash script to create secret

## 🚀 Prerequisites

### 1. Install ArgoCD on Minikube

```powershell
# Create ArgoCD namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

### 2. Access ArgoCD UI

```powershell
# Port forward to ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access UI at: https://localhost:8080
```

### 3. Get Initial Admin Password

```powershell
# Get the initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | ForEach-Object { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }

# Username: admin
# Password: (output from above command)
```

### 4. Install ArgoCD CLI (Optional)

```powershell
# Download ArgoCD CLI from GitHub releases
# https://github.com/argoproj/argo-cd/releases/latest

# Or using Chocolatey
choco install argocd-cli

# Login via CLI
argocd login localhost:8080
```

## 🔐 Setup Azure DevOps Repository Access (REQUIRED for Private Repo)

⚠️ **This is a PRIVATE repository - authentication is mandatory!**

### Step-by-Step: Create Personal Access Token (PAT)

1. **Go to Azure DevOps:**
   - Visit: https://dev.azure.com/AkashHaridasan
   - Click **User Settings** (profile icon) → **Personal Access Tokens**

2. **Create New Token:**
   - Click **+ New Token**
   - Name: `ArgoCD Music Dashboard`
   - Organization: `AkashHaridasan`
   - Scopes: **Custom defined** → ✅ **Code (Read)**
   - Click **Create**

3. **Copy the Token:**
   - ⚠️ **IMPORTANT:** Copy immediately - you can't see it again!

### Apply Authentication

#### Method 1: Using YAML file (Recommended)

```powershell
# 1. Edit repository-secret.yaml
# Replace <YOUR_PERSONAL_ACCESS_TOKEN_HERE> with your actual PAT

# 2. Apply the secret
kubectl apply -f argocd-application/repository-secret.yaml

# 3. Verify
kubectl get secret azure-devops-repo -n argocd
```

#### Method 2: Using PowerShell Script

```powershell
# Edit create-secret.ps1 with your PAT, then run:
.\argocd-application\create-secret.ps1
```

#### Method 3: Direct kubectl command

```powershell
kubectl create secret generic azure-devops-repo `
  --namespace=argocd `
  --from-literal=type=git `
  --from-literal=url=https://dev.azure.com/AkashHaridasan/My-work-at-HRB/_git/argocd-demo-app `
  --from-literal=username=azuredevops `
  --from-literal=password=<YOUR_PAT_HERE>

kubectl label secret azure-devops-repo -n argocd argocd.argoproj.io/secret-type=repository
```

📖 **For detailed authentication guide, see [AUTHENTICATION.md](AUTHENTICATION.md)**

### Option 2: Using ArgoCD UI

1. Login to ArgoCD UI
2. Go to Settings → Repositories
3. Click "Connect Repo"
4. Select "Via HTTPS"
5. Fill in:
   - Repository URL: `https://dev.azure.com/AkashHaridasan/My-work-at-HRB/_git/argocd-demo-app`
   - Username: Your Azure DevOps username
   - Password: Personal Access Token

### Option 3: Using ArgoCD CLI

```powershell
argocd repo add https://dev.azure.com/AkashHaridasan/My-work-at-HRB/_git/argocd-demo-app `
  --username akash `
  --password <YOUR_PAT>
```

## 📦 Deploy Application

### Using kubectl

```powershell
# Option 1: Deploy with default project
kubectl apply -f argocd-application/application.yaml

# Option 2: Deploy with custom project (recommended)
kubectl apply -f argocd-application/project.yaml
kubectl apply -f argocd-application/application.yaml
```

### Using ArgoCD CLI

```powershell
# Create the application
argocd app create music-dashboard `
  --repo https://github.com/madKrypton/argo-cd-demo `
  --path k8s `
  --dest-server https://kubernetes.default.svc `
  --dest-namespace music-dashboard `
  --sync-policy automated `
  --auto-prune `
  --self-heal
```

### Using ArgoCD UI

1. Login to ArgoCD UI
2. Click "New App"
3. Fill in:
   - **Application Name:** music-dashboard
   - **Project:** default
   - **Sync Policy:** Automatic
   - **Repository URL:** https://github.com/madKrypton/argo-cd-demo
   - **Revision:** HEAD
   - **Path:** k8s
   - **Cluster URL:** https://kubernetes.default.svc
   - **Namespace:** music-dashboard
4. Click "Create"

**Note:** No credentials needed - this is a public repository!

## 🔍 Monitor Application

### Using ArgoCD UI

```powershell
# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Open browser: https://localhost:8080
```

### Using ArgoCD CLI

```powershell
# List applications
argocd app list

# Get application details
argocd app get music-dashboard

# Watch application sync status
argocd app wait music-dashboard --health

# View application logs
argocd app logs music-dashboard
```

### Using kubectl

```powershell
# Check ArgoCD application status
kubectl get application -n argocd

# Describe application
kubectl describe application music-dashboard -n argocd

# Check deployed resources
kubectl get all -n music-dashboard
```

## 🔄 Sync Application

### Manual Sync

```powershell
# Using ArgoCD CLI
argocd app sync music-dashboard

# Using kubectl
kubectl patch application music-dashboard -n argocd --type merge -p '{"operation":{"initiatedBy":{"username":"admin"},"sync":{"revision":"HEAD"}}}'
```

### Automatic Sync

The application is configured with automated sync policy:
- **Auto-Prune:** Removes resources deleted from Git
- **Self-Heal:** Reverts manual changes to match Git state
- **Retry:** Automatically retries failed syncs

## 🎯 Access the Application

After ArgoCD deploys the application:

```powershell
# Get Minikube IP
minikube ip

# Access via NodePort
# http://<MINIKUBE-IP>:30080

# Or use minikube service
minikube service music-dashboard -n music-dashboard
```

## 🔧 Sync Policies

The application uses these sync policies:

- **Automated Sync:** Changes in Git automatically deploy
- **Prune:** Resources deleted from Git are removed from cluster
- **Self-Heal:** Manual cluster changes are reverted to Git state
- **CreateNamespace:** Automatically creates the target namespace
- **Retry:** Up to 5 retries with exponential backoff

## 🐛 Troubleshooting

### Check ArgoCD Application Status

```powershell
# View application
kubectl get application music-dashboard -n argocd

# Check events
kubectl get events -n argocd --sort-by='.lastTimestamp'

# View ArgoCD server logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server
```

### Repository Connection Issues

```powershell
# Test repository connection
argocd repo list

# Check repository secret
kubectl get secret azure-devops-repo -n argocd -o yaml
```

### Sync Issues

```powershell
# Force refresh
argocd app get music-dashboard --refresh

# Hard refresh (ignore cache)
argocd app get music-dashboard --hard-refresh

# Delete and recreate
kubectl delete application music-dashboard -n argocd
kubectl apply -f argocd-application/application.yaml
```

## 🗑️ Cleanup

### Delete Application

```powershell
# Using ArgoCD CLI
argocd app delete music-dashboard

# Using kubectl
kubectl delete application music-dashboard -n argocd

# Delete the namespace (will remove all resources)
kubectl delete namespace music-dashboard
```

### Uninstall ArgoCD

```powershell
# Delete ArgoCD
kubectl delete -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Delete namespace
kubectl delete namespace argocd
```

## 📝 Notes

- This is a **public GitHub repository** - no authentication required
- ArgoCD will monitor the `k8s/` folder in your repository
- Any changes pushed to the repository will automatically sync
- The application uses the `HEAD` revision (latest commit)
- Self-healing will revert any manual changes to the cluster

## 🔗 Useful Links

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [ArgoCD Getting Started](https://argo-cd.readthedocs.io/en/stable/getting_started/)
- [GitHub Repository](https://github.com/madKrypton/argo-cd-demo)
