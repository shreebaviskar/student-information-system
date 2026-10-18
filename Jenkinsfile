pipeline {
    agent any

    environment {
        APP_IMAGE_NAME = 'student-information-system'
        CONTAINER_NAME = 'student-info-app'
        HOST_PORT = '8080'
        CONTAINER_PORT = '80'
            DOCKER_EXE = 'C:\\Users\\shree\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub'
                checkout scm
            }
        }

        stage('Validate Project Files') {
            steps {
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
                            error("Required file is missing: ${file}")
                        }
                        echo "Verified: ${file}"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
<<<<<<< HEAD
                echo '=================================================='
                echo 'STAGE 3: BUILD DOCKER CONTAINER IMAGE'
                echo '=================================================='
                echo "Building Docker image '${APP_IMAGE_NAME}:${BUILD_NUMBER}'..."
                script {
                    if (isUnix()) {
                        sh "docker build -t ${APP_IMAGE_NAME}:${BUILD_NUMBER} -t ${APP_IMAGE_NAME}:latest ."
                    } else {
                        bat '"%DOCKER_EXE%" --version'
bat '"%DOCKER_EXE%" build -t %APP_IMAGE_NAME%:%BUILD_NUMBER% -t %APP_IMAGE_NAME%:latest .'
                    }
                }
                echo "Docker image '${APP_IMAGE_NAME}:${BUILD_NUMBER}' built successfully."
=======
                bat '''"%DOCKER_EXE%" --version'''
                bat '''"%DOCKER_EXE%" build -t %APP_IMAGE_NAME%:%BUILD_NUMBER% -t %APP_IMAGE_NAME%:latest .'''
>>>>>>> 0d6a707 (Fix Jenkins pipeline syntax)
            }
        }

        stage('Deploy Application') {
            steps {
                script {
<<<<<<< HEAD
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
                        bat '"%DOCKER_EXE%" rm -f %CONTAINER_NAME%'
                        bat '"%DOCKER_EXE%" run -d --name %CONTAINER_NAME% -p %HOST_PORT%:%CONTAINER_PORT% %APP_IMAGE_NAME%:%BUILD_NUMBER%'
                    }
                           
                    }
=======
                    bat '''"%DOCKER_EXE%" rm -f %CONTAINER_NAME% 2>NUL'''
                    bat '''"%DOCKER_EXE%" run -d --name %CONTAINER_NAME% -p %HOST_PORT%:%CONTAINER_PORT% %APP_IMAGE_NAME%:%BUILD_NUMBER%'''
>>>>>>> 0d6a707 (Fix Jenkins pipeline syntax)
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sleep 5

                bat '''"%DOCKER_EXE%" ps --filter name=student-info-app'''

<<<<<<< HEAD
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
=======
                powershell '''
                    $ErrorActionPreference = "Stop"
>>>>>>> 0d6a707 (Fix Jenkins pipeline syntax)

                    try {
                        $response = Invoke-WebRequest `
                            -Uri "http://localhost:8080" `
                            -UseBasicParsing `
                            -TimeoutSec 15

                        Write-Host "HTTP Status: $($response.StatusCode)"

                        if ($response.StatusCode -ne 200) {
                            exit 1
                        }
                    }
                    catch {
                        Write-Error $_.Exception.Message
                        exit 1
                    }
                '''
            }
        }
    }

    post {
        success {
            echo 'PIPELINE SUCCESS!'
            echo 'Application: http://localhost:8080'
        }

        failure {
            echo 'PIPELINE FAILED. Check Console Output for the error.'
        }

        always {
            echo "Build #${BUILD_NUMBER} completed."
        }
    }
}