-- Run using ollama only

ollama run deepseek-r1:1.5b  1.1GB

ollama run deepseek-r1:7b    4.7GB

ollama run deepseek-r1:32b   20GB

ollama run gemma3            3.3GB





-- Run Open Web UI

docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart no ghcr.io/open-webui/open-webui:main


docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=Password_123#" -p 1433:1433 --name sql_server_container -d mcr.microsoft.com/mssql/server


  docker run -d -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=_yourPassw0rd_" -p 1433:1433 -v F:\Docker_volume:/var/opt/mssql --name mssql01 mcr.microsoft.com/mssql/server


docker update --restart=no open-webui


  docker run -d -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=_yourPassw0rd_" -p 1433:1433 -v F:\Docker_volume:/var/opt/mssql --name mssql01 mcr.microsoft.com/mssql/server
