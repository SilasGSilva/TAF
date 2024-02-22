#!/bin/sh

#Seta o script para ser verboso (-x) e permite que a execução do script retorne um erro caso de problema (-e)
set -e
set -x

#Posiciona na raíz do repositório TAF-THF dentro da área de trabalho do Drone
cd /totvs/drone/taf-thf

#Lista os arquivos e subdiretórios (ls) mostrandos todos arquivos (-a) e exibindo tipo, tamanho e outras informações (-l)
ls -la

#Instala as dependências
npm install -n && npm install -n -g @angular/cli@14.2.10

#Move arquivos necessários a Impressão em PDF para posteriormente serem buildados via PdfMake
mv /totvs/drone/taf-thf/src/assets/pdfmake_resources /totvs/drone/taf-thf/node_modules/pdfmake

#Posiciona no diretório e realiza build de arquivos para incorporá-los na geração de PDF via PdfMake
cd /totvs/drone/taf-thf/node_modules/pdfmake
node build-vfs.js pdfmake_resources

#Realiza o build como produção
ng build --configuration production

#Move arquivo setVersion do diretório devops/ci para assets/data
mv /totvs/drone/taf-thf/devops/ci/setVersion.js /totvs/drone/taf-thf/dist/taf-thf/assets/data/setVersion.js

#Posiciona no diretório assets/data
cd /totvs/drone/taf-thf/dist/taf-thf/assets/data

#Executa script setVersion passando variável de tag do Drone
node setVersion.js ${GIT_TAG}

#Remove arquivo setVersion.js
rm setVersion.js

#Exibe o conteúdo do arquivo no terminal
cat appConfig.json

#Posiciona na raíz do repositório TAF-THF dentro da área de trabalho do Drone
cd /totvs/drone/taf-thf

#Renomeia o dist para tafa552
mv dist/taf-thf tafa552

#Zipa tafa552 como tafa552.zip
zip -r /totvs/drone/taf-thf/tafa552.zip tafa552

#Renomeia tafa552.zip para tafa552.app e move para release
mv /totvs/drone/taf-thf/tafa552.zip /totvs/drone/taf-thf/release/tafa552.app

#Lista os arquivos e subdiretórios (ls) mostrandos todos arquivos (-a) e exibindo tipo, tamanho e outras informações (-l)
ls -la
