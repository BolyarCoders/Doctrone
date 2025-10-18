using DoctrroneAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Text;

namespace DoctrroneAPI.Controllers
{
    [ApiController]
    [Route("Doctrone/[action]")]
    public class DoctroneController : Controller
    {
        private readonly HttpClient _client;

        public DoctroneController()
        {
            _client = new HttpClient
            {
                BaseAddress = new Uri("https://vhssvvlsgoprgizbckea.supabase.co/")
            };
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3N2dmxzZ29wcmdpemJja2VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDczODE3MiwiZXhwIjoyMDc2MzE0MTcyfQ.hi1H_auhhhtrN7H2szPkQBmB5Zl5WV0Wf2u0QsIhaP0");
            _client.DefaultRequestHeaders.Add("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoc3N2dmxzZ29wcmdpemJja2VhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDczODE3MiwiZXhwIjoyMDc2MzE0MTcyfQ.hi1H_auhhhtrN7H2szPkQBmB5Zl5WV0Wf2u0QsIhaP0");
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var response = await _client.GetAsync("rest/v1/users");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> Login(string email, string password)
        {
            var response = await _client.GetAsync("rest/v1/users");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();

            List<Users>? users = JsonConvert.DeserializeObject<List<Users>>(json);
            if (users != null)
            {
                Users? user = users.Find(u => u.Email == email && u.Pass == password);
                if (user != null)
                {
                    var userJson = JsonConvert.SerializeObject(user);
                    return Content(userJson, "application/json");
                }
                else
                {
                    return Unauthorized("Invalid email or password.");
                }
            }
            else
            {
                return Unauthorized("No users.");
            }

        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserRegister newUser)
        {
            var jsonContent = JsonConvert.SerializeObject(newUser);
            var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("rest/v1/users", content);
            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            return Content(responseJson, "application/json");
        }

        //Posts:(Elements)

        [HttpPost]
        public async Task<IActionResult> AddPrescription([FromBody] Prescriptions prescription)
        {
            var jsonContent = JsonConvert.SerializeObject(prescription);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("rest/v1/prescriptions", content);

            if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            {
                return Conflict(new { message = "This prescription already exists for the user. Or there is another issue!" });
            }

            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            return Content(responseJson, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> AddFolder([FromBody] Folder folder)
        {
            var jsonContent = JsonConvert.SerializeObject(folder);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("rest/v1/folders", content);

            if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            {
                return Conflict(new { message = "This folder already exists for the user. Or there is another issue!" });
            }

            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            return Content(responseJson, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> AddChat([FromBody] Chat chat)
        {
            var jsonContent = JsonConvert.SerializeObject(chat);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("rest/v1/chats", content);

            if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            {
                return Conflict(new { message = "This chat already exists for the user. Or there is another issue!" });
            }

            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            return Content(responseJson, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> AddDrugs([FromBody] Drugs drug)
        {
            var jsonContent = JsonConvert.SerializeObject(drug);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("rest/v1/drugs", content);

            if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            {
                return Conflict(new { message = "This drug already exists for the user. Or there is another issue!" });
            }

            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            return Content(responseJson, "application/json");
        }

        [HttpPost]
        public async Task<IActionResult> AddMessage([FromBody] Message message)
        {
            var jsonContent = JsonConvert.SerializeObject(message);
            var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("rest/v1/messages", content);

            if (response.StatusCode == System.Net.HttpStatusCode.Conflict)
            {
                return Conflict(new { message = "This message already exists for the user. Or there is another issue!" });
            }

            response.EnsureSuccessStatusCode();
            var responseJson = await response.Content.ReadAsStringAsync();
            return Content(responseJson, "application/json");
        }

        //Deletes:

        [HttpDelete]
        public async Task<IActionResult> DeletePrescription(int prescriptionId)
        {
            var response = await _client.DeleteAsync($"rest/v1/prescriptions?id=eq.{prescriptionId}");

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = error });
            }

            return Ok(new { message = "Prescription deleted successfully." });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var response = await _client.DeleteAsync($"rest/v1/users?id=eq.{userId}");
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = error });
            }
            return Ok(new { message = "User deleted successfully." });
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteChat(int chatId)
        {
            var response = await _client.DeleteAsync($"rest/v1/chats?id=eq.{chatId}");
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = error });
            }
            return Ok(new { message = "Chat deleted successfully." });

        }

        [HttpDelete]
        public async Task<IActionResult> DeleteDrug(int drugId)
        {
            var response = await _client.DeleteAsync($"rest/v1/drugs?id=eq.{drugId}");
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = error });
            }
            return Ok(new { message = "Drug deleted successfully." });

        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            var response = await _client.DeleteAsync($"rest/v1/messages?id=eq.{messageId}");
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = error });
            }
            return Ok(new { message = "Message deleted successfully." });

        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFolder(int folderId)
        {
            var response = await _client.DeleteAsync($"rest/v1/folders?id=eq.{folderId}");
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return BadRequest(new { message = error });
            }
            return Ok(new { message = "Folder deleted successfully." });
        }

        //Gets:

        [HttpGet]
        public async Task<IActionResult> GetPrescriptions()
        {
            var response = await _client.GetAsync("rest/v1/prescriptions");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");

        }

        [HttpGet]
        public async Task<IActionResult> GetDrugs()
        {
            var response = await _client.GetAsync("rest/v1/drugs");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult> GetFolders()
        {
            var response = await _client.GetAsync("rest/v1/folders");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult> GetChats()
        {
            var response = await _client.GetAsync("rest/v1/chats");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var response = await _client.GetAsync("rest/v1/messages");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }

        [HttpGet]
        public async Task<IActionResult> GetUserIdByEmail(string email)
        {
            var response = await _client.GetAsync($"rest/v1/users?email=eq.{email}");
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();
            return Content(json, "application/json");
        }
    }
}
