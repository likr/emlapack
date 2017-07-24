#!/bin/bash

set -euxo pipefail

DEFAULT_EMLAPACK_DIST_DIR=/tmp/emlapack/dist
EMLAPACK_DIST_DIR="${EMLAPACK_DIST_DIR:=$DEFAULT_EMLAPACK_DIST_DIR}"

docker build . --tag=emlapack
exec docker run --rm -it -v `pwd`:"${EMLAPACK_DIST_DIR}" emlapack
