FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv git && \
    rm -rf /var/lib/apt/lists/*