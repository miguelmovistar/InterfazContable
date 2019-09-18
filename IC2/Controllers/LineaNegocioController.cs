using System.Web.Mvc;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class LineaNegocioController : Controller
    {
        public ActionResult LineaNegocio()
        {
            if ((string)Session["userName"] != "MRN14015")
            {
                
                return RedirectToAction("Login", "Account");
            }
            else
            {
                return View();
            }            
        }
      
    }
}
