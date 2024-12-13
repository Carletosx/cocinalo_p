version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 18.18.2
        - npm ci --legacy-peer-deps
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .npm/**/*