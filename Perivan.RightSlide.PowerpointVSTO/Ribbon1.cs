using System;
using Microsoft.Office.Interop.PowerPoint;
using Microsoft.Office.Tools.Ribbon;
using Microsoft.AspNetCore.SignalR.Client;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Connections;

namespace Perivan.RightSlide.PowerpointVSTO
{
    public partial class Ribbon1
    {
        private Application PowerPoint => Globals.ThisAddIn.Application;
        private HubConnection connection;

        private Slide CurrentSlide => PowerPoint != null ? PowerPoint.ActiveWindow.View.Slide : new Slide();

        private async void Ribbon1_Load(object sender, RibbonUIEventArgs e)
        {

            connection = new HubConnectionBuilder()
                .WithUrl("https://localhost:44314/hubs/officeevent", HttpTransportType.LongPolling).Build();
            connection.Closed += (ex) =>
            {
                label1.Label = connection.State.ToString();
                return default(Task);
            };


            connection.On<string, string>("Send", (n, m) =>
              {
                  Console.WriteLine("Message received from server. Name: {0} | Message: {1}", n, m);
                  AddSlide();
              });

            try
            {
                await connection.StartAsync();
                label1.Label = connection.State.ToString();
            }
            catch (HttpRequestException ex)
            {
                label1.Label = ex.Message;
                //No connection: Don't enable Send button or show chat UI 
                return;
            }
        }


        private void AddSlide_Click(object sender, RibbonControlEventArgs e)
        {
            AddSlide();
        }

        private void AddSlide()
        {
            var slideIndex = CurrentSlide.SlideIndex;
            var pptLayout = PowerPoint.ActivePresentation.Slides[slideIndex].CustomLayout;
            PowerPoint.ActivePresentation.Slides.AddSlide(slideIndex + 1, pptLayout);
            var newSlide = PowerPoint.ActivePresentation.Slides[slideIndex + 1];
            newSlide.Select();
        }

        private void DeleteSlide_Click(object sender, RibbonControlEventArgs e)
        {
            CurrentSlide.Delete();
        }
    }
}