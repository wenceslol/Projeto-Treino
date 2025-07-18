# 📌 Projetotreino  
Um aplicativo de gerenciamento de treinos e gastos calóricos, desenvolvido em React Native, Typescript, Node.js e Postgres.  


![Static Badge](https://img.shields.io/badge/Status-Em%20Desenvolvimento-lushgreen)  
[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-yellow)](https://opensource.org/license/mit)  

## Compatibilidade:  
✔️ **Android**  
❌ **IOS**

# 🚀 **Funcionalidades**

✔️ Criação e gerenciamento de treinos – Permite o usuário criar treinos personalizados com múltiplos exercícios de acordo com suas necessidades.  
✔️ Realização de treinos – Permite o usuário registrar dados específicos do treino como carga, séries e repetições dos exercícios ou duração do cardio.  
✔️ Visualização de métricas – O usuário visualiza métricas de gasto calórico de todos os exercícios realizados, organizados por dia.  
❓ Criação e gerenciamento de dietas - Em análise.  
❓ View para treinadores - Em análise.  
❓ Mensageria entre usuários - Em análise.


# 🛠️ **Tecnologias Utilizadas**  
Linguagens: **JavaScript**, **Typescript**.  
Frameworks: **React Native**.  
Banco de Dados: **Postgresql**.  


# 📦 Como Instalar e Executar  
Pré-requisitos  
Node.js (v16+)  
Android 15("VanillaIceCream") x86_64 **Build recomendada**  
Git  
Android Studio(Para emular o ambiente de testes)  

# Passo a Passo
    bash
## Clone o repositório
    git clone https://github.com/wenceslol/projetotreino.git

## Acesse a pasta do projeto
    cd projetotreino

## Instale as dependências
    npm install

## Forneça a base de exercícios
Crie a pasta "assets/data" no root do projeto.
Forneça o arquivo "exercicios.json" contendo a base de exercícios.

## Inicie o Metro
    npm start

## Inicie o Ambiente de desenvolvimento
    npm run android

# 🌐 Como Acessar
🔗 Necessário hospedagem do backend, vide https://github.com/wenceslol/dbprojetotreino  
Após hospedar seu backend, forneça o endereço da sua aplicação e servidor de imagens via env.ts  
Crie um arquivo **env.ts** no diretório principal com o seguinte código:  

    const env: AppEnv = {
      BASE_URL: "https://servidoraqui",
      IMAGES_URL: "https://servidordeimagensaqui/images/",
      ENV: 'development'
    };
    export default env;
E também o arquivo **env.d.ts** na pasta src/types:  

    interface AppEnv {
      BASE_URL: string;
      IMAGES_URL: string;
      ENV: 'development' | 'production';
    }

# 🤝 Como Contribuir  
Como este é um projeto para aprendizado, apenas eu estarei melhorando a branch principal.  
Porém, sintam-se livres para clonar o repositório e utilizarem da maneira que preferirem.

# 📄 Licença  
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.  


#  📬 Contato  
✉️ Email: [wences.dev@gmail.com](mailto:wences.dev@gmail.com)  
🔗 LinkedIn: [Thiago Wenceslau](https://www.linkedin.com/in/thiago-wenceslau/)  
