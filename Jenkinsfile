pipeline {
    agent any

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pet-adoption-app .'
            }
        }

        stage('Run Container Test') {
            steps {
                sh 'docker run -d -p 5000:5000 pet-adoption-app'
            }
        }
    }
}