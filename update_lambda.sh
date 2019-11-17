#!/bin/bash
zip -r deployment.zip .
aws lambda update-function-code --function-name alexa-skill-BCIT-pal --zip-file fileb://deployment.zip
rm deployment.zip
