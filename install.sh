#!/bin/bash

read -p "GFW? (y/n)" yn
case $yn in
    [Yy]* | "" ) NPM_ARGS="--registry=https://registry.npm.taobao.org";export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/dist;export SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass;;
    [Nn]* ) NPM_ARGS="";;
esac

install_node() {
    export NVM_DIR="$HOME/.nvm"

    if ! [ -s "$NVM_DIR/nvm.sh" ]; then
        echo "instalando nvm... (https://github.com/creationix/nvm)"
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
    fi

    . "$NVM_DIR/nvm.sh"

    echo "instalando node..."

    nvm install --lts
}

# checar o nodejs
if ! [ -x "$(command -v npm)" ]; then
    while true; do
        read -p "npm não está instalado. instalar agora? (y/n)" yn

        case $yn in
            [Yy]* | "" ) install_node; break;;
            [Nn]* ) echo "npm é necessário, certifique-se de que o npm esteja disponível e tente novamente."; exit 1;;
        esac
    done
fi

# npm install $NPM_ARGS -g typescript ts-node @angular/cli

# instalando localide do servidor
echo "instalando servidor..."
( cd server && npm $NPM_ARGS install )
echo "concluído."

# instalando localidade web
echo "instalando web..."
( cd web && npm $NPM_ARGS install )
echo "concluído."

echo "tudo concluído com sucesso."