#!/bin/bash
PROJECT_MODULES_PATH=`cd ../modules && pwd`

export PROJECT_PATH=`cd .. && pwd`
export NODE_PATH=$PROJECT_MODULES_PATH

cd $PROJECT_PATH && node app.js