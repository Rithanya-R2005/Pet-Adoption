pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Rithanya-R2005/Pet-Adoption.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t pet-adoption-app .'
            }
        }

        stage('Run Container Test') {
            steps {
                sh 'docker run -d -p 3000:3000 pet-adoption-app'
            }
        }
    }
}