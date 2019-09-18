using IC2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class DevengoIngresosROMController : Controller
    {
        readonly IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };
        ICPruebaEntities db = new ICPruebaEntities();
        // GET: DevengoIngresosROM
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
        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                var datos = from tcCierre in db.TC_Cierre
                            where tcCierre.Id_LineaNegocio == lineaNegocio
                            group tcCierre by tcCierre.Mes_Consumo into g
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };

                foreach (var elemento in datos)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGridDevengoIngreso(string periodo, string PPTOI, string PPTOC, decimal tipoCambio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                var list = db.usp_ResumenPXQ(DateTime.Parse(periodo), tipoCambio).ToList();
                var pptc = (decimal.Parse(PPTOC) * -1);
                list.ForEach(e => 
                {
                    lista.Add(new 
                    {
                        Moneda = e.Moneda,
                        Sentido = e.Sentido,
                        Fecha = periodo,
                        PPTO = e.Sentido.ToUpper() == "INGRESO" ? PPTOI : pptc.ToString(),
                        DevengoTrafico = e.DevengoTrafico,
                        CostosRecurrentes = e.CostosRecurrentes,
                        DevengoTotal = e.DevengoTotal,
                        ProvisionTarifa = e.ProvisionTarifa,
                        AjusteRealDevengoFac = e.AjusteRealDevengoFac,
                        AjusteRealDevengoTarifa = e.AjusteRealDevengoTarifa,
                        AjustesExtraordinarios = e.AjustesExtraordinarios,
                        ImporteNeto = e.ImporteNeto,
                        DevengoPPTO = e.Sentido.ToUpper() == "INGRESO" ? 
                                            (e.ImporteNeto - decimal.Parse(PPTOI)) :
                                                (e.ImporteNeto - decimal.Parse(PPTOC))
                    });
                });
               
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public JsonResult TipoCambio(string periodo)
        {
            object respuesta = null;
            try
            {
                var mes = DateTime.Parse(periodo);
                decimal tipocambio = 0;
                var cambio = db.TC_Cierre.Where(s => s.Id_LineaNegocio == 1 &&
                                                    s.Mes_Consumo == mes &&
                                                        s.Sentido.ToUpper() == "INGRESO").Select(s => s.TC_MXN).ToList();
                cambio.ForEach(c => 
                {
                    tipocambio = c;
                });
                respuesta = new { Success = true, results = tipocambio };
            }
            catch (Exception e)
            {
                respuesta = new { Success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

    }
}