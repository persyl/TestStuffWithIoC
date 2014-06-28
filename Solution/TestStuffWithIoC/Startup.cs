using Microsoft.Owin;
using Owin;

namespace TestStuffWithIoC
{
    public class Startup
    {
        //Testcomment
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}