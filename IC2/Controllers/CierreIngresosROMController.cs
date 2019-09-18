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
using Newtonsoft.Json;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CierreIngresosROMController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();
        // GET: CierreIngresosROM
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

        [HttpGet]
        public ActionResult ConsultarIngreso(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<DataIngresosROM> lst = ConsultarBase
                    .GetAll<DataIngresosROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { });
            }
        }

        [HttpGet]

        public ActionResult ConsultarDevAcumTraficoIngresoROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<DevAcumTraficoIngresoROM> lst = ConsultarBase
                    .GetAll<DevAcumTraficoIngresoROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
                //ICPruebaEntities db = new ICPruebaEntities();
                //List<GestionAcuerdos> lst = db.DevAcumTraficoIngresoROM.ToList();
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { });
            }
        }

        [HttpGet]
        public ActionResult ConsultarCancelacProvTrafIngresoROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<CancelacProvTrafIngresoROM> lst = ConsultarBase
                    .GetAll<CancelacProvTrafIngresoROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { });
            }
        }

        [HttpGet]
        public ActionResult ConsultarPROVTARIFA_MesAnteriorROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<PROVTARIFA_MesAnteriorROM> lst = ConsultarBase
                    .GetAll<PROVTARIFA_MesAnteriorROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarAjusNcRealVsDevROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<AjusNcRealVsDevROM> lst = ConsultarBase
                    .GetAll<AjusNcRealVsDevROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarCancProvTarPerAnteROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<CancProvTarPerAnteROM> lst = ConsultarBase
                    .GetAll<CancProvTarPerAnteROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarProvTarAcumMesesAnteROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<ProvTarAcumMesesAnteROM> lst = ConsultarBase
                    .GetAll<ProvTarAcumMesesAnteROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarFacturaTraficoROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<FacturaTraficoROM> lst = ConsultarBase
                    .GetAll<FacturaTraficoROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarFacturaTarifaROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<FacturaTarifaROM> lst = ConsultarBase
                    .GetAll<FacturaTarifaROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarNCTraficoROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<NCTraficoROM> lst = ConsultarBase
                    .GetAll<NCTraficoROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult ConsultarNCTarifaROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<NCTarifaROM> lst = ConsultarBase
                    .GetAll<NCTarifaROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ConsultarSabana(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<SABANA_PROV_TAR_ROM> lst = ConsultarBase
                    .GetAll<SABANA_PROV_TAR_ROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { });
            }
        }

        public ActionResult ConsultarDataIngresosROM(int? pageSize = 10, int? pageCurrent = 1)
        {
            try
            {
                IEnumerable<DataIngresosROM> lst = ConsultarBase
                    .GetAll<DataIngresosROM>(pageSize.Value, pageCurrent.Value);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                TempData["ERRORCI"] = ex.Message;
                return Json(new object[] { });
            }
        }

        //public ActionResult MostrarPeriodos()
        //{
        //    try
        //    {
        //        List<SABANA_PROV_TAR_ROM> lst =
        //           from item in db.SABANA_PROV_TAR_ROM
        //           group item by item.;
        //        return Json(lst.Take(10));
        //    }
        //    catch (Exception ex)
        //    {
        //        TempData["ERRORCI"] = ex.Message;
        //        return Json(new object[] { });
        //    }

        //}

        public ActionResult GetColumns() {

            var columns = new object[] {
                new {
                    dataIndex = "Periodo",
                    text = "Periodo",
                    width = "10%",
                },
                new {
                    dataIndex = "Cuenta_Resultados",
                    text = "Cuenta de Resultados",
                    width = "10%",
                }
            };
            var jsonString = JsonConvert.SerializeObject(columns);
            return Content(jsonString, "application/json");
        }
    }
}