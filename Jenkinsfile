pipeline {
    agent any

    environment {
        IMAGE_NAME = "pet-adoption-app"
        CONTAINER_NAME = "pet-adoption-container"
        DOCKERHUB_USER = "rithanya2005"
        IMAGE_TAG = "${DOCKERHUB_USER}/pet-adoption-app:latest"
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "Cleaning workspace..."
                deleteDir()
            }
        }

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

        stage('Tag Image') {
            steps {
                sh 'docker tag $IMAGE_NAME $IMAGE_TAG'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                sh 'docker push $IMAGE_TAG'
            }
        }

        stage('Run Container Test') {
            steps {
                sh 'docker rm -f $CONTAINER_NAME || true'
                sh 'docker run -d -P --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }
    }

    post {
        success {
            echo '✅ CI COMPLETE: Image pushed to Docker Hub & container running'
        }
        failure {
            echo '❌ BUILD FAILED'
        }
    }
}