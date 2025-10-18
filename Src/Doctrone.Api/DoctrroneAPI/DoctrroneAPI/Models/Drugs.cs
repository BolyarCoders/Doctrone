using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace DoctrroneAPI.Models
{
    public class Drugs
    {

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
