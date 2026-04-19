pipeline {
    agent any

    environment {
        IMAGE_NAME = "pet-adoption-app"
        CONTAINER_NAME = "pet-adoption-container"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh 'docker rm -f $CONTAINER_NAME || true'
            }
        }

        stage('Run Container Test') {
            steps {
                sh 'docker run -d -P --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }

        stage('Verify Container Running') {
            steps {
                sh 'docker ps | grep $CONTAINER_NAME'
            }
        }
    }

    post {
        success {
            echo '✅ BUILD SUCCESS: Container running'
        }
        failure {
            echo '❌ BUILD FAILED'
        }
    }
}