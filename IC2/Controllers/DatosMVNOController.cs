using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class DatosMVNOController : Controller
    {
        // GET: DatosMVNO
        ICPruebaEntities db = new ICPruebaEntities();
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
        public JsonResult consulta(string Periodo, int start, int limit)
        {
            object respuesta = null;
            int total = 0;

            try {
                List<object> lista = new List<object>();
                var datos = from oDatos in db.DatosTraficoMVNO
                            join oDocumento in db.CargaDocumento
                            on oDatos.Id_Carga equals oDocumento.Id
                            where oDocumento.Id_LineaNegocio == 3
                            && oDocumento.Periodo == Periodo
                            select new
                            {
                                oDatos.Collection,
                                oDatos.HOperator,
                                oDatos.Operator,
                                oDatos.ReferenceCode,
                                oDatos.TransDate,
                                oDatos.Eventos,
                                oDatos.IdColleccionServicioRegion,
                                oDatos.Service,
                                oDatos.Real,
                                oDatos.Duration,
                                oDatos.Monto,
                                oDatos.PrecioUnitario,
                                oDatos.Moneda,
                                oDatos.Module
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Collection = elemento.Collection,
                        HOperator = elemento.HOperator,
                        Operator = elemento.Operator,
                        ReferenceCode = elemento.ReferenceCode,
                        TransDate = elemento.TransDate.Value.ToString("dd-MM-yyyy"),
                        Eventos = elemento.Eventos,
                        IdColleccionServicioRegion = elemento.IdColleccionServicioRegion,
                        Service = elemento.Service,
                        Real = elemento.Real,
                        Duration = elemento.Duration,
                        Monto = elemento.Monto,
                        PrecioUnitario = elemento.PrecioUnitario,
                        Moneda = elemento.Moneda,
                        Module = elemento.Module
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };

            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #region Combos
        public JsonResult llenaFecha(int lineaNegocio)
        {
            //int total;
            List<object> lista = new List<object>();
            CargaDocumento oCarga = new CargaDocumento();
            object respuesta = null;
            try {
                var fechas = from oFecha in db.CargaDocumento

                             where oFecha.Id_LineaNegocio == lineaNegocio

                             && oFecha.EstatusCarga == "CC"
                             orderby oFecha.Periodo
                             select new
                             {
                                 oFecha.Id,
                                 oFecha.Periodo
                             };

                respuesta = new { success = true, results = fechas.ToList() };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}