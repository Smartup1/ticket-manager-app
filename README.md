# ☀️ Ticket management app ☀️

Código fonte do aplicativo mobile de suporte de T.I., para priorização inteligente e gerenciamento de chamados.

<br>

## Início

Para começar a contribuir neste projeto, é necessário que você clone este repositório em sua máquina, e depois, siga os **passos** abaixo. Antes de executar os comandos, lembre-se de entrar na pasta do projeto, ou eles não vão funcionar.

<br>

1. **Instalar as dependências**

  ```bash
  npm install
  ```

<br>

2. **Instalar o aplicativo Expo Go em seu celular**

    - https://play.google.com/store/apps/details?id=host.exp.exponent&hl=pt_BR&pli=1

<br>

3. **Rodar o aplicativo**

  ```bash
  npx expo start
  ```

  No output, talvez apareçam as opções possíveis para abrir o app:

  - (usaremos esta) -> [Expo Go](https://expo.dev/go)
  - [development build](https://docs.expo.dev/develop/development-builds/introduction/)
  - [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
  - [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

  Após selecionar a opção Expo Go (talvez este passo de selecionar não seja necessário), um QR Code aparecerá no terminal. Escaneie este código usando o aplicativo que você instalou há pouco;

<br>

4. **Rodar os testes**

  ```bash
  npm run test
  ```

<br><br>

## Estrutura do projeto

```
  ├── assets                    // 🖼️ imagens, ícones, e coisas do tipo
  ├── src
  │   ├── app
  │   │   ├── index.tsx
  │   │   └── _layout.tsx
  │   ├── components            // 🧩 componentes reutilizáveis do app
  │   ├── hooks                 // 💭 chamadas de API, e outras integrações
  │   ├── screens               // 📱 telas do app
  │   ├── utils                 // 🛠️ funções pequenas de utilidade comum
  │   ├── constants.ts          // 🪨 valores constantes
  │   └── theme.ts              // 🖌️ cores, fontes, e medidas padrão
  └── app.json                  // ⚙️ configurações do expo
```

<br><br>

## Ajuda

- [Guia básico sobre GitHub](https://www.freecodecamp.org/portuguese/news/o-guia-do-iniciante-para-o-git-e-o-github/)
- [Primeiros passos com React Native](https://reactnative.dev/docs/getting-started)










# 🔐 Fluxo de Autenticação — SmartDesk

## 📌 Visão Geral

O sistema de autenticação do SmartDesk utiliza **JWT (JSON Web Token)** combinado com **AsyncStorage** para manter a sessão do usuário ativa mesmo após o fechamento do aplicativo.

---

## 🧩 Componentes Envolvidos

* **Tela de Login** → `login.tsx`
* **Contexto de Autenticação** → `AuthContext.tsx`
* **Serviço de API** → `authService.ts`
* **Proteção de Rotas** → `_layout.tsx` (RouteGuard)
* **Configuração de API** → `api.ts`

---

## ⚙️ Fluxo de Funcionamento

### 1. 🔑 Login

A autenticação começa na tela de login.

* O usuário insere:

  * Email
  * Senha
* Ao clicar em **"Entrar"**, a função `handleLogin` é executada
* Essa função chama `login()` do contexto
* O contexto chama `authService.login()`, que faz uma requisição:

```http
POST /auth/login
```

* A API retorna:

```json
{
  "token": "jwt_token",
  "user": { "id": 1, "name": "Usuário" }
}
```

---

### 2. 💾 Persistência da Sessão

Após o login bem-sucedido:

* O **token** e os **dados do usuário** são salvos no AsyncStorage:

```ts
await AsyncStorage.setItem("@smartdesk:token", token);
await AsyncStorage.setItem("@smartdesk:user", JSON.stringify(user));
```

Isso permite que o usuário permaneça logado mesmo após fechar o app.

---

### 3. 🔄 Restauração Automática da Sessão

Quando o aplicativo inicia:

* O `AuthProvider` executa um `useEffect`
* Ele tenta recuperar os dados do AsyncStorage:

```ts
const token = await AsyncStorage.getItem("@smartdesk:token");
const user = await AsyncStorage.getItem("@smartdesk:user");
```

* Se existirem dados válidos:

  * O estado global é atualizado
  * O usuário continua autenticado

Durante esse processo:

* `isLoading = true`
* Um **spinner** é exibido para evitar flicker de tela

---

### 4. 🛡️ Proteção de Rotas

A proteção é feita pelo **RouteGuard** em `_layout.tsx`.

* A verificação usa:

```ts
const isAuthenticated = !!token;
```

#### Regras:

* ❌ Não autenticado → redireciona para `/login`
* ✅ Autenticado tentando acessar `/login` → redireciona para `/`
* ✅ Login bem-sucedido → redirecionamento automático

---

### 5. 🌐 Token nas Requisições

O Axios possui um **interceptor** que:

* Lê o token antes de cada requisição
* Adiciona no header:

```http
Authorization: Bearer <token>
```

#### Exemplo:

```ts
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@smartdesk:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

#### Tratamento de erro:

* Se a API retornar **401 (não autorizado)**:

  * O token é removido automaticamente
  * O usuário é deslogado

---

### 6. 🚪 Logout

O logout é gerenciado pelo `AuthContext`.

Fluxo:

1. (Opcional) Chama a API:

```http
POST /auth/logout
```

2. Remove os dados locais:

```ts
await AsyncStorage.removeItem("@smartdesk:token");
await AsyncStorage.removeItem("@smartdesk:user");
```

3. Limpa o estado global

4. O `RouteGuard` detecta:

```ts
isAuthenticated = false
```

5. Redireciona automaticamente para `/login`

---

## 🔐 Segurança e Boas Práticas

* Uso de JWT para autenticação stateless
* Armazenamento local persistente
* Interceptação automática de requisições
* Redirecionamento centralizado (RouteGuard)

---

## 🚀 Possíveis Melhorias

* Uso de **SecureStore** em vez de AsyncStorage
* Refresh Token automático
* Expiração de sessão controlada
* Criptografia de dados locais
* Integração com autenticação biométrica

---

## 📁 Observações

* O fluxo garante persistência e segurança básica
* A navegação é totalmente controlada pelo estado global
* O sistema está preparado para integração com backend real
