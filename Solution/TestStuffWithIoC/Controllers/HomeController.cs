using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using TestStuffWithIoC.Interfaces;

namespace TestStuffWithIoC.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISomeMessage _testMessage;

        public HomeController()
        {
        }

        public HomeController(ISomeMessage message)
        {
            _testMessage = message;
        }

        // GET: Home
        public ActionResult Index()
        {
            return View(_testMessage);
        }
    }
}