using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace DoctrroneAPI.Models
{
    public class Folder
    {

        [JsonProperty("user_id")]
        public int UserId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        //[JsonPropertyName("created_at")]
        //public DateTime CreatedAt { get; set; }
    }
}
