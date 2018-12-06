using Microsoft.AspNetCore.SignalR;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace Perivan.RightSlide.Web
{
    public class MyHub : Hub
    {
        public async Task Send(string name, string message)
        {
            await Clients.All.SendAsync("Send", name, message).ConfigureAwait(false);
        }


        public override Task OnConnectedAsync()
        {
            Debug.Write("Client connected: " + Context.ConnectionId);
            return base.OnConnectedAsync();
        }


        public override Task OnDisconnectedAsync(Exception exception)
        {
            Debug.Write("Client disconnected: " + Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

    }
}
