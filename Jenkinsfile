pipeline {
    agent any

    environment {
        BRANCH_NAME = "main"
        IMAGE_NAME = "pet-adoption-app"
        CONTAINER_NAME = "pet-adoption-container"
    }

    stages {

        stage('Checkout Code (main branch)') {
            steps {
                // Clean workspace to avoid git errors
                deleteDir()

                // Explicitly checkout MAIN branch
                git branch: 'main', url: 'https://github.com/Rithanya-R2005/Pet-Adoption.git'
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
                sh 'docker run -d -p 5000:5000 --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo 'BUILD SUCCESS: Application is running in Docker container'
        }
        failure {
            echo 'BUILD FAILED: Check console output'
        }
    }
}