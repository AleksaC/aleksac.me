#!/usr/bin/env bash

set -eou pipefail

cd "$(dirname "$0")"
cd ../website

if [ "$#" -gt 2 ]; then
    echo "Wrong number of arguments!"
    exit 1
fi

if [ "$#" -eq 2 ]; then
    if [ "$1" = "--til" ]; then
        cd _til
        shift
    elif [ "$2" = "--til" ]; then
        cd _til
    else
        echo "When providing more than 1 argument one of them has to be `--til`!"
        exit 1
    fi
else
    cd _posts
fi

slugify () {
    echo "$1" \
        | iconv -c -t ascii//TRANSLIT \
        | sed -E 's/[~^]+//g' \
        | sed -E 's/[^a-zA-Z0-9]+/-/g' \
        | sed -E 's/^-+|-+$//g' \
        | tr A-Z a-z
}

to_title_case() {
    local res=""
    for f in "$@"; do
        case $f in
            a|the|is|of|and|or|but|about|to|in|by) res+="${f} ";;
            A|The|Is|Of|And|Or|But|About|To|In|By) res+="${f,,} ";;
            *) res+="${f^} ";;
        esac
    done
    # remove trailing whitespace
    echo -n ${res:0:$((${#res}-1))}
}

filename=$(slugify "$1").md

cat <<-EOF > $filename
---
title: "$(to_title_case $1)"
excerpt: ""
coverImage: ""
date: "$(date -I'seconds' -u)"
draft: true
meta:
  ogImage: ""
---
EOF

code $filename
