
# AquaSafe Frontend

AquaSafe is a comprehensive monitoring system designed for small-scale fishing vessels in Sri Lanka. The frontend of this project is built with React.js and the Vite build tool. The main goal of this project is to optimize long-range data transmission for secure and efficient communication using LoRa technology.

This document provides an overview of the deployment process, the Continuous Integration (CI) and Continuous Deployment (CD) pipeline, and how Docker and Kubernetes are used for application deployment.

## Table of Contents

1. [CI/CD Pipeline Overview](#ci-cd-pipeline-overview)
2. [CI/CD Workflow Explained](#cicd-workflow-explained)
3. [Dockerization](#dockerization)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Environment Configuration](#environment-configuration)

## CI/CD Pipeline Overview

The CI/CD pipeline automates the process of building, testing, and deploying the AquaSafe frontend. The pipeline uses GitHub Actions to automate the following steps:

1. **Continuous Integration (CI)**: 
    - On every pull request to the `main` branch, the CI pipeline runs. It ensures the code is properly linted, passes tests, and is free from security vulnerabilities.
    - The pipeline runs tests with code coverage enabled to check for any regressions or issues in the code.
    - SonarCloud is used to analyze the code quality and provide insights into any technical debt or issues.

2. **Continuous Deployment (CD)**: 
    - Once the CI checks are passed, the CD pipeline deploys the application.
    - The app is first built and then deployed to a container registry (Docker Hub or GitHub Container Registry).
    - The container is then deployed to a Kubernetes cluster to ensure scalability and proper management.

## CI/CD Workflow Explained

### 1. Continuous Integration (CI)

The CI process includes the following steps:

- **Code Checkout**: The first step is to check out the repository from GitHub using the `actions/checkout` GitHub action.
- **Node.js Setup**: The `actions/setup-node` action sets up the correct Node.js version to ensure compatibility with the project.
- **Dependency Installation**: The `npm ci` command is used to install dependencies listed in the `package-lock.json` to ensure a clean and reproducible environment.
- **Linting**: The code is linted using ESLint to enforce coding standards and best practices.
- **Testing**: Unit and integration tests are executed using Vitest to ensure the code's correctness. Code coverage is collected to assess test coverage.
- **SonarCloud Analysis**: SonarCloud is used to perform static code analysis to identify potential issues and technical debt in the codebase.
- **Build**: The application is built using Vite to create a production-ready build.
- **Security Audit**: The `npm audit` command is executed to identify any security vulnerabilities in the dependencies.

### 2. Continuous Deployment (CD)

Once the CI process is successful, the CD pipeline deploys the application as follows:

- **Build Vite App**: The app is built using `npm run build`, ensuring the production-ready version is generated.
- **Docker Build and Push**: The app is containerized using Docker. A Docker image is built and pushed to a container registry (such as Docker Hub).
- **Kubernetes Deployment**: The Docker image is deployed to a Kubernetes cluster using `kubectl` to apply Kubernetes configuration files (`deployment.yaml`, `service.yaml`, and `ingress.yaml`), which manage the application's scaling and traffic routing.

## Dockerization

Docker is used to package the AquaSafe frontend into a container. This ensures that the application can be run consistently across different environments. The process involves:

1. **Building the Docker Image**: The app is packaged into a Docker image, including the Vite build output and environment configuration.
2. **Pushing to Container Registry**: The built Docker image is pushed to a container registry (either Docker Hub or GitHub Container Registry) for later use in deployment.

The Dockerfile for the AquaSafe project looks like the following:

```dockerfile
# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application using Vite
RUN npm run build

# Expose the port that the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "run", "serve"]
```

This Dockerfile ensures that the app is built, packaged, and ready for deployment in a containerized environment.

## Kubernetes Deployment

The AquaSafe frontend is deployed to a Kubernetes cluster using `kubectl`. The following Kubernetes files are used:

- **`deployment.yaml`**: Defines the application deployment, including the Docker image and replicas.
- **`service.yaml`**: Defines the service that exposes the application to the internal network or externally if needed.
- **`ingress.yaml`**: Configures the ingress resource to manage external access to the application.

Here is an example of the `deployment.yaml` file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aquasafe-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: aquasafe-frontend
  template:
    metadata:
      labels:
        app: aquasafe-frontend
    spec:
      containers:
      - name: aquasafe-frontend
        image: <DOCKER_USERNAME>/aquasafe:latest
        ports:
        - containerPort: 3000
```

This configuration ensures the AquaSafe frontend is deployed with multiple replicas for scalability.

## Environment Configuration

The following environment variables are critical for the application and deployment process:

- **`VITE_BASE_URL`**: The base URL for the backend API, injected from GitHub Secrets during the CI/CD pipeline.
- **`SONAR_TOKEN`**: The SonarCloud token used for code analysis.
- **`DOCKER_USERNAME` & `DOCKER_PASSWORD`**: Credentials used to log in to the Docker registry.
- **`KUBECONFIG_CONTENT`**: The base64 encoded Kubernetes configuration required to access the cluster.

These environment variables are injected during the CI/CD pipeline run to ensure secure configuration and deployment.

## Conclusion

The AquaSafe frontend is continuously integrated and deployed using GitHub Actions, Docker, and Kubernetes. The CI/CD pipeline automates testing, security checks, and deployments to ensure a smooth and efficient development process.

For any changes or improvements to the project, please refer to the CI/CD pipeline configuration files for updates.
