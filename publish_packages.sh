#!/bin/bash

echo Publishing packages for release $1

packages=( 'ngssm-toolkit' )

for package in ${packages[@]}
do
    cd dist/${package}
    npm version $1
    npm publish
    cd -
done