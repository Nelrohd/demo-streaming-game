# specify the node base image with your desired version node:<version>
FROM amazonlinux:2

WORKDIR /app

ENV NODE_VERSION 14.13.0

RUN yum update -y
RUN yum upgrade -y
RUN yum -y update && \
  yum -y install wget && \
  yum -y install tar && \
  yum -y install gzip && \
  yum -y install which && \
  yum -y install make gcc* && \
  yum -y install zip && \
  yum -y install python3 && \
  yum -y install git && \
  yum -y install curl && \
  yum clean all

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
RUN /bin/bash -c "source /root/.nvm/nvm.sh; nvm install ${NODE_VERSION}"
RUN { \
  echo 'export NVM_DIR=~/.nvm'; \
  echo '. ~/.nvm/nvm.sh'; \
  } > /root/.bashrc
RUN /bin/bash -c "source /root/.nvm/nvm.sh; nvm use ${NODE_VERSION}"

RUN cd /app && mkdir stealth

EXPOSE 3000


