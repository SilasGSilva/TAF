[![Build Status](https://drone.engpro.totvs.com.br/api/badges/totvs-automacao-fiscal/taf-thf/status.svg)](https://drone.engpro.totvs.com.br/totvs-automacao-fiscal/taf-thf)

# Painéis eSocial e Reinf

Os Painéis eSocial e Reinf são um projeto que possui como objetivo tornar mais eficiente e agradável a experiência do usuário no cumprimento das obrigações do eSocial e Reinf , trazendo mais facilidades na gestão de configuração, melhor performance e melhor usabilidade na execução dos processos utilizando a biblioteca de componentes [PO UI](https://po-ui.io).

Documentação do Painel Reinf: https://tdn.totvs.com/x/f6GGHw

Documentação do Painel eSocial: https://tdn.totvs.com/x/yqOGHw

---

## Instalação

### Requisitos:

[`Node`](https://nodejs.org)
[`Angular 14`](https://angular.io):

```
npm i -g @angular/cli@14.2.10
```

### Ação :clapper:

Clonar repositório:
```
git clone https://code.engpro.totvs.com.br/totvs-automacao-fiscal/taf-thf.git
```

Acessar a pasta taf-thf e instalar as dependencias:
```
cd taf-thf
```

### Dependências do projeto:

Realizar login na plataforma onde se hospedam as bibliotecas internas TOTVS:
```
npm login --registry https://npm.totvs.io
```

[`Angular-ERP Integration`](https://npm.totvs.io/-/web/detail/angular-erp-integration):
```
npm i angular-erp-integration --registry https://npm.totvs.io
```

Instalação das demais dependências do projeto:
```
npm i
```

### Build de artefatos usados na geração de PDF (opcional):

Através da biblioteca externa [`pdfmake`](http://pdfmake.org), é possível realizar build de imagens e outros artefatos para usá-los na composição de arquivos PDF do projeto. Painéis como 'Emissão Formulário CAT' contém imagens buildadas para geração do respectivo PDF e os passos abaixo devem ser executados na preparação do ambiente de desenvolvimento a fim de garantir o correto funcionamento caso uma geração de PDF seja requisitada na jornada.

Estes arquivos em seu formato original ficam localizados no diretório: taf-thf\src\assets\pdfmake_resources

Deve-se mover o diretório pdfmake_resources mencionado acima para dentro do diretório: taf-thf\node_modules\pdfmake

Para realizar o build dos artefatos e poder referenciá-los por nome no desenvolvimento da geração do PDF, deve-se executar o comando abaixo posicionado no diretório taf-thf\node_modules\pdfmake
```
node build-vfs.js pdfmake_resources
```

Mais informações vide documentação da biblioteca pdfmake sobre o build de arquivos: [`VIA VIRTUAL FILE SYSTEM (VFS)`](https://pdfmake.github.io/docs/0.1/fonts/custom-fonts-client-side/vfs)

---

## Execução

### Testes

Execução com browse externo mostrando os resultados:
```
ng test --browsers=Chrome --code-coverage
```

Execução diretamente pelo console bash:
```
ng test --source-map --code-coverage
```

### Por navegador:

Indicar o local do servidor de backend para consumo de APIs na chave serverBackend do arquivo appConfig.json localizado no diretório: taf-thf\src\assets\data

Subir serviço de acordo com o escopo de uso que você deseja utilizar:
```
Para eSocial: ng serve -c esocial
(-c esocial indica o arquivo .ts que injeta automaticamente na sessionStorage as chaves necessárias para renderização do Painel eSocial)
```
```
Para Reinf: ng serve -c reinf
(-c reinf indica o arquivo .ts que injeta automaticamente na sessionStorage as chaves necessárias para renderização do Painel Reinf)
```
```
Sem escopo: ng serve
```

Acessar a aplicação por meio do seu navegador na porta definida

### Pelo Protheus:

Realizar o build do projeto:
```
ng build
```

Realizar as seguintes operações de forma unitária e na ordem informada abaixo:
- Acessar diretório taf-thf/dist
- Renomear a pasta taf-thf para tafa552
- Compactar a pasta tafa552 para arquivo tafa552.zip
- Renomear o arquivo tafa552.zip para tafa552.app
- Compilar arquivo tafa552.app no repositório Protheus