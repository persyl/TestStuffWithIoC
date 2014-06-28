using System;

using Newtonsoft.Json;
namespace TestStuffWithIoC.Models.ApiCaller
{
    public class YouTubeVideoResponse
    {
        [JsonProperty(PropertyName = "kind")]
        public string Kind { get; set; }

        [JsonProperty(PropertyName = "etag")]
        public string Etag { get; set; }

        [JsonProperty(PropertyName = "pageInfo")]
        public PageInfo PageInfo { get; set; }

        [JsonProperty(PropertyName = "items")]
        public YouTubeVideo[] Items { get; set; }
    }

    public class PageInfo
    {
        [JsonProperty(PropertyName = "totalResults")]
        public int TotalResults { get; set; }

        [JsonProperty(PropertyName = "resultsPerPage")]
        public int ResultsPerPage { get; set; }
    }

    public class YouTubeVideo
    {
        [JsonProperty(PropertyName = "kind")]
        public string Kind { get; set; }

        [JsonProperty(PropertyName = "etag")]
        public string Etag { get; set; }

        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "snippet")]
        public Snippet Snippet { get; set; }
    }

    public class Snippet
    {
        [JsonProperty(PropertyName = "channelTitle")]
        public string ChannelTitle { get; set; }

        [JsonProperty(PropertyName = "publishedAt")]
        public DateTime Published { get; set; }

        [JsonProperty(PropertyName = "channelId")]
        public string ChannelId { get; set; }

        [JsonProperty(PropertyName = "title")]
        public string VideoTitle { get; set; }

        [JsonProperty(PropertyName = "description")]
        public string VideoDescription { get; set; }

        [JsonProperty(PropertyName = "thumbnails")]
        public Thumbnails ThumbNails { get; set; }
    }

    public class Thumbnails
    {
        [JsonProperty(PropertyName = "default")]
        public ThumbnailInfo DefaultImage { get; set; }

        [JsonProperty(PropertyName = "medium")]
        public ThumbnailInfo MediumImage { get; set; }

        [JsonProperty(PropertyName = "high")]
        public ThumbnailInfo HighImage { get; set; }
    }

    public class ThumbnailInfo
    {
        [JsonProperty(PropertyName = "url")]
        public string Url { get; set; }

        [JsonProperty(PropertyName = "width")]
        public string Width { get; set; }

        [JsonProperty(PropertyName = "height")]
        public string Height { get; set; }
    }
}