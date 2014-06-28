using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using TestStuffWithIoC.Models.ApiCaller;

namespace TestStuffWithIoC.Controllers
{
    public class ApiCallerController : AsyncController //AsyncController instead of Controller to tell compiler to run this asynchronously
    {
        // GET: ApiCaller
        public async Task<ActionResult> Index()
        {
            return View(new ApiCallerViewModel(){ViewTitle = "Search on YouTube"});
        }

        private async Task<ApiCallerViewModel> DoHttpClientCall(string youTubeClipId)
        {
            var model = new ApiCallerViewModel()
            {
                ViewTitle = string.Format("Calling YouTube API for video ID {0}", youTubeClipId)
            };
            const string accessToken = "AIzaSyDcr4ec67a60QgBMtZX9PvKLl_sONnflPE";
            var ub = new UriBuilder(new Uri("https://www.googleapis.com/youtube/v3/videos"))
            {
                Query = string.Format("key={0}&id={1}&part=snippet,contentDetails,statistics,status", accessToken, youTubeClipId)
            };
            
            var client = new HttpClient();
            //client.BaseAddress = ub.Uri;
            //var authHeader = new AuthenticationHeaderValue("Bearar", accessToken);
            //client.DefaultRequestHeaders.Authorization = authHeader;
            client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await client.GetAsync(ub.Uri);
            if (response.IsSuccessStatusCode)
            {
                var vid = await response.Content.ReadAsAsync<YouTubeVideoResponse>();
              
                model.Info = string.Format("<b>&quot;{0}&quot;</b><br /><i>Publicerat: {1:yyyy-MM-dd HH:mm}</i><br />{2}", 
                    vid.Items[0].Snippet.VideoTitle, 
                    vid.Items[0].Snippet.Published,
                    vid.Items[0].Snippet.VideoDescription);
                model.ThumbnailUrl = vid.Items[0].Snippet.ThumbNails.HighImage.Url;
            }
            return model;
        }

        //Have errors deserializing json???
        private async Task<ApiCallerViewModel> DoWebClientCall(string youTubeClipId)
        {
            var model = new ApiCallerViewModel()
            {
                ViewTitle = string.Format("Calling YouTube API for video ID {0}", youTubeClipId)
            };
            const string accessToken = "AIzaSyDcr4ec67a60QgBMtZX9PvKLl_sONnflPE";
            var ub = new UriBuilder(new Uri("https://www.googleapis.com/youtube/v3/videos"))
            {
                Query = string.Format("key={0}&id={1}&part=snippet,contentDetails,statistics,status", accessToken, youTubeClipId)
            };
            var json = await new WebClient().DownloadStringTaskAsync(ub.Uri);
            if (!string.IsNullOrEmpty(json))
            {
                //TODO: JavaScriptSerializer can not deserialize it all as HttpClient.response.Content.ReadAsAsync above???
                var vid = new JavaScriptSerializer().Deserialize<YouTubeVideoResponse>(json);
                model.Info = string.Format("<b>&quot;{0}&quot;</b><br /><i>Publicerat: {1:yyyy-MM-dd HH:mm}</i><br />{2}",
                    vid.Items[0].Snippet.VideoTitle,
                    vid.Items[0].Snippet.Published,
                    vid.Items[0].Snippet.VideoDescription);
                model.ThumbnailUrl = vid.Items[0].Snippet.ThumbNails.HighImage.Url;
            }
            return model;
        }

        public async Task<ActionResult> FormPosted(ApiCallerViewModel modelPosted)
        {
            //var youTubeClipId = "HoBi0L1Peh0";
            var model = await DoHttpClientCall(modelPosted.SearchPhrase);
            //var model = await DoWebClientCall(youTubeClipId);
            return View("Index", model);
        }
    }
}