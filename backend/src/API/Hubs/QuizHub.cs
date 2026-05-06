using Microsoft.AspNetCore.SignalR;

namespace API.Hubs;

public class QuizHub : Hub
{
    public async Task EntrarNaSala(string codigoSala, string nomeUsuario, bool isProfessor)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, codigoSala);

        if (!isProfessor)
        {
            await Clients.Group(codigoSala).SendAsync("NovoJogadorConectado", nomeUsuario);
        }
    }

    public async Task IniciarPartida(string codigoSala)
    {
        await Clients.Group(codigoSala).SendAsync("PartidaIniciada");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await base.OnDisconnectedAsync(exception);
    }
}