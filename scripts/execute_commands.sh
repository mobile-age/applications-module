#!/bin/bash

. scripts/container_actions.sh

$1 $2 $3 $4
x=$?
echo $x