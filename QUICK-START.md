# Quick Start: Multi-Stage CI/CD

## 🚀 Get Started in 5 Minutes

### Step 1: Create Dev Branch
```bash
cd c:\Projects\My_project\my-muisc-app\argo-cd-demo
git checkout -b dev
git push origin dev
```

### Step 2: Add GitHub Secrets
1. Go to: https://github.com/madKrypton/argo-cd-demo/settings/secrets/actions
2. Add `DOCKERHUB_TOKEN` (from DockerHub)
3. Verify `MUSICAPP_GITHUB_TOKEN` exists

### Step 3: Create GitHub Environments
1. Go to: https://github.com/madKrypton/argo-cd-demo/settings/environments
2. Click "New environment"
3. Create `dev` (no protection rules)
4. Create `qa` (optional: add reviewers)

### Step 4: Deploy to Kubernetes
```bash
# Deploy ArgoCD applications
kubectl apply -f argocd-application/dev-application.yaml
kubectl apply -f argocd-application/qa-application.yaml

# Verify
argocd app list
```

### Step 5: Test the Pipeline
```bash
# Make a change in dev branch
git checkout dev
echo "// Test change" >> app/script.js
git add .
git commit -m "test: trigger dev pipeline"
git push origin dev

# Watch the deployment
# Go to: https://github.com/madKrypton/argo-cd-demo/actions
```

## 🎯 Workflow Summary

### DEV Pipeline (dev branch)
```
Push to dev → Build → Test → Deploy to DEV → ArgoCD Sync
```

### QA Pipeline (main branch)
```
Merge to main → Build → Tag → Deploy to QA → ArgoCD Sync
```

## 📋 Pre-Deployment Checklist

- [ ] `dev` branch created
- [ ] `DOCKERHUB_TOKEN` secret added
- [ ] `MUSICAPP_GITHUB_TOKEN` secret added
- [ ] GitHub environments created (dev, qa)
- [ ] ArgoCD applications deployed
- [ ] Kustomize overlays configured

## 🔍 Verify Setup

```bash
# Check branches
git branch -a

# Check secrets (should not show values)
# Go to: Repository → Settings → Secrets

# Check ArgoCD apps
argocd app list | grep music-dashboard

# Check namespaces
kubectl get ns | grep music-app
```

## 🎉 Success Indicators

✅ GitHub Actions workflow completes successfully  
✅ Docker image pushed to DockerHub  
✅ Git tag created (for main branch)  
✅ Kubernetes manifest updated  
✅ ArgoCD shows "Synced" and "Healthy"  
✅ Pods running in target namespace  

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Workflow not triggering | Check branch name and file paths |
| Docker push fails | Verify DOCKERHUB_TOKEN |
| Git push fails | Verify MUSICAPP_GITHUB_TOKEN has `repo` scope |
| ArgoCD not syncing | Check repo URL and target branch |
| Pods not starting | Check image tag and pull policy |

## 📞 Need Help?

- Check workflow logs: Repository → Actions
- View ArgoCD status: `argocd app get <app-name>`
- Check pod logs: `kubectl logs -f <pod-name> -n <namespace>`
- Review: [CICD-GUIDE.md](./CICD-GUIDE.md) for detailed documentation
