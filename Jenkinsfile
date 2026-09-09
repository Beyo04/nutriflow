pipeline {
    agent any
    environment {
        IMAGE_NAME = 'nutriflow-backend:1.0'
        NETWORK_NAME = 'nutri-ci-net'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Beyo04/nutriflow.git'
            }
        }
        stage('SAST & Secret Scan (Trivy)') {
            steps {
                sh 'docker run --rm -v $PWD:/src aquasec/trivy:latest fs --scanners vuln,secret --severity HIGH,CRITICAL /src'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME ./backend'
            }
        }
        stage('SCA Image Scan (Trivy)') {
            steps {
                sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL $IMAGE_NAME'
            }
        }
        stage('DAST Dynamic Scan (OWASP ZAP)') {
            steps {
                sh '''
                # Prepare writeable directory for ZAP output
                mkdir -p zap-wrk
                chmod 777 zap-wrk

                # Clean up any leftover containers or networks
                docker rm -f test-backend test-mongo 2>/dev/null || true
                docker network rm ${NETWORK_NAME} 2>/dev/null || true

                # Create bridge network
                docker network create ${NETWORK_NAME}

                # Run database and backend
                docker run -d --name test-mongo --network ${NETWORK_NAME} mongo:latest
                docker run -d --name test-backend --network ${NETWORK_NAME} -e MONGO_URI=mongodb://test-mongo:27017/nutriflow ${IMAGE_NAME}

                # Allow backend to initialize
                sleep 8

                # Run ZAP baseline scan into the permissioned directory
                docker run --rm -v "$PWD/zap-wrk:/zap/wrk/:rw" --network ${NETWORK_NAME} zaproxy/zap-stable zap-baseline.py -t http://test-backend:8000 -r zap-report.html -I || true

                # Cleanup test containers and network
                docker rm -f test-backend test-mongo 2>/dev/null || true
                docker network rm ${NETWORK_NAME} 2>/dev/null || true
                '''
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}