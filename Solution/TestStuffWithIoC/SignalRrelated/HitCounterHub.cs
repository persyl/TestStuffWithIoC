using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace TestStuffWithIoC.SignalRrelated
{
    [HubName("hitCounter")]
    public class HitCounterHub : Hub
    {
        private static int _hitCount = 0;

        public void RecordHit()
        {
            _hitCount += 1;
            this.Clients.All.onHitRecorded(_hitCount);
        }

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            _hitCount -= 1;
            this.Clients.All.onHitRecorded(_hitCount);
            return base.OnDisconnected();
        }
    }
}