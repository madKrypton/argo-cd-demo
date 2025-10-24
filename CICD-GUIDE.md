# Multi-Stage CI/CD Pipeline

This repository implements a **production-grade multi-stage CI/CD pipeline** with DEV and QA environments using GitHub Actions and ArgoCD.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       GitHub Repository                          │
│  ┌─────────────┐                        ┌─────────────┐         │
│  │  dev branch │                        │ main branch │         │
│  └──────┬──────┘                        └──────┬──────┘         │
│         │                                      │                │
└─────────┼──────────────────────────────────────┼────────────────┘
          │                                      │
          ▼                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Actions                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1. Build & Test → 2. Push to DockerHub → 3. Update K8s │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────┬─────────────────────────────────────┬─────────────────┘
          │                                     │
          ▼                                     ▼
┌─────────────────────┐          ┌─────────────────────┐
│   DEV Environment   │          │   QA Environment    │
│                     │          │                     │
│  • Namespace: dev   │          │  • Namespace: qa    │
│  • Replicas: 2      │          │  • Replicas: 3      │
│  • Resources: Low   │          │  • Resources: High  │
│  • Auto-sync: Yes   │          │  • Auto-sync: Yes   │
└─────────────────────┘          └─────────────────────┘
```

## 🌿 Branching Strategy

| Branch | Environment | Purpose | Auto-Deploy |
|--------|-------------|---------|-------------|
| `dev` | DEV | Active development, feature testing | ✅ Yes |
| `main` | QA | Pre-production testing, release candidates | ✅ Yes |
| `production` | PROD | Production releases (future) | 🔒 Manual approval |

## 🚀 Deployment Flow

### Development Environment (DEV)
1. Developer pushes code to `dev` branch
2. GitHub Actions triggers automatically
3. Builds Docker image with tags:
   - `appukuttan/mastersong:v{version}`
   - `appukuttan/mastersong:dev-{short-sha}`
   - `appukuttan/mastersong:dev-latest`
4. Updates `k8s/overlays/dev/kustomization.yaml`
5. ArgoCD auto-syncs to DEV cluster

### QA Environment (QA)
1. Developer merges `dev` → `main` (via Pull Request)
2. GitHub Actions triggers on `main` branch
3. Builds and tags Docker image
4. Creates Git release tag (e.g., `v11`, `v12`)
5. Updates `k8s/overlays/qa/kustomization.yaml`
6. ArgoCD auto-syncs to QA cluster

## 📦 Environment Configuration

### DEV Environment
```yaml
Namespace: music-app-dev
Replicas: 2
Resources:
  Memory: 64Mi - 128Mi
  CPU: 100m - 200m
URL: https://dev.yourdomain.com
```

### QA Environment
```yaml
Namespace: music-app-qa
Replicas: 3
Resources:
  Memory: 128Mi - 256Mi
  CPU: 200m - 500m
URL: https://qa.yourdomain.com
```

## 🛠️ Setup Instructions

### 1. Create GitHub Branches
```bash
# Create dev branch if it doesn't exist
git checkout -b dev
git push origin dev

# Create branch protection rules in GitHub
# Settings → Branches → Add rule
```

### 2. Configure GitHub Secrets
Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:
- `DOCKERHUB_TOKEN` - DockerHub access token
- `MUSICAPP_GITHUB_TOKEN` - GitHub Personal Access Token (PAT)

### 3. Setup GitHub Environments
Go to: Repository → Settings → Environments

Create two environments:
- **dev** (No protection rules)
- **qa** (Optional: Add required reviewers)

### 4. Deploy ArgoCD Applications
```bash
# Apply the ArgoCD project
kubectl apply -f argocd-application/project.yaml

# Deploy DEV application
kubectl apply -f argocd-application/dev-application.yaml

# Deploy QA application
kubectl apply -f argocd-application/qa-application.yaml
```

### 5. Verify ArgoCD Applications
```bash
# Check application status
argocd app list

# View DEV application
argocd app get music-dashboard-dev

# View QA application
argocd app get music-dashboard-qa

# Sync manually (if needed)
argocd app sync music-dashboard-dev
argocd app sync music-dashboard-qa
```

## 🔄 Typical Development Workflow

### Feature Development
```bash
# 1. Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/new-feature

# 2. Make changes to app
vim app/index.html

# 3. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 4. Create Pull Request: feature/new-feature → dev
# 5. After review, merge to dev
# 6. GitHub Actions deploys to DEV automatically
```

### Promoting to QA
```bash
# 1. Create Pull Request: dev → main
# 2. Add QA test checklist in PR description
# 3. After review and approval, merge to main
# 4. GitHub Actions deploys to QA automatically
# 5. QA team tests in QA environment
```

## 📊 Monitoring Deployments

### GitHub Actions
- View workflow runs: Repository → Actions
- Check deployment status in job summary
- Review build logs and artifacts

### ArgoCD Dashboard
```bash
# Port-forward ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Login
argocd login localhost:8080

# Access: https://localhost:8080
```

### Kubernetes
```bash
# Check DEV pods
kubectl get pods -n music-app-dev

# Check QA pods
kubectl get pods -n music-app-qa

# View logs
kubectl logs -f deployment/dev-music-dashboard -n music-app-dev
kubectl logs -f deployment/qa-music-dashboard -n music-app-qa
```

## 🏷️ Docker Image Tagging Strategy

Each build creates multiple tags:

| Tag Pattern | Example | Purpose |
|-------------|---------|---------|
| `v{version}` | `v11` | Semantic versioning |
| `{branch}-{sha}` | `dev-a1b2c3d` | Specific commit tracking |
| `{branch}-latest` | `dev-latest` | Latest on branch |
| `latest` | `latest` | Latest production (main only) |

## 🔐 Security Best Practices

- ✅ Branch protection on `main` and `dev`
- ✅ Required PR reviews before merge
- ✅ Secrets stored in GitHub Secrets
- ✅ Least privilege RBAC in Kubernetes
- ✅ Image scanning (add in future)
- ✅ Security scanning (add in future)

## 📈 Next Steps / Future Enhancements

- [ ] Add production environment with manual approval
- [ ] Implement automated testing (unit, integration, e2e)
- [ ] Add Slack/Teams notifications
- [ ] Implement rollback mechanism
- [ ] Add performance testing gates
- [ ] Container image security scanning
- [ ] Add smoke tests after deployment
- [ ] Implement canary deployments
- [ ] Add monitoring with Prometheus/Grafana
- [ ] Implement feature flags

## 🆘 Troubleshooting

### Deployment Not Triggering
- Check if branch name matches workflow trigger
- Verify file paths are in the trigger paths
- Check GitHub Actions logs

### ArgoCD Not Syncing
```bash
# Check application health
argocd app get music-dashboard-dev

# Force sync
argocd app sync music-dashboard-dev --force

# Check for sync errors
kubectl describe application music-dashboard-dev -n argocd
```

### Image Pull Errors
- Verify DockerHub credentials
- Check image tag exists: https://hub.docker.com/r/appukuttan/mastersong/tags
- Verify Kubernetes can reach DockerHub

## 📚 Documentation

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Kustomize Documentation](https://kustomize.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)

## 👥 Team

- **Owner**: Platform Engineering Team
- **Maintainers**: DevOps Team
- **Contact**: devops@yourdomain.com
