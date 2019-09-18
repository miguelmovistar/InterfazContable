using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class RoamingDocumentoCostoController : Controller
    {
        // GET: RoamingDocumentoCosto
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult CargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            
            object respuesta = null;

            RoamingDocumentoCosto entidad = new RoamingDocumentoCosto();


            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

    }
}