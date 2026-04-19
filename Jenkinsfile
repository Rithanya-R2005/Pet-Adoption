pipeline {
    agent any

    environment {
        IMAGE_NAME = "pet-adoption-app"
        CONTAINER_NAME = "pet-adoption-container"
        PORT = "5000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run Container Test') {
            steps {
                sh '''
                docker run -d -p $PORT:$PORT --name $CONTAINER_NAME $IMAGE_NAME
                '''
            }
        }

        stage('Verify Container Running') {
            steps {
                sh '''
                docker ps | grep $CONTAINER_NAME
                '''
            }
        }
    }

    post {
        success {
            echo '✅ BUILD SUCCESS: Docker container is running successfully'
        }
        failure {
            echo '❌ BUILD FAILED: Check console output for errors'
        }
        always {
            echo '🔁 Pipeline execution completed'
        }
    }
}