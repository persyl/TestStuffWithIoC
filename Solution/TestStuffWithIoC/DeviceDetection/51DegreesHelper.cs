using System;
using System.Web;

namespace TestStuffWithIoC.DeviceDetection
{
    public static class Helper51Degrees
    {
        public static string GetPropertyLinkHtml(string propertyName)
        {
            return String.Format(
                @"<a href=""http://51degrees.com/Resources/Property-Dictionary#{0}"">{0}</a>",
                propertyName);
        }

        public static string GetPropertyHtml(HttpRequestBase req, string propertyName)
        {
            var value = req.Browser[propertyName];
            if (String.IsNullOrEmpty(value))
                value = @"<a href=""http://51degrees.com/Products/Device-Detection"">Upgrade</a>";
            return value;
        } 
    }
}