using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Mvc;

using RestSharp;

using TestStuffWithIoC.Models.Eniro;

namespace TestStuffWithIoC.Controllers
{
    public class EniroController : Controller
    {
        // GET: Eniro
        public ActionResult Index()
        {
            //Do other stuff, like writing file to disk, in another thread
            ThreadPool.QueueUserWorkItem(unused => WriteToFile());
            return View(new EniroViewModel());
        }

        //Using http://restsharp.org 
        private EniroViewModel QueryEniro(string eniroProfileName, string token, string searchWord)
        {
            var model = new EniroViewModel();

            var baseAddress = "http://api.eniro.com";
            var client = new RestClient(baseAddress);
            var request = new RestRequest("cs/search/basic", Method.GET);
            request.AddParameter("profile", eniroProfileName);
            request.AddParameter("key", token);
            request.AddParameter("country", "se");
            request.AddParameter("version", "1.1.3");
            request.AddParameter("geo_area", "stockholm");
            request.AddParameter("search_word", searchWord);

            var eniroResponseData = client.Execute<EniroResponse>(request);
            if (eniroResponseData.StatusCode == HttpStatusCode.OK)
            {
                if (eniroResponseData.Data == null)
                {
                    model.Title = "Request was successful but no data returned or parsed!";
                }
                else
                {
                    model.Title = eniroResponseData.Data.Title;
                    model.Description = string.Format("TotalCount: {0} vs TotalHits: {1}", eniroResponseData.Data.TotalCount, eniroResponseData.Data.TotalHits);
                    model.ResponseObject = eniroResponseData.Data;
                }
            }
            return model;
        }

        private EniroViewModel QueryEniroWithContinuewWith(string eniroProfileName, string token, string searchWord)
        {
            var model = new EniroViewModel();
            var client = new HttpClient();
            var urlString = string.Format("http://api.eniro.com/cs/search/basic?profile={0}&key={1}&country=se&version=1.1.3&geo_area=stockholm&search_word={2}",
                eniroProfileName, token, searchWord);
            var task = client.GetAsync(urlString)
                .ContinueWith((taskWithMsg) =>
                {
                    var response = taskWithMsg.Result;
                    var jsonTask = response.Content.ReadAsAsync<EniroResponse>();
                    jsonTask.Wait();
                    var eniroResponseData = jsonTask.Result;
                    model.Title = eniroResponseData.Title;
                    model.Description = string.Format("TotalCount: {0} vs TotalHits: {1}", eniroResponseData.TotalCount, eniroResponseData.TotalHits);
                    model.ResponseObject = eniroResponseData;
                });
            task.Wait();
            return model;
        }

        [HttpPost]
        public ActionResult FormPosted(EniroViewModel postedData)
        {
            var viewModel = QueryEniro("persyl", "243447562920279118", postedData.SearchPhrase);
            //var viewModel = QueryEniroWithContinuewWith("persyl", "243447562920279118", postedData.SearchPhrase);
            return View("Index", viewModel);
        }

        private void WriteToFile()
        {
            string text = string.Format("{0} This file is written from application TestStuffWithIoC in a separate thread.", DateTime.Now);
            string cwd = Server.MapPath("~/WriteableFolder/");
            System.IO.File.WriteAllText(string.Format("{0}test.txt", cwd), text);
        }
    }
}