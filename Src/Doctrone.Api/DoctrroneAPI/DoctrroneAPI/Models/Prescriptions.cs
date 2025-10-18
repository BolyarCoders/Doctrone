using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace DoctrroneAPI.Models
{
    public class Prescriptions
    {
        [JsonProperty("user_id")]
        public int UserId { get; set; }

        [JsonProperty("drug_id")]
        public int DrugId { get; set; }

        [JsonProperty("intake")]
        public string Intake { get; set; }

        [JsonProperty("dosage")]
        public string Dosage { get; set; }
    }
}
