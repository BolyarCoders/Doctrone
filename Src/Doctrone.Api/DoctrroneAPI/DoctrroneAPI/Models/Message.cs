using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace DoctrroneAPI.Models
{
    public class Message
    {
        [JsonProperty("chat_id")]
        public int ChatId { get; set; }

        [JsonProperty("sender")]
        public string Sender { get; set; }

        [JsonProperty("content")]
        public string Content { get; set; }

    }

}
