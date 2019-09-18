using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class DatosLDIController : Controller
    {

        // GET: DatosLDI
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
        public JsonResult Consulta(DateTime Periodo, int start, int limit)
        {
            object respuesta = null;
            int total = 0;
            try {
                List<object> lista = new List<object>();
                var datos = from oDatos in db.DatosTraficoLDI
                            join moneda in db.Moneda
                               on oDatos.id_moneda equals moneda.Id into gjmn
                            join operador in db.Operador
                               on oDatos.Billing_Operator equals operador.Id into gjop
                            join traficoTb in db.Trafico
                               on oDatos.id_trafico equals traficoTb.Id into gjtf
                            from submoneda in gjmn.DefaultIfEmpty()
                            from suboperador in gjop.DefaultIfEmpty()
                            from subtrafico in gjtf.DefaultIfEmpty()
                            where oDatos.fecha_contable == Periodo
                            select new
                            {
                                oDatos.Franchise,
                                oDatos.Direccion,
                                oDatos.Billed_Product,
                                oDatos.Rating_Component,
                                Id_Operador = suboperador.Id_Operador ?? String.Empty,
                                oDatos.Unit_Cost_User,
                                oDatos.Month,
                                oDatos.Calls,
                                oDatos.Actual_Usage,
                                oDatos.Charge_Usage,
                                Moneda1 = submoneda.Moneda1 ?? String.Empty,
                                oDatos.Amount,
                                oDatos.Iva,
                                Id_TraficoTR = subtrafico.Id_TraficoTR ?? String.Empty,
                                oDatos.Sobrecargo
                            };
                foreach (var elemento in datos) {
                    lista.Add(new
                    {
                        Franchise = elemento.Franchise,
                        Direccion = elemento.Direccion,
                        Billed_Product = elemento.Billed_Product,
                        Rating_Component = elemento.Rating_Component,
                        Billing_Operator = elemento.Id_Operador,
                        Unit_Cost_User = elemento.Unit_Cost_User,
                        Month = elemento.Month.Value.ToString("dd-MM-yyyy"),
                        Calls = elemento.Calls,
                        Actual_Usage = elemento.Actual_Usage,
                        Charge_Usage = elemento.Charge_Usage,
                        Currency = elemento.Moneda1,
                        Amount = elemento.Amount,
                        Iva = elemento.Iva,
                        Trafico = elemento.Id_TraficoTR,
                        Sobrecargo = elemento.Sobrecargo
                    });
                }
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };

            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #region Combos
        public JsonResult LlenaFecha(int lineaNegocio)
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

                foreach (var elemento in fechas) {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        fecha = DateTime.ParseExact(elemento.Periodo, "yyyy/MM", null).ToString("yyyy-MM-dd"),
                        Periodo = DateTime.ParseExact(elemento.Periodo, "yyyy/MM", null).ToString("yyyy MMMM", new CultureInfo("es-ES")).ToUpper()
                    });
                }

                respuesta = new { success = true, results = lista };
            } catch (Exception e) {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}