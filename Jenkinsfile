pipeline {
    agent any

    environment {
        FRONTEND_IMAGE ="message-mate-frontend:jenkins"
        BACKEND_IMAGE ="message-mate-backend:jenkins"
        PORT = "5010"
        MONGO_DB_CONNECTION_URL= "mongodb://mongo:27017/messageMate"

        OPENAI_API_KEY = credentials('openai-api-key')
        OPEN_AI_ASSISTANT_ID = credentials('OPEN_AI_ASSISTANT_ID')
    }

    stages {
        stage('checkout code') {
            steps {
                git url: "https://github.com/qaiser1Habib/MessageMate.git", branch: "main"
            }
        }
        stage('prepare .env') {
            steps {
                sh '''
                mkdir -p server
                cat > server/.env <<EOF
                PORT=${PORT}
                MONGO_DB_CONNECTION_URL=${MONGO_DB_CONNECTION_URL}
                OPENAI_API_KEY=${OPENAI_API_KEY}
                OPEN_AI_ASSISTANT_ID=${OPEN_AI_ASSISTANT_ID}
                EOF
                '''
            }
        }
        stage('build dockers images') {
            steps {
                sh '''
                echo "Building Backend Docker Image..."
                docker build -t ${BACKEND_IMAGE} ./server
                echo "Building Frontend Docker Image..."
                docker build -t ${FRONTEND_IMAGE} ./frontend --build-arg VITE_API_URL=http://localhost:${PORT}
                '''
            }
        }

        stage("run with docker compose"){
            steps {
                sh '''
                echo "starring messageMate app with docker compose..."
                docker compose up -d
                echo "showing running containers..."
                docker ps
                echo "---messageMate backend logs---"
                docker logs backend || true
                echo "---messageMate frontend logs---"
                docker logs frontend || true
                '''
            }
        }
    }
}