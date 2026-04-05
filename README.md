# 🎵 Music Dashboard

A beautiful web-based music dashboard served with nginx in a Docker container, deployed via GitOps using ArgoCD and Kubernetes.

## Features

- 🎵 Audio player for MP3 files
- 🎬 Video player support
- 📀 Interactive playlist
- 📊 Media statistics
- 🎨 Modern, responsive design
- 🚀 Lightweight nginx server
- 🐳 Docker containerized
- ☸️ Kubernetes multi-environment (DEV/QA)
- 🔄 GitOps with ArgoCD auto-sync

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and run the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Using Docker CLI

```bash
# Build the Docker image
docker build -t music-dashboard .

# Run the container
docker run -d -p 8080:80 --name music-dashboard music-dashboard

# View logs
docker logs -f music-dashboard

# Stop the container
docker stop music-dashboard

# Remove the container
docker rm music-dashboard
```

## Access the Dashboard

Once the container is running, open your browser and navigate to:

```
http://localhost:8080
```

## Project Structure

```
argo-cd-demo/
├── .github/                        # GitHub Actions CI/CD
│   └── workflows/
│       ├── build-deploy.yml        # Main multi-stage pipeline
│       ├── README.md               # Pipeline documentation
│       └── SETUP.md                # Setup instructions
├── app/                            # Application source
│   ├── index.html                  # Main HTML file
│   ├── styles.css                  # Styling
│   ├── script.js                   # JavaScript functionality
│   ├── nginx.conf                  # Nginx configuration
│   └── media/                      # Media assets
│       ├── bgimage.jpg             # Background image
│       ├── song1-album-image.png   # Album art for Song 1
│       ├── song2-album-image.png   # Album art for Song 2
│       ├── song1.mp3               # Bad Boys Good Sons
│       ├── song2.mp3               # Eye For an Eye
│       └── video.mp4               # Background video
├── k8s/                            # Kubernetes manifests (Kustomize)
│   ├── base/                       # Base configuration
│   │   ├── namespace.yaml
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   └── kustomization.yaml
│   ├── overlays/                   # Environment-specific overrides
│   │   ├── dev/                    # DEV: 5 replicas, lower resources
│   │   │   └── kustomization.yaml
│   │   └── qa/                     # QA: 3 replicas, higher resources
│   │       └── kustomization.yaml
│   ├── ingress.yaml                # Ingress configuration
│   └── README.md                   # K8s deployment guide
├── argocd-application/             # ArgoCD GitOps configuration
│   ├── application.yaml            # Single ArgoCD Application (default project)
│   ├── dev-application.yaml        # ArgoCD Application for DEV
│   ├── qa-application.yaml         # ArgoCD Application for QA
│   ├── project.yaml                # ArgoCD AppProject (RBAC & resource whitelist)
│   └── README.md                   # ArgoCD setup guide
├── _old-worflow/                   # Archived workflow (reference only)
├── Dockerfile                      # Docker build instructions
├── docker-compose.yml              # Docker Compose for local dev
├── .dockerignore                   # Docker ignore file
├── CICD-GUIDE.md                   # Detailed CI/CD documentation
├── QUICK-START.md                  # 5-minute setup guide
└── README.md                       # This file
```

## Docker Commands Cheatsheet

```bash
# Build image
docker build -t music-dashboard .

# Run container
docker run -d -p 8080:80 --name music-dashboard music-dashboard

# Stop container
docker stop music-dashboard

# Start container
docker start music-dashboard

# Remove container
docker rm music-dashboard

# Remove image
docker rmi music-dashboard

# View logs
docker logs music-dashboard

# Execute commands in container
docker exec -it music-dashboard sh
```

## 🚢 Kubernetes Deployment (Minikube)

The application uses **Kustomize** with a base + environment overlays structure.

### Quick Start with Minikube

```bash
# Start Minikube
minikube start

# Deploy to DEV environment
kubectl apply -k k8s/overlays/dev/

# Deploy to QA environment
kubectl apply -k k8s/overlays/qa/

# Access the application
minikube service dev-music-dashboard -n music-app-dev
```

### Environments

| Environment | Namespace      | Replicas | CPU Limits | Memory Limits |
|-------------|----------------|----------|------------|---------------|
| DEV         | `music-app-dev` | 5        | 200m       | 128Mi         |
| QA          | `music-app-qa`  | 3        | 500m       | 256Mi         |

### Docker Image

- **Image:** `appukuttan/mastersong:{branch}-{run_number}` (e.g. `main-19`)
- **Registry:** Docker Hub
- **Author:** Akash
- **Service Type:** NodePort (30080)

For detailed Minikube deployment instructions, see [k8s/README.md](k8s/README.md)

## 🔄 GitOps with ArgoCD

Deploy the application using ArgoCD for automated GitOps workflow.

### Repository

