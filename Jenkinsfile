pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pet-adoption-app .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh 'docker rm -f pet-adoption-container || true'
            }
        }

        stage('Run Container Test') {
            steps {
                sh 'docker run -d -p 5000:5000 --name pet-adoption-container pet-adoption-app'
            }
        }
    }
}