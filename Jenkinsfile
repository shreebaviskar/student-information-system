pipeline {
    agent any

    environment {
        APP_IMAGE_NAME = 'student-information-system'
        CONTAINER_NAME = 'student-info-app'
        HOST_PORT      = '8080'
        CONTAINER_PORT = '80'
    }

    stages {
        // STAGE 1: CHECKOUT
        // Checks out source code from configured SCM repository (Git/GitHub)
        stage('Checkout') {
            steps {
                echo '=================================================='
                echo 'STAGE 1: CHECKOUT SOURCE CODE'
                echo '=================================================='
                echo 'Fetching latest commits from configured Git repository...'
                checkout scm
            }
        }

        // STAGE 2: VALIDATE PROJECT FILES
        // Confirms all required static, server, and container files exist
        stage('Validate Project Files') {
            steps {
                echo '=================================================='
                echo 'STAGE 2: VALIDATE REQUIRED PROJECT FILES'
                echo '=================================================='
                script {
                    def requiredFiles = [
                        'index.html',
                        'style.css',
                        'script.js',
                        'Dockerfile',
                        'nginx.conf'
                    ]

                    for (file in requiredFiles) {
                        if (!fileExists(file)) {
                            error("CRITICAL ERROR: Required file '${file}' is missing from the workspace. Aborting pipeline.")
                        } else {
                            echo " [OK] Verified existence of: ${file}"
                        }
                    }
                    echo 'All required project files are verified successfully.'
                }
            }
        }

        // STAGE 3: BUILD DOCKER IMAGE
        // Packages the application into an Nginx container image with build tagging
        stage('Build Docker Image') {
            steps {
                echo '=================================================='
                echo 'STAGE 3: BUILD DOCKER CONTAINER IMAGE'
                echo '=================================================='
                echo "Building Docker image '${APP_IMAGE_NAME}:${BUILD_NUMBER}'..."
                script {
                    if (isUnix()) {
                        sh "docker build -t ${APP_IMAGE_NAME}:${BUILD_NUMBER} -t ${APP_IMAGE_NAME}:latest ."
                    } else {
                        bat "docker build -t ${APP_IMAGE_NAME}:${BUILD_NUMBER} -t ${APP_IMAGE_NAME}:latest ."
                    }
                }
                echo "Docker image '${APP_IMAGE_NAME}:${BUILD_NUMBER}' built successfully."
            }
        }

        // STAGE 4: DEPLOY APPLICATION
        // Stops any previous container and runs the newly built application container
        stage('Deploy Application') {
            steps {
                echo '=================================================='
                echo 'STAGE 4: DEPLOY APPLICATION CONTAINER'
                echo '=================================================='
                echo "Deploying container '${CONTAINER_NAME}' on host port ${HOST_PORT}..."
                script {
                    if (isUnix()) {
                        sh """
                            # Safely stop and remove previous container if running
                            if [ \$(docker ps -a -q -f name=^/${CONTAINER_NAME}\$) ]; then
                                echo "Stopping and removing existing container '${CONTAINER_NAME}'..."
                                docker stop ${CONTAINER_NAME} || true
                                docker rm ${CONTAINER_NAME} || true
                            fi

                            echo "Running new container '${CONTAINER_NAME}' from image '${APP_IMAGE_NAME}:${BUILD_NUMBER}'..."
                            docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} ${APP_IMAGE_NAME}:${BUILD_NUMBER}
                        """
                    } else {
                        bat """
                            @echo off
                            FOR /F "tokens=*" %%i IN ('docker ps -a -q -f name^=^/${CONTAINER_NAME}^\$') DO (
                                echo Stopping and removing existing container '${CONTAINER_NAME}'...
                                docker stop ${CONTAINER_NAME}
                                docker rm ${CONTAINER_NAME}
                            )
                            echo Running new container '${CONTAINER_NAME}' from image '${APP_IMAGE_NAME}:${BUILD_NUMBER}'...
                            docker run -d --name ${CONTAINER_NAME} -p ${HOST_PORT}:${CONTAINER_PORT} ${APP_IMAGE_NAME}:${BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        // STAGE 5: VERIFY DEPLOYMENT
        // Confirms the container is active and returns HTTP 200 OK
        stage('Verify Deployment') {
            steps {
                echo '=================================================='
                echo 'STAGE 5: VERIFY DEPLOYMENT'
                echo '=================================================='
                echo 'Waiting for Nginx server to initialize...'
                script {
                    sleep 3
                    if (isUnix()) {
                        sh """
                            echo "Checking container running state..."
                            docker ps -f name=^/${CONTAINER_NAME}\$

                            echo "Checking HTTP response at http://localhost:${HOST_PORT}..."
                            HTTP_STATUS=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${HOST_PORT} || echo "FAILED")
                            echo "Received HTTP status: \$HTTP_STATUS"

                            if [ "\$HTTP_STATUS" != "200" ]; then
                                echo "ERROR: Expected HTTP 200 but received '\$HTTP_STATUS'."
                                echo "Dumping container logs for diagnostics:"
                                docker logs --tail 50 ${CONTAINER_NAME}
                                error("Deployment verification failed.")
                            fi
                        """
                    } else {
                        bat """
                            echo Checking container running state...
                            docker ps -f name=^/${CONTAINER_NAME}\$

                            echo Checking HTTP response at http://localhost:${HOST_PORT}...
                            powershell -Command "try { \$resp = Invoke-WebRequest -Uri 'http://localhost:${HOST_PORT}' -UseBasicParsing -TimeoutSec 10; Write-Host ('HTTP Status: ' + \$resp.StatusCode); if (\$resp.StatusCode -eq 200) { Write-Host 'Verification Passed: Application responded with HTTP 200 OK!'; exit 0 } else { Write-Error ('Unexpected status code: ' + \$resp.StatusCode); exit 1 } } catch { Write-Error \$_.Exception.Message; exit 1 }"
                        """
                    }
                }
                echo 'Deployment successfully verified!'
            }
        }
    }

    // POST-EXECUTION ACTIONS & NOTIFICATIONS
    post {
        success {
            echo '=================================================='
            echo 'PIPELINE STATUS: SUCCESS'
            echo "Application successfully deployed and running at:"
            echo "  http://localhost:${HOST_PORT}"
            echo "Image Tag: ${APP_IMAGE_NAME}:${BUILD_NUMBER}"
            echo '=================================================='
        }
        failure {
            echo '=================================================='
            echo 'PIPELINE STATUS: FAILED'
            echo 'An error occurred during pipeline execution.'
            echo 'Troubleshooting steps:'
            echo ' 1. Verify Docker Desktop is running on host machine.'
            echo ' 2. Ensure Jenkins user/service has permission to access Docker daemon.'
            echo ' 3. Check port 8080 is not already occupied by another service.'
            echo '=================================================='
        }
        always {
            echo "Pipeline run completed for build #${BUILD_NUMBER}."
        }
    }
}
