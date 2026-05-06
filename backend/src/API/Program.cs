using Microsoft.EntityFrameworkCore;
using QuizGamificado.Infrastructure.Data;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
using API.Hubs; // Importa a pasta dos Hubs do SignalR

var builder = WebApplication.CreateBuilder(args);

// Configuração de Controllers e proteção contra Loop Infinito
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
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuração Nativa do Swagger/Scalar
builder.Services.AddOpenApi();

// Injeção do Banco de Dados (EF Core)
builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Injeções de Repositório e Serviço
builder.Services.AddScoped<QuizGamificado.Domain.IRepositories.IQuizRepository, QuizGamificado.Infrastructure.Repositories.QuizRepository>();
builder.Services.AddScoped<QuizGamificado.Application.Services.GamificacaoService>();

// Adiciona os serviços do SignalR
builder.Services.AddSignalR();

var app = builder.Build();

// Ativa o CORS
app.UseCors("PermitirFrontend");

// Ativa a interface visual Scalar
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// Mapeia as Rotas da API e do SignalR
app.MapControllers();
app.MapHub<QuizHub>("/quizhub");

app.Run();