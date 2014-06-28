using System.Collections.Generic;

using Newtonsoft.Json;

namespace TestStuffWithIoC.Models.Eniro
{
    public class EniroResponse
    {
        [JsonProperty(PropertyName = "title")]
        public string Title { get; set; }

        [JsonProperty(PropertyName = "query")]
        public string Query { get; set; }

        [JsonProperty(PropertyName = "totalHits")]
        public int TotalHits { get; set; }

        [JsonProperty(PropertyName = "totalCount")]
        public int TotalCount { get; set; }

        [JsonProperty(PropertyName = "startIndex")]
        public int StartIndex { get; set; }

        [JsonProperty(PropertyName = "itemsPerPage")]
        public int ItemsPerPage { get; set; }

        [JsonProperty(PropertyName = "adverts")]
        public List<EniroAdvert> Adverts { get; set; }
    }

    public class EniroAdvert
    {
        [JsonProperty(PropertyName = "eniroId")]
        public string EniroId { get; set; }

        [JsonProperty(PropertyName = "companyInfo")]
        public EniroCompanyInfo CompanyInfo { get; set; }

        [JsonProperty(PropertyName = "address")]
        public Address Address { get; set; }
        
    }

    public class EniroCompanyInfo
    {
        [JsonProperty(PropertyName = "companyName")]
        public string CompanyName { get; set; }

        [JsonProperty(PropertyName = "orgNumber")]
        public string OrgNumber { get; set; }

        [JsonProperty(PropertyName = "companyText")]
        public string CompanyText { get; set; }
    }

    public class Address
    {
        [JsonProperty(PropertyName = "coName")]
        public string CoName { get; set; }

        [JsonProperty(PropertyName = "streetName")]
        public string StreetName { get; set; }

        [JsonProperty(PropertyName = "postCode")]
        public string PostCode { get; set; }

        [JsonProperty(PropertyName = "postArea")]
        public string PostArea { get; set; }

        [JsonProperty(PropertyName = "postBox")]
        public string PostBox { get; set; }
    }
}