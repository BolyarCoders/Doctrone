using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace DoctrroneAPI.Models
{
    public class Users
    {
        [JsonProperty("id")]
        public long? Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("pass")]
        public string Pass { get; set; }

        [JsonProperty("blood_type")]
        public string BloodType { get; set; }

        [JsonProperty("age")]
        public long Age { get; set; }

        [JsonProperty("gender")]
        public string Gender { get; set; }

        [JsonProperty("special_diagnosis")]
        public string SpecialDiagnosis { get; set; }
    }

   
}
