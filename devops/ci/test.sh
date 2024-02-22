#!/bin/bash

#Seta o script para ser verboso (-x) e permite que a execução do script retorne um erro caso de problema (-e)
set -e
set -x

#Posiciona na raíz do repositório TAF-THF dentro da área de trabalho do Drone
cd /totvs/drone/taf-thf

#Remove arquivos e diretórios (rm) de forma recursiva (-r) e sem necessidade de confirmações (-f)
rm -r -f /totvs/drone/taf-thf/release

#Cria diretório (mkdir) mesmo que o diretório pai não exista (-p)
mkdir -p /totvs/drone/taf-thf/release

#Lista os arquivos e subdiretórios (ls) mostrandos todos arquivos (-a) e exibindo tipo, tamanho e outras informações (-l)
ls -la

#Instala a angular-erp-integration baixando do npm da TOTVS
npm i angular-erp-integration@1.2.7 --registry https://npm.engpro.totvs.com.br

#Instala as dependências
npm install -n && npm install -n -g @angular/cli@14.2.10

#Executa os testes e gera o coverage
ng test --source-map --code-coverage --no-watch

#Zipa a pasta de coverage salvando na pasta de release com o nome de coverage.zip
zip -r /totvs/drone/taf-thf/release/coverage.zip coverage

#Lista os arquivos e subdiretórios (ls) mostrandos todos arquivos (-a) e exibindo tipo, tamanho e outras informações (-l)
ls -la
