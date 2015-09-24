using TestStuffWithIoC.Models;
using Xunit;

namespace UnitTests
{
    public class TestingTestMessageClass
    {
        [Fact]
        public void Test_UserMessage_Returning_Correct_String()
        {
            var sut = new TestMessage();
            Assert.Equal("This is a message from the injected class TestMessage()", sut.UserMessage());
        }
    }
}
