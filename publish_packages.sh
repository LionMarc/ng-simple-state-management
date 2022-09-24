#!/bin/bash

echo Publishing packages for release $1

packages=( 'ngssm-toolkit' 'ngssm-store' 'ngssm-schematics' 'ngssm-remote-data' 'ngssm-navigation' 'ngssm-ag-grid' )

for package in ${packages[@]}
do
    cd dist/${package}
    npm version $1
    sed -i 's/NGSSM_VERSION/'$1'/g' package.json
    npm publish
    cd -
done