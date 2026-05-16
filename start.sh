#!/bin/bash
echo "Configurando límites del sistema..."
sudo sysctl -w kern.maxfiles=524288 2>/dev/null
sudo sysctl -w kern.maxfilesperproc=524288 2>/dev/null
ulimit -n 524288 2>/dev/null || ulimit -n 65536
echo "Iniciando Expo con túnel..."
npx expo start --tunnel
