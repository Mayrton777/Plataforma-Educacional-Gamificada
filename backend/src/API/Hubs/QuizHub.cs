using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace API.Hubs;

public class JogadorNaSala
{
    public string Nome { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public int Pontuacao { get; set; }
    public int TempoTotal { get; set; }
    public bool Finalizou { get; set; }
}

public class SalaAtiva
{
    public string Codigo { get; set; } = string.Empty;
    public string QuizId { get; set; } = string.Empty;
    public bool AbertaParaConexoes { get; set; } = true;
    
    // Lista segura em tempo real de todos os jogadores
    public ConcurrentDictionary<string, JogadorNaSala> Jogadores { get; set; } = new();
}

public class QuizHub : Hub
{
    private static readonly ConcurrentDictionary<string, SalaAtiva> Salas = new();

    public async Task AbrirSala(string codigoSala, string quizId)
    {
        Salas.TryAdd(codigoSala, new SalaAtiva { Codigo = codigoSala, QuizId = quizId });
        await Groups.AddToGroupAsync(Context.ConnectionId, codigoSala + "_host");
    }

    public async Task EntrarNaSala(string codigoSala, string nomeUsuario, string avatar)
    {
        if (!Salas.TryGetValue(codigoSala, out var sala))
        {
            await Clients.Caller.SendAsync("ErroConexao", "Sala não encontrada.");
            return;
        }

        if (!sala.AbertaParaConexoes)
        {
            await Clients.Caller.SendAsync("ErroConexao", "Partida já iniciada ou encerrada!");
            return;
        }

        await Groups.AddToGroupAsync(Context.ConnectionId, codigoSala);
        await Clients.Group(codigoSala + "_host").SendAsync("NovoJogadorConectado", nomeUsuario, avatar);
    }

    public async Task IniciarPartida(string codigoSala)
    {
        if (Salas.TryGetValue(codigoSala, out var sala))
        {
            sala.AbertaParaConexoes = false; 
            await Clients.Group(codigoSala).SendAsync("PartidaIniciada", sala.QuizId);
        }
    }

    public async Task ReingressarNoJogo(string codigoSala)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, codigoSala);
    }

    public async Task AtualizarPontuacao(string codigoSala, string nomeUsuario, string avatar, int pontuacao, int tempo, bool finalizou)
    {
        if (Salas.TryGetValue(codigoSala, out var sala))
        {
            // Atualiza ou adiciona o jogador na lista
            sala.Jogadores.AddOrUpdate(nomeUsuario,
                new JogadorNaSala { Nome = nomeUsuario, Avatar = avatar, Pontuacao = pontuacao, TempoTotal = tempo, Finalizou = finalizou },
                (key, old) => {
                    old.Pontuacao = pontuacao;
                    old.TempoTotal = tempo;
                    old.Finalizou = finalizou;
                    return old;
                });

            // Ordena o ranking: Maior ponto primeiro. Se empatar, menor tempo ganha.
            var ranking = sala.Jogadores.Values
                .OrderByDescending(j => j.Pontuacao)
                .ThenBy(j => j.TempoTotal)
                .ToList();

            // Envia o ranking atualizado para todos (Organizador e Jogadores)
            await Clients.Group(codigoSala).SendAsync("RankingAtualizado", ranking);
        }
    }

    public async Task EncerrarSala(string codigoSala)
    {
        if (Salas.TryRemove(codigoSala, out _))
        {
            await Clients.Group(codigoSala).SendAsync("SalaEncerrada");
        }
    }

    // O Organizador chama este método quando o cronômetro da sala chega a zero
    public async Task FinalizarPartidaGeral(string codigoSala)
    {
        if (Salas.TryGetValue(codigoSala, out var sala))
        {
            // Avisa todos na sala (jogadores) para pararem o que estão fazendo e ver o ranking
            await Clients.Group(codigoSala).SendAsync("PartidaFinalizadaForcada");
        }
    }

    // O organizador chama isso a cada segundo para manter todos sincronizados
    public async Task SincronizarTempo(string codigoSala, int tempoRestante)
    {
        await Clients.Group(codigoSala).SendAsync("TempoSalaAtualizado", tempoRestante);
    }
}