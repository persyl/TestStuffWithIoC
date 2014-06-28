using Microsoft.Owin;
using Owin;

namespace TestStuffWithIoC
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}