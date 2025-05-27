-- Run using ollama only

ollama run deepseek-r1:1.5b  1.1GB

ollama run deepseek-r1:7b    4.7GB

ollama run deepseek-r1:32b   20GB

ollama run gemma3            3.3GB





-- Run Open Web UI

docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main