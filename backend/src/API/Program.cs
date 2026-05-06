using Microsoft.EntityFrameworkCore;
using QuizGamificado.Infrastructure.Data;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Adiciona o suporte para Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Impede o loop infinito na hora de gerar o JSON das entidades do EF Core
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Adiciona o suporte para Controllers e resolve o problema de Loop Infinito do JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        // O Vite/React para a porta 5173 padrão
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Configuração Nativa do Swagger para documentação da API
builder.Services.AddOpenApi();

// Injeção de Dependência do Banco de Dados (EF Core)
builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Injeção do Repositório e Serviço
builder.Services.AddScoped<QuizGamificado.Domain.IRepositories.IQuizRepository, QuizGamificado.Infrastructure.Repositories.QuizRepository>();
builder.Services.AddScoped<QuizGamificado.Application.Services.GamificacaoService>();

var app = builder.Build();

// Ativa a política de CORS
app.UseCors("PermitirFrontend");

// Ativa a interface visual Scalar para explorar a API
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Configuração das rotas
app.MapControllers();

app.Run();