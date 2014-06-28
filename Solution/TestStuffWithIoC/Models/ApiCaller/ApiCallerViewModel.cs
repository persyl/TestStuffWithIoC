using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TestStuffWithIoC.Models.ApiCaller
{
    public class ApiCallerViewModel
    {
        public string ViewTitle { get; set; }
        public string Info { get; set; }
        public string ThumbnailUrl { get; set; }
        public string SearchPhrase { get; set; }
    }
}