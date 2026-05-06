# Plataforma Educacional Gamificada (TCC)

Este repositório contém o código-fonte da plataforma educacional gamificada desenvolvida como Trabalho de Conclusão de Curso (TCC) em Ciência da Computação. O sistema permite a criação de questionários interativos em tempo real, baseando-se em metodologias ativas e gamificação para aumentar o engajamento escolar.

## 🏗️ Arquitetura do Sistema

O projeto foi construído sob uma arquitetura Cliente-Servidor conteinerizada, com separação estrita de responsabilidades (*Separation of Concerns*). O back-end segue os princípios da **Clean Architecture** (Arquitetura Limpa), garantindo que as regras de negócio fiquem isoladas de frameworks e detalhes de infraestrutura.

### 🌳 Árvore de Diretórios

```text
/
├── docker-compose.yml          # Orquestração dos contêineres (Banco, API e Front)
│
├── backend/                    # Solução .NET 9 (Back-end)
│   ├── QuizGamificado.sln
│   ├── src/
│   │   ├── API/                # Camada de Apresentação: Controllers, rotas RESTful e injeção de dependências.
│   │   ├── Application/        # Camada de Aplicação: Casos de uso, DTOs e serviços de negócio (ex: cálculo de pontos).
│   │   ├── Domain/             # Camada de Domínio: Entidades puras do sistema (Aluno, Quiz, Pergunta) e interfaces.
│   │   └── Infrastructure/     # Camada de Infraestrutura: Acesso a dados (Entity Framework Core), repositórios e banco.
│   └── tests/                  # Testes unitários e de integração
│
└── frontend/                   # Projeto React (Front-end)
    ├── Dockerfile
    ├── package.json
    └── src/
        ├── assets/             # Recursos estáticos (imagens, ícones)
        ├── components/         # Componentes React reutilizáveis (Botões, Temporizador, Cards)
        ├── pages/              # Páginas completas (Dashboard Educador, Lobby, Quiz em andamento)
        ├── services/           # Comunicação com a API RESTful (axios/fetch)
        ├── App.jsx             # Roteamento principal
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