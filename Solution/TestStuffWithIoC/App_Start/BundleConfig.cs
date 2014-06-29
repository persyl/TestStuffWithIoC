using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace TestStuffWithIoC.App_Start
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                       "~/Scripts/jquery*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/static/styles.css")); //In Include clause you can define more files with comma, like: ,"~/Content/more.css"
        }
    }
}