- **Git Repository:** https://github.com/madKrypton/argo-cd-demo (Public)
- **DEV Path:** `k8s/overlays/dev`
- **QA Path:** `k8s/overlays/qa`
- **Authentication:** Not required (public repository)

### Quick Start with ArgoCD

```bash
# 1. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Create the AppProject
kubectl apply -f argocd-application/project.yaml

# 3. Deploy DEV application
kubectl apply -f argocd-application/dev-application.yaml

# 4. Deploy QA application
kubectl apply -f argocd-application/qa-application.yaml

# 5. Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Open: https://localhost:8080
```

### ArgoCD Applications

| App Name               | Namespace       | Source Path        | Project                  |
|------------------------|-----------------|--------------------|--------------------------|
| `music-dashboard`      | `music-dashboard` | `k8s/`           | `default`                |
| `music-dashboard-dev`  | `music-app-dev` | `k8s/overlays/dev` | `music-dashboard-project` |
| `music-dashboard-qa`   | `music-app-qa`  | `k8s/overlays/qa`  | `music-app`               |

### Sync Features

- **Automated Sync:** Changes in Git automatically deploy within ~3 minutes
- **Self-Healing:** Reverts manual cluster changes
- **Auto-Prune:** Removes resources deleted from Git
- **Retry Logic:** Automatic retries (up to 5) with exponential backoff (5s → 3m)
- **Namespace Creation:** Auto-creates target namespaces

For detailed ArgoCD setup instructions, see [argocd-application/README.md](argocd-application/README.md)

## 🔄 CI/CD Pipeline (GitHub Actions)

Automated multi-stage build and deployment pipeline.

### Pipeline Stages

```
Push to Git
  → [Build]       Build & push Docker image to DockerHub
  → [Deploy-DEV]  Update k8s/overlays/dev/kustomization.yaml, commit to Git
  → [Deploy-QA]   Update k8s/overlays/qa/kustomization.yaml, commit to Git (main only)
  → [Notify]      Print deployment summary
         ↓
  ArgoCD detects Git change → auto-syncs cluster
```

### Pipeline Features

- ✅ **Automatic Docker Build** — Builds image on `app/**` or `Dockerfile` changes
- ✅ **Branch-based Versioning** — Tags images as `{branch}-{run_number}` (e.g. `main-19`)
- ✅ **DockerHub Push** — Pushes to `appukuttan/mastersong`
- ✅ **Kustomize Manifest Update** — Auto-updates overlay `kustomization.yaml` files
- ✅ **Multi-environment** — DEV on all branches, QA on `main` only
- ✅ **ArgoCD Sync** — Triggers automatic deployment via GitOps

### Branch Strategy

| Branch  | DEV Deploy | QA Deploy |
|---------|-----------|-----------|
| `main`  | ✅ Yes    | ✅ Yes    |
| feature | ✅ Yes    | ❌ No     |

### Quick Setup

1. **Create DockerHub Access Token**
   - Go to DockerHub → Account Settings → Security → New Access Token

2. **Add GitHub Secrets**
   ```
   Repository → Settings → Secrets → Actions
   Add: DOCKERHUB_USERNAME     = appukuttan
   Add: DOCKERHUB_TOKEN        = your_dockerhub_token
   Add: MUSICAPP_GITHUB_TOKEN  = your_github_pat (needs repo write access)
   ```

3. **Trigger Pipeline**
   - Push code changes to any branch
   - Or manually trigger from Actions tab (choose `dev` or `qa` environment)

### Image Versioning

- **Format:** `appukuttan/mastersong:{branch}-{run_number}`
- **Example:** `appukuttan/mastersong:main-19`
- **Also tagged as:** `appukuttan/mastersong:{branch}-latest`

For detailed pipeline documentation, see [.github/workflows/README.md](.github/workflows/README.md)  
For setup instructions, see [.github/workflows/SETUP.md](.github/workflows/SETUP.md)

## Customization

### Adding More Songs

1. Add your MP3 files to `app/media/`
2. Update `app/index.html` to add new playlist items
3. Rebuild the Docker image and push — the pipeline handles the rest

### Changing Port

Edit `docker-compose.yml` or use a different port in the `docker run` command:

```bash
docker run -d -p 3000:80 --name music-dashboard music-dashboard
```

### Nginx Configuration

Modify `app/nginx.conf` to customize:
- Caching policies
- Security headers
- MIME types
- Compression settings

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs music-dashboard

# Check if port 8080 is already in use
lsof -i :8080
```

### Media files not loading
- Ensure files are in `app/media/`
- Check Dockerfile COPY commands
- Verify `app/nginx.conf` MIME types

### ArgoCD not syncing
- Confirm Git changes were pushed
- ArgoCD polls every ~3 minutes; or trigger a manual sync from the UI
- Check ArgoCD app status: `kubectl get applications -n argocd`

## License

MIT License - Feel free to use and modify!

## Author

Created with ❤️ for music lovers
