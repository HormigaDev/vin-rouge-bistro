# Vin Rouge Bistrô - Sistema de Gerenciamento de Restaurante

Template Vue 3 + Quasar 2.x para gerenciamento de restaurantes de alta gastronomia.

![Vin Rouge Bistrô](public/assets/logo.svg)

## 🎯 Sobre o Projeto

Sistema completo de gerenciamento para restaurantes gourmet com foco em elegância, funcionalidade e experiência do usuário. Desenvolvido como template open-source reutilizável para diversos tipos de negócios premium (restaurantes, hotéis, vinícolas, etc.).

## ✨ Funcionalidades

- **Autenticação**: Login com validação de credenciais (mock)
- **Dashboard**: Visão geral com métricas em tempo real
- **Gerenciamento de Pratos**: CRUD completo com categorias, preços e disponibilidade
- **Controle de Ingredientes**: Gerenciamento de estoque com alertas de baixo estoque
- **Sistema de Comandas**: Mestre/Detalhe com adição e remoção de itens
- **Reservas**: Listagem e gerenciamento de reservas de clientes
- **Design Responsivo**: Otimizado para desktop, tablet e mobile
- **Tema Elegante**: Paleta vermelho borgonha com dourado suave

## 🎨 Design

### Paleta de Cores

- **Primária**: Vermelho Borgonha (#800020)
- **Secundária**: Dourado Suave (#D4A017)
- **Neutra**: Branco Creme (#F5F5F5)
- **Escura**: Cinza Escuro (#333333)

### Tipografia

- **Títulos**: Playfair Display (serif)
- **Corpo**: Roboto (sans-serif)

### Estilo Visual

- Design minimalista com bordas arredondadas
- Sombras suaves e transições elegantes
- Componentes Quasar personalizados
- Interface intuitiva e profissional

## 🚀 Tecnologias

- **Vue 3**: Framework JavaScript progressivo com Composition API
- **Quasar 2.x**: Framework UI com componentes premium
- **Pinia**: Gerenciamento de estado moderno
- **Vue Router**: Navegação SPA
- **Dados Mock**: Sistema simulado sem backend

## 📦 Instalação

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Passos

1. Clone o repositório:

```bash
git clone <repository-url>
cd vin-rouge-bistro
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
quasar dev
```

4. Acesse no navegador:

```
http://localhost:9000
```

## 🔐 Credenciais de Teste

Para acessar o sistema, use qualquer email válido e senha com 8+ caracteres:

- **Email**: chef@vinrougebistro.com
- **Senha**: chef1234

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── Header.vue       # Cabeçalho com navegação
│   ├── Sidebar.vue      # Menu lateral
│   ├── DishCard.vue     # Card de prato
│   └── OrderModal.vue   # Modal de itens da comanda
├── pages/               # Páginas da aplicação
│   ├── Login.vue        # Tela de login
│   ├── Dashboard.vue    # Dashboard principal
│   ├── DishesList.vue   # Listagem de pratos
│   ├── DishForm.vue     # Formulário de prato
│   ├── IngredientsList.vue
│   ├── IngredientForm.vue
│   ├── OrdersList.vue
│   ├── OrderDetails.vue # Mestre/Detalhe
│   └── ReservationsList.vue
├── stores/              # Gerenciamento de estado
│   ├── auth.js          # Store de autenticação
│   ├── mock.js          # Dados e funções mock
│   └── index.js         # Configuração Pinia
├── router/              # Configuração de rotas
│   ├── index.js
│   └── routes.js
├── css/                 # Estilos globais
│   ├── app.scss
│   └── quasar.variables.scss
├── layouts/
│   └── MainLayout.vue   # Layout principal
└── App.vue
```

## 🎯 Funcionalidades Principais

### 1. Login

- Validação de email e senha
- Armazenamento de token no localStorage
- Redirecionamento automático

### 2. Dashboard

- Cards com métricas principais
- Ações rápidas
- Alertas de estoque baixo
- Resumo financeiro

### 3. Pratos (CRUD)

- Listagem com filtros (nome, categoria, disponibilidade)
- Visualização em cards ou tabela
- Formulário com validações completas
- Upload simulado de imagem
- Seleção de ingredientes

### 4. Ingredientes (CRUD)

- Controle de estoque
- Alerta visual para estoque baixo
- Cálculo de valor total em estoque
- Múltiplas unidades de medida

### 5. Comandas (Mestre/Detalhe)

- Visualização de detalhes completos
- Adição/remoção de itens
- Atualização de status
- Cálculo automático de totais

### 6. Reservas

- Listagem com filtros
- Criação e edição de reservas
- Confirmação rápida
- Campos para observações

## 🛠️ Personalização

### Mudar Cores

Edite `src/css/quasar.variables.scss`:

```scss
$primary: #sua-cor-primaria;
$secondary: #sua-cor-secundaria;
```

### Adicionar Dados Mock

Edite `src/stores/mock.js` para adicionar mais pratos, ingredientes, etc:

```javascript
export let dishes = [
  { id: 1, name: 'Novo Prato', category: 'Principal', price: 50.00, ... }
]
```

### Mudar Informações do Restaurante

Atualize os componentes:

- `Header.vue`: Nome e logo
- `Sidebar.vue`: Menu e informações
- `Login.vue`: Branding

### Adicionar Novos Módulos

1. Crie nova rota em `src/router/routes.js`
2. Crie componente em `src/pages/`
3. Adicione item no menu em `Sidebar.vue`
4. Adicione funções mock em `src/stores/mock.js`

## 📱 Responsividade

O sistema é totalmente responsivo com breakpoints:

- **Mobile**: < 600px
- **Tablet**: 600px - 1024px
- **Desktop**: > 1024px

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Compila para produção
npm run lint         # Executa linter
```

## 🌟 Componentes Quasar Utilizados

- `q-layout`, `q-header`, `q-drawer`: Estrutura
- `q-page`, `q-card`: Containers
- `q-table`: Tabelas de dados
- `q-form`, `q-input`, `q-select`: Formulários
- `q-btn`, `q-icon`: Interação
- `q-dialog`, `q-menu`: Modais
- `q-badge`, `q-chip`: Indicadores
- `q-notify`: Notificações

## 📄 Licença

MIT License - Sinta-se livre para usar este template em projetos pessoais ou comerciais.

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🎓 Template para Trabalhos Universitários

Este projeto foi desenvolvido como template para trabalhos acadêmicos, demonstrando:

- Arquitetura Vue 3 moderna
- Boas práticas de código
- Design profissional
- Sistema CRUD completo
- Relação Mestre/Detalhe
- Gerenciamento de estado
- Roteamento SPA

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando Vue 3 + Quasar Framework**

_Vin Rouge Bistrô - Onde a tecnologia encontra a alta gastronomia_
