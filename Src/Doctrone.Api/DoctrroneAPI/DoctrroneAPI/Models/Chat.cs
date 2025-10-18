using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace DoctrroneAPI.Models
{
    public class Chat
    {

        [JsonProperty("user_id")]
        public int UserId { get; set; }

        //[JsonProperty("started_st")]
        //public DateTime StartedSt { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("folder_id")]
        public int FolderId { get; set; }
    }
}
