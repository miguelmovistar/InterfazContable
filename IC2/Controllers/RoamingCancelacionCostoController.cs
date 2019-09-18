using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class RoamingCancelacionCostoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();
        // GET: RoamingCancelacionCosto
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult CargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            object respuesta = null;
            
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

    }
}