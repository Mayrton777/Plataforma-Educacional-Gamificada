using Microsoft.EntityFrameworkCore;
using QuizGamificado.Infrastructure.Data;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
using API.Hubs;

DotNetEnv.Env.Load();

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

// Bloco de Reset e Migrations Automáticas
// NOVO: Bloco de Reset e Migrations Automáticas com Proteção contra Race Condition
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<QuizDbContext>();
    
    int tentativas = 5;
    while (tentativas > 0)
    {
        try
        {
            Console.WriteLine($"[TCC INIT] Preparando o banco de dados... ({tentativas} tentativas restantes)");
            
            // Tenta deletar e recriar o banco
            dbContext.Database.EnsureDeleted();
            dbContext.Database.Migrate();
            
            Console.WriteLine("[TCC INIT] Banco de dados pronto e populado com sucesso!");
            break; // Se deu certo, quebra o loop e continua o app!
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[TCC INIT] O SQL Server ainda está iniciando. Aguardando 5 segundos...");
            tentativas--;
            
            if (tentativas == 0)
            {
                Console.WriteLine("[TCC INIT] Falha fatal ao conectar ao banco de dados após 25 segundos.");
                throw; // Se esgotarem as tentativas, deixa o erro estourar
            }
            
            // Pausa a execução do C# por 5 segundos antes de tentar novamente
            System.Threading.Thread.Sleep(5000); 
        }
    }
}

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