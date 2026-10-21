# Student Information System with Automated Deployment Using Jenkins and Docker

> **Academic Subject:** ASDD — Agile Software Development and DevOps  
> **Target Audience:** Engineering Students, Evaluators, and Examiners  
> **Architecture:** Static Frontend (HTML5, CSS3, Vanilla JS) &bull; High-Performance Web Server (Nginx) &bull; Containerization (Docker) &bull; CI/CD Pipeline (Jenkins) &bull; Version Control (Git/GitHub)

---

## Table of Contents
1. [Project Abstract](#1-project-abstract)
2. [Problem Statement & Objectives](#2-problem-statement--objectives)
3. [Mapping to ASDD Practical Syllabus](#3-mapping-to-asdd-practical-syllabus)
4. [Tools and Technologies](#4-tools-and-technologies)
5. [System Architecture & CI/CD Workflow](#5-system-architecture--cicd-workflow)
6. [Application Features](#6-application-features)
7. [Project File Structure](#7-project-file-structure)
8. [Local Running & Quick Start](#8-local-running--quick-start)
9. [Docker Containerization](#9-docker-containerization)
10. [Git & GitHub Workflow](#10-git--github-workflow)
11. [Complete Jenkins Setup on Windows](#11-complete-jenkins-setup-on-windows)
12. [Continuous Integration & Continuous Deployment (CI/CD) Concepts](#12-continuous-integration--continuous-deployment-cicd-concepts)
13. [Testing Procedure & Verification](#13-testing-procedure--verification)
14. [Troubleshooting Common Issues](#14-troubleshooting-common-issues)
15. [Limitations & Future Enhancements](#15-limitations--future-enhancements)
16. [Conclusion](#16-conclusion)
17. [15 Viva Questions and Answers](#17-15-viva-questions-and-answers)

---

## 1. Project Abstract

The **Student Information System (SIS)** is an educational management portal designed to demonstrate core DevOps principles in an Agile software development lifecycle. Built as a lightweight, database-free frontend web application using HTML5, CSS3, and modern Vanilla JavaScript, it is containerized with **Docker** on an **Nginx Alpine** base and automatically built, validated, and deployed via a declarative **Jenkins CI/CD Pipeline**.

This project provides academic institutions with an intuitive student record management interface while illustrating how modern DevOps tools eliminate manual deployment bottlenecks, enhance environment consistency, and provide automated verification.

---

## 2. Problem Statement & Objectives

### Problem Statement
Traditional academic software projects often suffer from the classic **"works on my machine"** syndrome. Deploying web applications across diverse student or college lab workstations frequently encounters dependency conflicts, mismatched runtime environments, and tedious manual setup steps. Furthermore, updates are prone to regression errors when deployment lacks automated validation.

### Objectives
1. **Develop an accessible, functional Student Management Portal:** Enable college administrators to view, add, edit, search, and delete student academic records without relying on complex external databases or heavy frameworks.
2. **Implement Infrastructure as Code (IaC) with Docker:** Package the static application into an immutable, self-contained container using official Nginx images.
3. **Automate Quality & Deployment via Jenkins CI/CD:** Create a 5-stage declarative pipeline that checks out code, validates project assets, builds version-tagged Docker images, deploys the container, and verifies HTTP availability.
4. **Enforce Version Control Discipline with Git:** Maintain full commit history and branch management suitable for collaborative Agile teams.

---

## 3. Mapping to ASDD Practical Syllabus

This mini project serves as an end-to-end practical implementation directly mapped to the standard university ASDD (Agile Software Development and DevOps) laboratory curriculum:

| ASDD Practical Experiment | Tool / Technique Applied | Project Implementation Details |
| :--- | :--- | :--- |
| **Experiment 2:** Version Control with Git | **Git & GitHub** | Local repository initialization, atomic commits, `.gitignore` exclusion, remote tracking on GitHub, and branch management (`main`). |
| **Experiment 3:** Continuous Integration Pipeline | **Jenkins Declarative Pipeline** | Automated checkout, file integrity verification stage, and container image compilation on every commit. |
| **Experiment 5:** Application Containerization | **Docker & Nginx** | Multi-stage Dockerfile setup, custom `nginx.conf`, layer optimization, and non-root web delivery. |
| **Experiment 8:** Automated Application Deployment | **Jenkins Continuous Deployment** | Automated zero-downtime container replacement on host port `8080` with health check verification (`HTTP 200 OK`). |

---

## 4. Tools and Technologies

### 1. Frontend Web Technologies
- **HTML5:** Semantic document markup (`<header>`, `<main>`, `<aside>`, `<section>`, `<dialog>`).
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, responsive media queries, and subtle shadows.
- **Vanilla JavaScript (ES6+):** Strict mode (`'use strict'`), DOM manipulation, event delegation, regular expression validation, and browser `localStorage` management without external libraries.

### 2. DevOps & Infrastructure Stack
- **Git & GitHub:** Distributed version control system for tracking source code changes and collaborating.
- **Docker:** OS-level virtualization platform that packages software into standardized units called containers.
- **Nginx (Alpine Linux):** High-performance, low-memory HTTP web server serving static files inside Docker.
- **Jenkins:** Open-source automation server coordinating the CI/CD pipeline.

---

## 5. System Architecture & CI/CD Workflow

### Architecture Diagram (ASCII Flow)

```
+-----------------------------------------------------------------------------------+
|                            DEVELOPER WORKSTATION                                  |
|   [Edit index.html / style.css / script.js] ---> [Git Commit & Push to GitHub]   |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                GITHUB REPOSITORY                                  |
|                     github.com/YOUR_USERNAME/YOUR_REPO.git                        |
+-----------------------------------------------------------------------------------+
                                          |
                        (Manual Trigger or Webhook)
                                          v
+-----------------------------------------------------------------------------------+
|                                JENKINS CI/CD SERVER                               |
|                                                                                   |
|  [Stage 1: Checkout]                                                             |
|       Pull latest code from Git branch 'main'                                     |
|           |                                                                       |
|  [Stage 2: Validate Project Files]                                               |
|       Verify index.html, style.css, script.js, Dockerfile, nginx.conf exist       |
|           |                                                                       |
|  [Stage 3: Build Docker Image]                                                   |
|       docker build -t student-information-system:${BUILD_NUMBER} .                |
|           |                                                                       |
|  [Stage 4: Deploy Application]                                                   |
|       Safely stop existing container -> Launch 'student-info-app' on port 8080    |
|           |                                                                       |
|  [Stage 5: Verify Deployment]                                                    |
|       Check container health & confirm HTTP 200 OK response                       |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                              DOCKER RUNTIME ENGINE                                |
|  +-----------------------------------------------------------------------------+  |
|  | Container: student-info-app (Host Port 8080 -> Container Port 80)           |  |
|  | +-------------------------------------------------------------------------+ |  |
|  | | Nginx Alpine Web Server                                                 | |  |
|  | | Document Root: /usr/share/nginx/html                                     | |  |
|  | | [index.html, style.css, script.js, nginx.conf]                         | |  |
|  | +-------------------------------------------------------------------------+ |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                                 END USER BROWSER                                  |
|                         Accessible at http://localhost:8080                       |
|         (Client-side Data Persistence via Browser HTML5 localStorage)             |
+-----------------------------------------------------------------------------------+
```

---

## 6. Application Features

### A. Dashboard Overview
- **Total Students Metric:** Displays real-time count of enrolled students.
- **Departments Represented:** Automatically calculates how many distinct academic branches have active records.
- **Final Year Candidates:** Tracks students preparing for graduation.
- **Leading Department:** Identifies the department with the highest student enrollment.

### B. Student Record Management
- **Add Student:** Interactive modal dialog with field validation.
- **View Profile:** ID card view displaying student initials avatar, department, roll number, and contact info.
- **Edit Record:** Update any field of an existing student with duplicate validation that excludes the active record.
- **Delete Record:** Safe deletion protected by a confirmation dialog displaying the student's name and roll number.
- **Duplicate Prevention:** Case-insensitive validation prevents duplicate Student IDs (e.g., `STU-1001`) and Roll Numbers (e.g., `CS-2023-014`).

### C. Live Search & Multi-Filter
- **Universal Search:** Instant filtering across Name, Roll Number, Student ID, and Department.
- **Department Dropdown Filter:** Filter by specific engineering departments.
- **Year Dropdown Filter:** Filter by academic year (First Year to Final Year).
- **Empty State:** Illustrated notification with a one-click "Clear Search Filters" button.

### D. Data Persistence (localStorage)
- Student records are stored inside the client browser's `localStorage` (`asdd_student_records`).
- **Initial Sample Data:** 6 realistic records are pre-loaded upon initial launch.
- **Survival across reloads:** Refreshing the page preserves all changes, edits, and newly added students.
- **Persistence Isolation:** LocalStorage is specific to the browser and device being used; it does not synchronize across separate physical computers or different web browsers.

---

## 7. Project File Structure

```
student-information-system/
│
├── index.html          # Semantic HTML5 dashboard layout and modals
├── style.css           # Modern administration styling, responsive layout, CSS variables
├── script.js           # Full CRUD logic, validation, localStorage persistence, search
├── Dockerfile          # Nginx Alpine container definition
├── nginx.conf          # Nginx server configuration (security headers, caching, fallback)
├── Jenkinsfile         # Declarative 5-stage Jenkins CI/CD pipeline
├── .dockerignore       # Excludes git, docs, and unnecessary files from Docker build context
├── .gitignore          # Excludes OS artifacts, logs, and IDE caches from Git
└── README.md           # Comprehensive academic report, setup guide, and viva Q&A
```

---

## 8. Local Running & Quick Start

You can test and run the application locally without Docker or Jenkins:

### Option A: Direct Browser Execution
Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option B: Local Python HTTP Server
Run the following command from the project directory:
```bash
python -m http.server 8000
```
Open your browser and navigate to:
```
http://localhost:8000
```

### Option C: Local Node.js HTTP Server
Run:
```bash
npx serve .
```

---

## 9. Docker Containerization

### Prerequisites
- Install **Docker Desktop** on Windows.
- Ensure Docker Desktop is running (whale icon in system tray).

### Step 1: Build the Docker Image
From the project directory, run:
```bash
docker build -t student-information-system .
```

### Step 2: Run the Docker Container
Launch the container mapping host port `8080` to container port `80`:
```bash
docker run -d --name student-info-app -p 8080:80 student-information-system
```

### Step 3: Access the Application
Open your web browser and visit:
```
http://localhost:8080
```

### Useful Docker Commands for Demonstration:
- **List running containers:**
  ```bash
  docker ps
  ```
- **View Nginx access/error logs:**
  ```bash
  docker logs student-info-app
  ```
- **Stop the container:**
  ```bash
  docker stop student-info-app
  ```
- **Remove the container:**
  ```bash
  docker rm student-info-app
  ```

---

## 10. Git & GitHub Workflow

### Initializing and Pushing to GitHub

1. **Initialize a local Git repository:**
   ```bash
   git init
   ```

2. **Verify repository status:**
   ```bash
   git status
   ```

3. **Stage all project files:**
   ```bash
   git add .
   ```

4. **Create the initial commit:**
   ```bash
   git commit -m "Initial commit: Student Information System with Docker and Jenkins CI/CD"
   ```

5. **Rename the default branch to main:**
   ```bash
   git branch -M main
   ```

6. **Create a new repository on GitHub:**
   - Log into your GitHub account.
   - Click **New Repository**.
   - Name it (e.g., `student-information-system`).
   - Do **not** initialize with README or .gitignore (we already created them).
   - Copy your repository URL (e.g., `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git`).

7. **Link your local repository to GitHub:**
   ```bash
   git remote add origin YOUR_GITHUB_REPOSITORY_URL
   ```
   *(Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual URL).*

8. **Push your code to GitHub:**
   ```bash
   git push -u origin main
   ```

9. **Making updates in the future:**
   ```bash
   git add .
   git commit -m "Update student management features"
   git push
   ```

---

## 11. Complete Jenkins Setup on Windows

### Step 1: Prerequisites Installation
1. **Git:** Download and install from [git-scm.com](https://git-scm.com/). Ensure `git` is added to your Windows PATH.
2. **Java Runtime (JDK 17 or JDK 21):** Jenkins requires Java 17 or 21. Install Eclipse Temurin or Oracle JDK and set `JAVA_HOME`.
3. **Docker Desktop:** Download and install from [docker.com](https://www.docker.com/). Ensure **WSL 2 backend** is enabled.

### Step 2: Install Jenkins on Windows
1. Download the Windows installer (`.msi`) or the generic `jenkins.war` file from [jenkins.io](https://www.jenkins.io/).
2. Run the installer or run the WAR directly via command prompt:
   ```bash
   java -jar jenkins.war --httpPort=8081
   ```
   *(Note: If port 8080 is reserved for your application container, run Jenkins on port 8081).*

### Step 3: Initial Jenkins Unlock & Plugins
1. Open your browser and navigate to: `http://localhost:8081`
2. Retrieve the initial administrator password from the path shown on screen (or the terminal log) and enter it.
3. Select **Install Suggested Plugins**.
4. Create an Admin User account.

### Step 4: Configure Jenkins Agent with Docker Access
On Windows, Jenkins must be capable of executing `docker` CLI commands:
1. Verify Docker works in your Windows Command Prompt:
   ```cmd
   docker --version
   ```
2. If Jenkins was installed as a **Windows Service**, the default `Local System` account may not have access to Docker Desktop (which runs under your interactive Windows user login).
   - Open Windows Services (`services.msc`).
   - Locate the **Jenkins** service.
   - Right-click &rarr; **Properties** &rarr; **Log On** tab.
   - Switch from *Local System account* to *This account*, and enter your Windows username and password.
   - Restart the Jenkins service.
   *(Alternatively, running `java -jar jenkins.war` directly from an interactive terminal under your logged-in user automatically inherits Docker permissions).*

### Step 5: Create the Declarative Pipeline Job
1. In the Jenkins dashboard, click **New Item**.
2. Enter item name: `Student-Information-System-Pipeline`.
3. Select **Pipeline** and click **OK**.
4. Scroll down to the **Pipeline** configuration section:
   - Under **Definition**, select **Pipeline script from SCM**.
   - Under **SCM**, select **Git**.
   - Enter your **Repository URL** (e.g., `https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git`).
   - Under **Credentials**, select None (if public repository) or add your GitHub Personal Access Token (if private).
   - In **Branch Specifier**, enter: `*/main`.
   - In **Script Path**, enter: `Jenkinsfile`.
5. Click **Save**.

### Step 6: Execute the Pipeline
1. Click **Build Now** on the left menu.
2. Click on the active build number (e.g. `#1`) &rarr; **Console Output**.
3. Watch the 5 pipeline stages execute:
   - `Checkout` &rarr; Checks out code from GitHub.
   - `Validate Project Files` &rarr; Validates all 5 required files exist.
   - `Build Docker Image` &rarr; Compiles `student-information-system:1`.
   - `Deploy Application` &rarr; Launches `student-info-app` on port 8080.
   - `Verify Deployment` &rarr; Verifies HTTP 200 response.
4. Open `http://localhost:8080` in your browser to verify the deployed application.

---

## 12. Continuous Integration & Continuous Deployment (CI/CD) Concepts

### Continuous Integration (CI)
Continuous Integration is the practice of automatically integrating code changes from multiple developers into a central repository frequently. In this project:
- Each commit triggers an automated pipeline.
- The pipeline checks file integrity and ensures the Docker build succeeds without errors.
- Any syntax or missing file error is caught immediately before deployment.

### Continuous Deployment (CD)
Continuous Deployment is the practice of automatically releasing validated builds directly into the target environment without manual intervention. In this project:
- Once the Docker image passes validation, Jenkins immediately stops the outdated container and launches the updated container on port 8080.
- The pipeline automatically performs a smoke test by requesting `http://localhost:8080` to verify live availability.

### Optional GitHub Webhook Automation
To trigger the Jenkins pipeline automatically every time you push code to GitHub:
1. Ensure Jenkins is reachable by GitHub (via public IP or tunnel like ngrok).
2. In GitHub Repository &rarr; **Settings** &rarr; **Webhooks** &rarr; **Add Webhook**.
3. Set Payload URL to: `http://YOUR_JENKINS_URL/github-webhook/`.
4. In Jenkins Job Configuration &rarr; Build Triggers &rarr; check **GitHub hook trigger for GITScm polling**.

---

## 13. Testing Procedure & Verification

### Test Matrix

| # | Test Case Description | Expected Result | Verification Status |
| :- | :--- | :--- | :- |
| 1 | **Initial Page Load** | Loads dashboard with 6 sample student records and updated metric cards. | PASSED |
| 2 | **Add Student Validation** | Empty fields trigger inline error messages; invalid email is rejected. | PASSED |
| 3 | **Duplicate ID Check** | Entering existing ID (e.g. `STU-1001`) displays error and blocks saving. | PASSED |
| 4 | **Duplicate Roll Check** | Entering existing Roll (e.g. `CS-2023-014`) displays error and blocks saving. | PASSED |
| 5 | **Edit Student Record** | Modifies existing record and updates table and summary metrics instantly. | PASSED |
| 6 | **Delete Student Record** | Shows confirmation modal; removes student upon confirmation; updates stats. | PASSED |
| 7 | **Search by Name/Roll/Dept** | Filters rows live; shows empty state if no records match search query. | PASSED |
| 8 | **Browser Refresh Persistence** | Custom student additions remain preserved in localStorage after reload. | PASSED |
| 9 | **Nginx Configuration** | Correct MIME types, security headers, and gzip compression active. | PASSED |
| 10 | **Jenkins File Verification** | Aborts pipeline with clear error if any required file is removed. | PASSED |
| 11 | **Deployment Verification** | Verifies container is running and returns HTTP status code 200. | PASSED |

---

## 14. Troubleshooting Common Issues

### Issue 1: Port 8080 is already in use
**Symptom:** Docker fails with `Bind for 0.0.0.0:8080 failed: port is already allocated`.  
**Resolution:**
1. Check what is using port 8080 on Windows:
   ```cmd
   netstat -ano | findstr :8080
   ```
2. If another container is using it, stop it:
   ```bash
   docker stop $(docker ps -q --filter publish=8080)
   ```
3. Or modify `Jenkinsfile` and `docker run` command to map to an alternative host port such as `8085`:
   ```bash
   docker run -d --name student-info-app -p 8085:80 student-information-system
   ```

### Issue 2: Docker command not recognized in Jenkins
**Symptom:** `docker: command not found` in Jenkins console output.  
**Resolution:**
- Ensure Docker Desktop is installed and running.
- Add Docker's binary path (typically `C:\Program Files\Docker\Docker\resources\bin`) to the system `PATH` environment variable.
- Restart Jenkins after updating system PATH.

### Issue 3: Container name conflict
**Symptom:** `The container name "/student-info-app" is already in use`.  
**Resolution:**
Remove the existing stopped container before running:
```bash
docker rm -f student-info-app
```
*(The provided `Jenkinsfile` handles this automatically in Stage 4).*

---

## 15. Limitations & Future Enhancements

### Current Limitations
1. **Client-Side Storage Isolation:** Data is stored in browser `localStorage`. Records entered in Google Chrome on Machine A will not automatically appear on Machine B or in Firefox.
2. **Local Deployment Scope:** The container runs on `localhost:8080`, intended for local laboratory demonstrations rather than a multi-node Kubernetes production cluster.

### Future Enhancements
1. **Cloud Database Integration:** Connect a Node.js/Express or Python/FastAPI microservice backend with MongoDB or PostgreSQL.
2. **Kubernetes Orchestration:** Add Kubernetes deployment manifests (`deployment.yaml`, `service.yaml`, and Helm charts) for rolling updates and auto-scaling.
3. **Automated End-to-End Testing:** Incorporate headless Playwright/Cypress tests into the Jenkins pipeline before the deployment stage.

---

## 16. Conclusion

The **Student Information System with Automated Deployment Using Jenkins and Docker** successfully demonstrates how agile software engineering and modern DevOps automation work in synergy. By decoupling application code, web server configuration, and container deployment, this project demonstrates:
- How **Git** preserves code integrity and enables traceable collaboration.
- How **Docker** ensures consistent application behavior across diverse environments.
- How **Jenkins** automates testing and deployment to eliminate manual deployment errors.

This project delivers a functional, academic-ready solution that satisfies all criteria for ASDD laboratory practical examinations.

---

## 17. 15 Viva Questions and Answers

### Q1: What is DevOps and why is it important in Agile software development?
**Answer:** DevOps is a set of practices combining Software Development (Dev) and IT Operations (Ops). It aims to shorten the development lifecycle, increase deployment frequency, and deliver high-quality software continuously. In Agile, sprints produce frequent code changes; DevOps automates the testing and release of those changes without human delays.

### Q2: What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?
**Answer:** Continuous Integration (CI) automatically builds and tests code whenever a developer commits changes to the repository. Continuous Deployment (CD) takes validated builds from CI and deploys them directly to the production or test environment without manual intervention.

### Q3: Why is Docker used in this project instead of traditional virtual machines?
**Answer:** Docker containers share the host operating system kernel, making them lightweight (tens of megabytes), fast to start (in milliseconds), and resource-efficient. Virtual Machines require a full guest operating system and hypervisor, consuming gigabytes of RAM and taking minutes to boot.

### Q4: Why did we choose Nginx inside our Docker container?
**Answer:** Nginx is an event-driven, asynchronous HTTP web server renowned for high performance, low memory footprint, and exceptional efficiency at serving static files (HTML, CSS, JS).

### Q5: What is the purpose of the `Dockerfile`?
**Answer:** A `Dockerfile` is a text blueprint containing sequential instructions to assemble a Docker image. It specifies the base operating system (`nginx:alpine`), copies project files into the image, configures ports (`EXPOSE 80`), and defines the startup process (`CMD`).

### Q6: What is a Declarative Jenkins Pipeline?
**Answer:** A Declarative Pipeline is a structured, human-readable Groovy syntax for defining Jenkins CI/CD jobs. It uses predefined blocks like `pipeline`, `agent`, `stages`, `stage`, `steps`, and `post` to make pipeline scripts easier to read and maintain.

### Q7: What role does `.dockerignore` play?
**Answer:** Similar to `.gitignore`, `.dockerignore` prevents unnecessary files (like `.git`, `README.md`, `Jenkinsfile`, or temporary logs) from being sent into the Docker build context. This speeds up image build times and reduces the resulting image size.

### Q8: How does the application persist data without a backend database?
**Answer:** The application uses the HTML5 `localStorage` API provided by the web browser. Data is serialized to JSON strings and saved under a key (`asdd_student_records`). It persists across page refreshes and browser restarts on the same browser.

### Q9: What happens if a build fails in Stage 3 of the Jenkinsfile?
**Answer:** If Stage 3 (`Build Docker Image`) fails, Jenkins aborts the pipeline immediately. The `Deploy Application` stage will not execute, ensuring that any currently running production container is left untouched and continues serving users.

### Q10: How does the application prevent duplicate student entries?
**Answer:** Before saving, JavaScript inspects the current array of students in memory. It compares the entered Student ID and Roll Number against existing records (case-insensitively). If a match is detected, an inline validation error is shown and submission is halted.

### Q11: What is the difference between a Docker Image and a Docker Container?
**Answer:** A Docker Image is an inert, immutable template (the class). A Docker Container is a running, stateful instance of that image (the object).

### Q12: Why are we tagging Docker images with `${BUILD_NUMBER}` in Jenkins?
**Answer:** Tagging images with `${BUILD_NUMBER}` provides version traceability. It allows developers to identify exactly which Jenkins build generated a specific container image and enables rolling back to previous versions if issues arise.

### Q13: What does the command `docker run -d --name student-info-app -p 8080:80 student-information-system` do?
**Answer:** 
- `-d`: Runs the container in detached (background) mode.
- `--name student-info-app`: Names the container for easy reference.
- `-p 8080:80`: Forwards traffic from host port 8080 to container port 80.
- `student-information-system`: Specifies the Docker image to run.

### Q14: How does the Jenkins pipeline verify that the deployment succeeded?
**Answer:** In Stage 5, the pipeline inspects `docker ps` to ensure the container is running and makes an HTTP request to `http://localhost:8080`. If the server responds with status code `200 OK`, the stage succeeds; otherwise, it dumps container logs and marks the build as failed.

### Q15: What is the purpose of Git in DevOps?
**Answer:** Git serves as the single source of truth for all project assets—source code, configuration files, Dockerfiles, and CI/CD pipelines. It tracks who made changes, why they were made, and enables automated CI triggers on code push.

Automatic deployment test
