using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TestStuffWithIoC.Models;


namespace UnitTests
{
    [TestClass]
    public class TestingTestMessageClass
    {
        [TestMethod]
        public void Test_UserMessage_Returning_Correct_String()
        {
            var sut = new TestMessage();
            Assert.AreEqual("This is a message from the injected class TestMessage()", sut.UserMessage());
        }
    }
}
