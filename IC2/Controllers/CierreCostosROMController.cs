using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using IC2.Controllers.Seguridad;
using IC2.Models;
using IC2.Helpers;


namespace IC2.Controllers
{
    public class CierreCostosROMController : Controller
    {

        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        // GET: CierreCostos
        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            List<Submenu> lista = new List<Submenu>();
            List<Menu> listaMenu = new List<Menu>();
            lista = oHome.obtenerMenu((int)Session["IdLinea"]);
            listaMenu = oHome.obtenerMenuPrincipal((int)Session["IdLinea"]);
            ViewBag.Lista = lista;
            ViewBag.ListaMenu = listaMenu;
            return View(ViewBag);
        }
    }
}