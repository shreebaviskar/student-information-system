pipeline {
    agent any

    environment {
        APP_IMAGE_NAME = 'student-information-system'
        CONTAINER_NAME = 'student-info-app'
        HOST_PORT      = '8080'
        CONTAINER_PORT = '80'
        // Uses the current user's LocalAppData dynamically (works for any Windows user)
        DOCKER_EXE = 'C:\\Users\\shree\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Validate Project Files') {
            steps {
                echo 'Validating required project assets...'
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
                            error("CRITICAL: Required file is missing: ${file}")
                        }
                        echo "Verified: ${file}"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${APP_IMAGE_NAME}:${BUILD_NUMBER}..."
                bat '"%DOCKER_EXE%" --version'
                bat '"%DOCKER_EXE%" build -t %APP_IMAGE_NAME%:%BUILD_NUMBER% -t %APP_IMAGE_NAME%:latest .'
            }
        }

        stage('Deploy Application') {
            steps {
                echo "Deploying container %CONTAINER_NAME% on port %HOST_PORT%..."
                // rm -f stops and removes existing container; returnStatus: true prevents failure on build #1
                bat(returnStatus: true, script: '"%DOCKER_EXE%" rm -f %CONTAINER_NAME%')
                bat '"%DOCKER_EXE%" run -d --name %CONTAINER_NAME% -p %HOST_PORT%:%CONTAINER_PORT% %APP_IMAGE_NAME%:%BUILD_NUMBER%'
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying container running state and HTTP availability...'
                sleep 5

                bat '"%DOCKER_EXE%" ps --filter name=%CONTAINER_NAME%'

                // Works whether or not the Jenkins PowerShell plugin is installed
                bat '''
                    powershell -Command "try { $res = Invoke-WebRequest -Uri ('http://localhost:' + $env:HOST_PORT) -UseBasicParsing -TimeoutSec 15; Write-Host ('HTTP Status: ' + $res.StatusCode); if ($res.StatusCode -eq 200) { Write-Host 'Verification Passed!'; exit 0 } else { exit 1 } } catch { Write-Error $_.Exception.Message; exit 1 }"
                '''
            }
        }
    }

    post {
        success {
            echo '========================================='
            echo 'PIPELINE SUCCESS!'
            echo "Application is running at: http://localhost:${HOST_PORT}"
            echo '========================================='
        }

        failure {
            echo '========================================='
            echo 'PIPELINE FAILED. Inspect the console output above.'
            echo 'Ensure Docker Desktop is running.'
            echo '========================================='
        }

        always {
            echo "Build #${BUILD_NUMBER} execution completed."
        }
    }
}
