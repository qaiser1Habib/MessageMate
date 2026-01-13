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
            sh """
            mkdir -p server
            cat > server/.env <<EOF
            PORT=${PORT}
            MONGO_DB_CONNECTION_URL=${MONGO_DB_CONNECTION_URL}
            OPENAI_API_KEY=${OPENAI_API_KEY}
            OPEN_AI_ASSISTANT_ID=${OPEN_AI_ASSISTANT_ID}
            EOF
            """
            }
        }
        stage('build images') {
        steps {
            sh """
            docker build --no-cache -t message-mate-frontend ./frontend \
            --build-arg VITE_API_URL=http://localhost:5010
            docker build -t message-mate-backend ./server
            """
            }
        }


        stage("cleanup") {
        steps {
            sh '''
            echo "Cleaning up old containers..."
            docker compose down || true
            docker container prune -f
            '''
            }
        }


        stage("run with docker compose"){
            steps {
            sh '''
            echo "Starting messageMate app with docker compose..."
            docker compose up -d
            echo "Showing running containers..."
            docker ps
            '''
            }
        }
    }
}