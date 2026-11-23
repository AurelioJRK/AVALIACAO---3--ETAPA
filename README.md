    Meu Treino

  Descrição

O Meu Treino é um aplicativo feito em React Native para ajudar a organizar e acompanhar exercícios físicos. Com ele, o usuário pode registrar seus exercícios, verificar as séries realizadas, informar o peso usado e acompanhar o progresso do treino.

    Funcionalidades

- Cadastro de exercícios com nome, quantidade de séries e repetições.
- Edição e remoção de exercícios cadastrados.
- Listagem dos exercícios usando FlatList.
- Marcação individual das séries completadas.
- Registro do peso usado em cada exercício.
- Acompanhamento do progresso do treino.
- Navegação entre as telas Início e Treino.
- Lembretes diários para o horário do treino.
- Validação dos campos obrigatórios.

      Persistência de dados

O aplicativo usa o expo-file-system para armazenar as informações dos exercícios em um arquivo JSON no armazenamento interno do dispositivo.

Os dados são carregados automaticamente ao iniciar o aplicativo. Isso garante que os exercícios registrados e suas mudanças sejam mantidos mesmo após fechar e abrir o aplicativo novamente.

    Recurso nativo utilizado

Foi implementado um sistema de notificações locais com a biblioteca expo-notifications.

O usuário pode escolher um horário para receber um lembrete diário sobre o treino. O aplicativo pede permissão para enviar notificações e também permite cancelar os lembretes programados.

    Tecnologias e bibliotecas utilizadas

  - React Native: desenvolvimento da interface do aplicativo.

 - Expo: ambiente e ferramentas para execução do projeto.

 - TypeScript: tipagem dos dados e propriedades dos componentes.

 - React: biblioteca utilizada na construção da aplicação.

 - expo-file-system: armazenamento local dos exercícios em arquivo JSON.

 - expo-notifications: criação e gerenciamento dos lembretes diários.

 - expo-status-bar: configuração da barra de status do dispositivo.

 - useState e useEffect: gerenciamento de estados e execução de efeitos no aplicativo.

        Instalação e execução

   1. Pré-requisitos

- Node.js instalado.
- Expo Go instalado no celular.
- Projeto baixado ou clonado para o computador.

  2. Instalar as dependências

Abra o terminal na pasta principal do projeto e execute:

```bash
npm install
```

  3. Iniciar o projeto

No Windows, execute:

```powershell
npx.cmd expo start
```

Se necessário, use o comando abaixo para limpar o cache:

```powershell
npx.cmd expo start -c
```

  4. Executar no celular

- Abra o Expo Go no celular.
- Confira se o computador e o celular estão conectados à mesma rede Wi-Fi.
- Escaneie o QR Code exibido no terminal ou navegador.
- Aguarde o aplicativo carregar.

