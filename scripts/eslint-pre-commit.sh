#!/usr/bin/env bash

set -eou pipefail

dir=`pwd`

files=()
for file in "$@"
do
    files+=("$dir/$file")
done

cd website
./node_modules/.bin/eslint --cache --fix "${files[@]}"
