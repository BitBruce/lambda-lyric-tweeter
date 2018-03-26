# Lambda Lyric Tweeter
==============================

**Note: I am not planning on developing this project as I don't see anyone actually using this, but if you're interested send me a message if you have questions!**

Installing and running locally
------------------------------
1. npm install (will install packages listed in package-lock.json)
2. node index-test.js (TODO: create)

Uploading code to AWS Lambda
------------------------------
1. Archive files (not the whole folder): index.js, contentful_config.js, contentful_management-config.js, twit-artist-config.js, node_modules)
2. Note: AWS Lambda currently supports Node.js 6.10 and therefore ES5, so you can't use async/await :(

INFO
------------------------------
Tweets an artist's lyric from a Contentful repository when called by a Cloudwatch rule where the event is JSON of an artist's name matching the artist name in Contentful.

README TODO
------------------------------
- Instructions on how to set up AWS Lambda + Cloudwatch rules

CODE TODO
------------------------------
- Script to archive files and push to Lambda
- Lambda environment variables (https://aws.amazon.com/blogs/aws/new-for-aws-lambda-environment-variables-and-serverless-application-model/)
- Pull lyrics from Genius
