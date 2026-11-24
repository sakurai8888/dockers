#!/bin/bash
set -e

source /root/.oceanbase-all-in-one/bin/env.sh

DATA_DIR=/data
OBD_HOME=/root/.obd
CLUSTER_NAME=obcluster

mkdir -p "$DATA_DIR"

# Generate host keys on first boot and start sshd (root login is enabled in sshd_config)
ssh-keygen -A >/dev/null 2>&1 || true
/usr/sbin/sshd

# Persist obd cluster metadata inside the mounted volume so the cluster
# can be restarted even after the container is recreated.
if [ ! -L "$OBD_HOME" ]; then
  if [ -d "$OBD_HOME" ]; then
    mv "$OBD_HOME" "$DATA_DIR/.obd"
  else
    mkdir -p "$DATA_DIR/.obd"
  fi
  ln -s "$DATA_DIR/.obd" "$OBD_HOME"
fi

# Observer data lives in /data/1; observer logs are redirected to /data/log1
# via a symlink at {home_path}/log (obd has no separate log-dir option).
mkdir -p /data/1 /data/log1 /data/observer
ln -sfnT /data/log1 /data/observer/log

if obd cluster list | grep -qw "$CLUSTER_NAME"; then
  echo "[entrypoint] Cluster '$CLUSTER_NAME' already deployed, starting..."
  obd cluster start "$CLUSTER_NAME"
else
  echo "[entrypoint] First boot: deploying single-node OceanBase with obproxy..."
  obd cluster deploy "$CLUSTER_NAME" -c /opt/oceanbase/obcluster.yaml
  obd cluster start "$CLUSTER_NAME"
fi

obd cluster display "$CLUSTER_NAME"

echo "[entrypoint] OceanBase is up."
echo "  observer : 127.0.0.1:2881  (mysql -h127.0.0.1 -P2881 -uroot@sys)"
echo "  obproxy  : 127.0.0.1:2883  (mysql -h127.0.0.1 -P2883 -uroot@sys#$CLUSTER_NAME)"

if [ -f /data/log1/observer.log ]; then
  exec tail -F /data/log1/observer.log
else
  exec sleep infinity
fi
