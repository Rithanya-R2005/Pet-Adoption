pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Rithanya-R2005/Pet-Adoption.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pet-adoption-app .'
            }
        }

        stage('Run Container Test') {
            steps {
                sh 'docker run -d -p 5000:5000 pet-adoption-app || true'
            }
        }
    }
}