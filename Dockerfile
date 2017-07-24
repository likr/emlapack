FROM apiaryio/emcc:latest

ENV EMLAPACK_DIR=/emlapack \
    CLAPACK_VERSION=3.2.1

ENV EMLAPACK_DIST_DIR="${EMLAPACK_DIR}/dist"

WORKDIR "${EMLAPACK_DIR}"

RUN set -ex \
    && apt-get update -y \
    && apt-get install -y \
      build-essential \
      wget \
      vim \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

RUN wget "http://www.netlib.org/clapack/clapack-${CLAPACK_VERSION}.tgz" -O /tmp/clapack.tgz \
  && tar xvf /tmp/clapack.tgz \
  && mv "CLAPACK-${CLAPACK_VERSION}" clapack \
  && cp clapack/make.inc.example clapack/make.inc \
  && cd clapack/F2CLIBS/libf2c \
  && make all \
  && rm -rf /tmp/clapack.tgz \
  && cd "${EMLAPACK_DIR}" \
  && \
    ( \
      grep -Fxq '#include "stdio.h"' clapack/BLAS/SRC/xerbla.c \
      || \
      sed -i '1i #include "stdio.h"' clapack/BLAS/SRC/xerbla.c \
    )

COPY package.json .

RUN npm install

COPY . .

RUN chmod +x scripts/custom_build.sh

VOLUME "${EMLAPACK_DIST_DIR}"

CMD "${EMLAPACK_DIR}/scripts/custom_build.sh"
