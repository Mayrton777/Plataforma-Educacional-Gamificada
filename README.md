# Plataforma Educacional Gamificada (TCC)

Este repositório contém o código-fonte da plataforma educacional gamificada desenvolvida como Trabalho de Conclusão de Curso (TCC) em Ciência da Computação. O sistema permite a criação de questionários interativos em tempo real, baseando-se em metodologias ativas e gamificação para aumentar o engajamento escolar.

## 🏗️ Arquitetura do Sistema

O projeto foi construído sob uma arquitetura Cliente-Servidor conteinerizada, com separação estrita de responsabilidades (*Separation of Concerns*). O back-end segue os princípios da **Clean Architecture** (Arquitetura Limpa), garantindo que as regras de negócio fiquem isoladas de frameworks e detalhes de infraestrutura.

### 🌳 Árvore de Diretórios

```text
/
├── docker-compose.yml          # Orquestração dos contêineres (Banco de Dados, API e Front-end)
│
├── backend/                    # Solução .NET 9 (Back-end)
│   ├── Dockerfile              # Instruções de construção da imagem do back-end
│   ├── QuizGamificado.sln
│   ├── src/
│   │   ├── API/                # Camada de Apresentação: Controllers (REST), SignalR Hubs (WebSockets) e injeção de dependências.
│   │   ├── Application/        # Camada de Aplicação: Casos de uso, DTOs e serviços de negócio (ex: gamificação e cálculo de pontos).
│   │   ├── Domain/             # Camada de Domínio: Entidades puras do sistema (UsuarioEducador, Participante, Quiz) e interfaces.
│   │   └── Infrastructure/     # Camada de Infraestrutura: Acesso a dados (Entity Framework Core), repositórios e serviço SMTP.
│   └── tests/                  # Testes unitários e de integração
│
└── frontend/                   # Projeto React (Front-end)
    ├── Dockerfile              # Instruções de construção e serviço da imagem do front-end
    ├── package.json
    └── src/
        ├── assets/             # Recursos estáticos (imagens, ícones)
        ├── components/         # Componentes React reutilizáveis (Botões, Temporizador, Cards, Navbar)
        ├── pages/              # Páginas completas (Identificação, Painel Host, Lobby, Jogo)
        ├── services/           # Comunicação Híbrida: chamadas RESTful (axios/fetch) e conexão persistente SignalR.
        ├── App.jsx             # Roteamento principal e gestão de rotas protegidas
        └── main.jsx            # Ponto de entrada da aplicação React
```

## 🚀 Tecnologias Utilizadas

### Front-end:

* React (via Vite)
* JavaScript / JSX
* CSS3 / HTML5 (Design Mobile-First)

### Back-end:

* C#
* .NET 9 (ASP.NET Core Web API)
* Entity Framework Core (Abordagem Code-First)

### Infraestrutura e Dados:

* Microsoft SQL Server
* Docker e Docker Compose

## ⚙️ Como executar o projeto

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
2. Clone este repositório:
```bash
git clone [https://github.com/Mayrton777/Plataforma-Educacional-Gamificada.git](https://github.com/Mayrton777/Plataforma-Educacional-Gamificada.git)
```
3. Navegue até a pasta raiz do projeto e inicie os contêineres:
```bash
docker compose up -d --build
```
4. Acesse a aplicação front-end através do navegador (geralmente em `http://localhost:5173`).
5. A documentação interativa da API (Scalar) estará disponível em `ttp://localhost:5092/scalar/v1`.

## 👨‍💻 Autor

### Mayrton Eduardo Silva Rocha

Graduando em Ciência da Computação