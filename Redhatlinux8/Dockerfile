FROM registry.access.redhat.com/ubi8/ubi:latest

# Install core system diagnostic tools and OpenSSH
RUN dnf install -y \
    iputils \
    net-tools \
    procps-ng \
    openssh-server \
    openssh-clients && \
    dnf clean all

# Generate SSH host keys, set root password, and allow root login
RUN ssh-keygen -A && \
    echo "root:YourPassword123!" | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#PermitRootLogin yes/PermitRootLogin yes/' /etc/ssh/sshd_config

EXPOSE 22

# Automatically launch sshd in foreground mode
CMD ["/usr/sbin/sshd", "-D"]