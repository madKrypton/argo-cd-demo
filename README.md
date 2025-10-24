# 🎵 Music Dashboard

A beautiful web-based music dashboard served with nginx in a Docker container.

## Features

- 🎵 Audio player for MP3 files
- 🎬 Video player support
- 📀 Interactive playlist
- 📊 Media statistics
- 🎨 Modern, responsive design
- 🚀 Lightweight nginx server
- 🐳 Docker containerized

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```powershell
# Build and run the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Option 2: Using Docker CLI

```powershell
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
argocd-demo-app/
├── .github/                   # GitHub Actions CI/CD
│   └── workflows/
│       ├── build-deploy.yml  # Main pipeline
│       ├── README.md         # Pipeline documentation
│       └── SETUP.md          # Setup instructions
├── app/                       # Application folder
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Styling
│   ├── script.js             # JavaScript functionality
│   ├── nginx.conf            # Nginx configuration
│   └── media/                # Media folder
│       ├── bgimage.jpg       # Background image
│       ├── song1-album-image.png  # Album art for Song 1
│       ├── song2-album-image.png  # Album art for Song 2
│       ├── song1.mp3         # Bad Boys Good Sons
│       ├── song2.mp3         # Eye For an Eye
│       └── video.mp4         # Video file (background)
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml        # Namespace configuration
│   ├── deployment.yaml       # Deployment configuration
│   ├── service.yaml          # Service configuration
│   ├── ingress.yaml          # Ingress configuration
│   ├── configmap.yaml        # ConfigMap
│   └── README.md             # K8s deployment guide
├── argocd-application/       # ArgoCD GitOps configuration
│   ├── application.yaml      # ArgoCD Application manifest
│   ├── project.yaml          # ArgoCD AppProject manifest
│   ├── repository-secret.yaml # Azure DevOps repo credentials
│   └── README.md             # ArgoCD setup guide
├── Dockerfile                # Docker build instructions
├── docker-compose.yml        # Docker Compose configuration
├── .dockerignore             # Docker ignore file
└── README.md                 # This file
```

## Docker Commands Cheatsheet

```powershell
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

The application can be deployed to Minikube using the manifests in the `k8s/` folder.

### Quick Start with Minikube

```powershell
# Start Minikube
minikube start

# Deploy all resources
kubectl apply -f k8s/

# Access the application
minikube service music-dashboard -n music-dashboard
```

### Docker Image

- **Image:** `appukuttan/mastersong:v1`
- **Author:** Akash
- **Version:** v1.0.0
- **Service Type:** NodePort (30080)

For detailed Minikube deployment instructions, see [k8s/README.md](k8s/README.md)

## 🔄 GitOps with ArgoCD

Deploy the application using ArgoCD for automated GitOps workflow.

### Repository

- **Git Repository:** https://github.com/madKrypton/argo-cd-demo (Public Repository)
- **Path:** k8s/
- **Branch:** HEAD (latest)
- **Authentication:** ✅ Not required (public repository)

### Quick Start with ArgoCD

```powershell
# 1. Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# 2. Deploy application (no authentication needed - it's public!)
kubectl apply -f argocd-application/application.yaml

# 3. Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# Open: https://localhost:8080
```

### Features

- **Automated Sync:** Changes in Git automatically deploy
- **Self-Healing:** Reverts manual cluster changes
- **Auto-Prune:** Removes resources deleted from Git
- **Retry Logic:** Automatic retries with exponential backoff

For detailed ArgoCD setup instructions, see [argocd-application/README.md](argocd-application/README.md)

## 🔄 CI/CD Pipeline (GitHub Actions)

Automated build, versioning, and deployment pipeline.

### Pipeline Features

- ✅ **Automatic Docker Build** - Builds image on code changes
- ✅ **Auto Version Increment** - Increments tags (v1 → v2 → v3)
- ✅ **DockerHub Push** - Pushes to `appukuttan/mastersong`
- ✅ **K8s Manifest Update** - Auto-updates `k8s/deployment.yaml`
- ✅ **Git Tagging** - Creates version tags automatically
- ✅ **ArgoCD Sync** - Triggers automatic deployment

### Quick Setup

1. **Create DockerHub Access Token**
   - Go to DockerHub → Account Settings → Security → New Access Token
   
2. **Add GitHub Secrets**
   ```
   Repository → Settings → Secrets → Actions
   Add: DOCKERHUB_USERNAME = appukuttan
   Add: DOCKERHUB_TOKEN = your_token_here
   ```

3. **Trigger Pipeline**
   - Push code changes to main/master branch
   - Or manually trigger from Actions tab

### Pipeline Workflow

```
Code Push → Build Image → Increment Tag (v1→v2) → Push to DockerHub 
          → Update deployment.yaml → Commit → ArgoCD Syncs
```

### Image Versioning

- **Current:** `appukuttan/mastersong:v1`
- **Auto-increments to:** `v2`, `v3`, `v4`, etc.
- **Also tagged as:** `latest`

For detailed pipeline documentation, see [.github/workflows/README.md](.github/workflows/README.md)  
For setup instructions, see [.github/workflows/SETUP.md](.github/workflows/SETUP.md)

## Customization

### Adding More Songs

1. Add your MP3 files to the project directory
2. Update the `Dockerfile` to copy the new files
3. Update `index.html` to add new playlist items
4. Rebuild the Docker image

### Changing Port

Edit `docker-compose.yml` or use a different port in the `docker run` command:

```powershell
docker run -d -p 3000:80 --name music-dashboard music-dashboard
```

### Nginx Configuration

Modify `nginx.conf` to customize:
- Caching policies
- Security headers
- MIME types
- Compression settings

## Troubleshooting

### Container won't start
```powershell
# Check logs
docker logs music-dashboard

# Check if port 8080 is already in use
netstat -ano | findstr :8080
```

### Media files not loading
- Ensure files are in the project directory
- Check Dockerfile COPY commands
- Verify nginx.conf MIME types

## License

MIT License - Feel free to use and modify!

## Author

Created with ❤️ for music lovers
