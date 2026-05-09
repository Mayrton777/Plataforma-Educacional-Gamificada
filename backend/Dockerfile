# Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia tudo para dentro do container
COPY . .

# Restaura as dependências e compila em modo Release
RUN dotnet restore "src/API/QuizGamificado.API.csproj"
RUN dotnet publish "src/API/QuizGamificado.API.csproj" -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expõe a porta padrão do .NET
EXPOSE 8080

# Inicia a aplicação
ENTRYPOINT ["dotnet", "QuizGamificado.API.dll"]