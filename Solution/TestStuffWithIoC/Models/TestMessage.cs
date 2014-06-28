using TestStuffWithIoC.Interfaces;

namespace TestStuffWithIoC.Models
{
    public class TestMessage : ISomeMessage
    {
        public TestMessage() { }

        public string UserMessage()
        {
            return "This is a message from the injected class TestMessage()";
        }
    }
}