FROM rockylinux:9

ENV LANG=en_US.UTF-8 \
    TZ=Asia/Hong_Kong

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN dnf install -y epel-release && \
    dnf install -y \
        libaio numactl-libs tar gzip unzip which curl wget \
        net-tools iproute procps-ng sysstat \
        openssh-server openssh-clients \
        python3 vim-minimal less \
    && dnf clean all

# Root login over SSH
RUN echo 'root:Aa12345678' | chpasswd && \
    sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Install OceanBase all-in-one package
# (provides obd, ob-deploy plugin and a local yum mirror for oceanbase-ce / obproxy-ce)
RUN curl -fsSL https://obbusiness-private.oss-cn-shanghai.aliyuncs.com/download-center/opensource/oceanbase-all-in-one/installer.sh -o /tmp/installer.sh && \
    bash /tmp/installer.sh && \
    rm -f /tmp/installer.sh && \
    echo "source /root/.oceanbase-all-in-one/bin/env.sh" >> /root/.bashrc

ENV PATH=/root/.oceanbase-all-in-one/bin:$PATH

COPY obcluster.yaml /opt/oceanbase/obcluster.yaml
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

VOLUME /data

EXPOSE 22 2881 2882 2883 2884

ENTRYPOINT ["/entrypoint.sh"]
