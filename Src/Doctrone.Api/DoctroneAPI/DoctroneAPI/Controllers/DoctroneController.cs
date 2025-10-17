using Microsoft.AspNetCore.Mvc;

namespace DoctroneAPI.Controllers
{
    public class DoctroneController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
