#!/bin/bash
deploy_hard(){
    echo "Hard Deploy Selected" 
    yarn seed --fresh 
    yarn start
}

deploy_soft(){
    echo "Soft deploy Selected"
    yarn start
}
case "${DEPLOY_LEVEL}" in 
    hard) deploy_hard;;
    soft) deploy_soft;;
        *)deploy_soft;;
    esac 
echo "Deploying..."