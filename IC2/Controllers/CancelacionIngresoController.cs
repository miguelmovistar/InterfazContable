using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;

namespace IC2.Controllers
{
    public class CancelacionIngresoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();

        //
        // GET: /Servicio/
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
        public JsonResult llenaGrid(int lineaNegocio, int start, int limit)
        {
            List<object> CancelacionIngreso = new List<object>();
            object respuesta = null;
            int total = 0;
            try
            {

                var servicio = from elemento in db.CancelacionIngresoRom
                               where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                               select new
                               {
                                   elemento.Id,
                                   elemento.Bandera,
                                   elemento.No_Provision,
                                   elemento.Id_Operador,
                                   elemento.Concepto,
                                   elemento.Id_Grupo,
                                   elemento.Id_Deudor,
                                   elemento.Monto_Provision,
                                   elemento.Id_Moneda,
                                   elemento.Periodo,
                                   elemento.Tipo,
                                   elemento.No_Documento,
                                   elemento.Folio_Documento,
                                   elemento.TC_Provision,
                                   elemento.Importe_MXN,
                                   elemento.Importe_Factura,
                                   elemento.Div_Prov_Factura,
                                   elemento.Tipo_Cambio_Factura,
                                   elemento.Exceso_ProvMXN,
                                   elemento.Insuficiencia_ProvMXN,
                                   elemento.Activo,
                                   elemento.Id_LineaNegocio
                               };

                foreach (var elemento in servicio)
                {
                    CancelacionIngreso.Add(new
                    {
                        Id = elemento.Id,
                        Bandera = elemento.Bandera,
                        No_Provision = elemento.No_Provision,
                        Id_Operador = elemento.Id_Operador,
                        Concepto = elemento.Concepto,
                        Id_Grupo = elemento.Id_Grupo,
                        Id_Deudor = elemento.Id_Deudor,
                        Monto_Provision = elemento.Monto_Provision,
                        Id_Moneda = elemento.Id_Moneda,
                        Periodo = elemento.Periodo,
                        Tipo = elemento.Tipo,
                        No_Documento = elemento.No_Documento,
                        Folio_Documento = elemento.Folio_Documento,
                        TC_Provision = elemento.TC_Provision,
                        Importe_MXN = elemento.Importe_MXN,
                        Importe_Factura = elemento.Importe_Factura,
                        Div_Prov_Factura = elemento.Div_Prov_Factura,
                        Tipo_Cambio_Factura = elemento.Tipo_Cambio_Factura,
                        Exceso_ProvMXN = elemento.Exceso_ProvMXN,
                        Insuficiencia_ProvMXN = elemento.Insuficiencia_ProvMXN,
                        //Activo = elemento.Activo
                    });
                }
                total = CancelacionIngreso.Count();
                CancelacionIngreso = CancelacionIngreso.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = CancelacionIngreso, total = total };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
    }
}

        //public JsonResult agregarCancelacionIngreso(string Servicio, int Orden, string Id_Servicio, int lineaNegocio)
        //{
        //    object respuesta = null;
        //    try
        //    {
        //        Servicio oServicio = db.Servicio.Where(x => x.Orden == Orden && x.Activo == 1 && x.Id_LineaNegocio == lineaNegocio).SingleOrDefault();
        //        if (oServicio == null)
        //        {
        //            var nuevo = new Servicio();

        //            nuevo.Id_Servicio = Id_Servicio;
        //            nuevo.Servicio1 = Servicio;
        //            nuevo.Orden = Orden;
        //            nuevo.Activo = 1;
        //            nuevo.Id_LineaNegocio = lineaNegocio;
        //            db.Servicio.Add(nuevo);
        //            db.SaveChanges();
        //            respuesta = new { success = true, results = "ok" };
        //        }
        //        else
        //        {
        //            respuesta = new { success = true, results = "no", dato = Orden };
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = new { success = false, result = ex.Message.ToString() };
        //    }
        //    return Json(respuesta, JsonRequestBehavior.AllowGet);

        //}

        //public JsonResult buscarCancelacionIngreso(int Id)
        //{
        //    object respuesta = null;

        //    try
        //    {
        //        List<object> listaIngrerso = new List<object>();

        //        var oServicio = from objServicio in db.Servicio
        //                        where objServicio.Id == Id
        //                        select new
        //                        {
        //                            objServicio.Id_Servicio,
        //                            objServicio.Servicio1,
        //                            objServicio.Orden
        //                        };

        //        foreach (var elemento in oServicio)
        //        {
        //            listaIngrerso.Add(new
        //            {
        //                Id_Servicio = elemento.Id_Servicio,
        //                Servicio = elemento.Servicio1,
        //                Orden = elemento.Orden,
        //            });
        //        }

        //        respuesta = new { success = true, results = oServicio };
        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = new { success = false, results = ex.Message };
        //    }
        //    return Json(respuesta, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult borrarCancelacionIngreso(string strID)
        //{
        //    object respuesta = null;
        //    string strmsg = "ok";
        //    string strSalto = "</br>";
        //    bool blsucc = true;
        //    int Id = 0;
        //    strID = strID.TrimEnd(',');

        //    try
        //    {
        //        string[] Ids = strID.Split(',');
        //        for (int i = 0; i < Ids.Length; i++)
        //        {
        //            if (Ids[i].Length != 0)
        //            {
        //                Id = int.Parse(Ids[i]);

        //                string strresp_val = funGralCtrl.ValidaRelacion("Servicio", Id);

        //                if (strresp_val.Length == 0)
        //                {
        //                    Servicio oServicio = db.Servicio.Where(x => x.Id == Id).SingleOrDefault();
        //                    oServicio.Activo = 0;
        //                    db.SaveChanges();
        //                }
        //                else
        //                {
        //                    strmsg = "El(Los) " + Ids.Length.ToString() + " registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) " + strSalto;
        //                    strmsg = strmsg + strresp_val + strSalto;
        //                    blsucc = false;
        //                    break;
        //                }
        //            }
        //        }
        //        respuesta = new { success = blsucc, result = strmsg };
        //    }
        //    catch (Exception ex)
        //    {
        //        strmsg = ex.Message;
        //        respuesta = new { success = false, result = strmsg };
        //    }
        //    return Json(respuesta, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult modificarCancelacionIngreso(string Servicio, int Orden, int Id)
        //{
        //    object respuesta = null;

        //    try
        //    {
        //        Servicio oServicio = db.Servicio.Where(x => x.Id == Id).SingleOrDefault();
        //        oServicio.Servicio1 = Servicio;
        //        oServicio.Orden = Orden;

        //        Servicio oServicioModificado = db.Servicio.Where(x => x.Orden == oServicio.Orden && x.Servicio1 == oServicio.Servicio1).SingleOrDefault();
        //        if (oServicioModificado == null)
        //        {
        //            db.SaveChanges();
        //            respuesta = new { success = true, results = "ok" };
        //        }
        //        else
        //        {
        //            respuesta = new { success = true, results = "no", dato = Orden };
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        respuesta = new { success = false, results = ex.Message };
        //    }
        //    return Json(respuesta, JsonRequestBehavior.AllowGet);
        //}

    //    public JsonResult validaModif(int Id)
    //    {
    //        string strSalto = "</br>";
    //        string strmsg = "";
    //        bool blsccs = true;

    //        object respuesta = null;

    //        string strresp_val = funGralCtrl.ValidaRelacion("Servicio", Id);

    //        if (strresp_val.Length != 0)
    //        {
    //            //  "El(Los) < cantidad de registros con relación con catálogos> registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) *< Lista de Catálogos con relación> *y deberás eliminarlos primero en el(los) catálogo(s).Si se seleccionaron registros que no están usados por otro catálogo entonces deberá mostrar otra pantalla "El(los) <Cantidad de registros no usados en otras tablas> registros pueden ser eliminados. ¿Desea continuar?
    //            strmsg = "El registro que quieres modificar se está usando en el(los) catálogo(s) " + strSalto;
    //            strmsg = strmsg + strresp_val + strSalto;
    //            strmsg = strmsg + " ¿Estas seguro de hacer la modificación?";

    //            blsccs = false;
    //        }

    //        respuesta = new { success = blsccs, results = strmsg };

    //        return Json(respuesta, JsonRequestBehavior.AllowGet);

    //    }
    //}
//}

//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web.Mvc;
//using IC2.Models;
//using System.IO;
//using System.Transactions;
//using OfficeOpenXml;
//using System.Drawing;
//using OfficeOpenXml.Style;

//namespace IC2.Controllers
//{
//    public class CancelacionIngresoController : Controller
//    {
//        ICPruebaEntities db = new ICPruebaEntities();

//        IDictionary<int, string> meses = new Dictionary<int, string>() {
//            {1, "ENERO"}, {2, "FEBRERO"},
//            {3, "MARZO"}, {4, "ABRIL"},
//            {5, "MAYO"}, {6, "JUNIO"},
//            {7, "JULIO"}, {8, "AGOSTO"},
//            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
//            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
//        };
//        // GET: CierrecostosLDI
//        public ActionResult Index()
//        {
//            //CalcularCierreCostos(new DateTime(2018, 09, 11));
//            HomeController oHome = new HomeController();
//            ViewBag.Linea = "Linea";
//            ViewBag.IdLinea = (int)Session["IdLinea"];
//            List<Submenu> lista = new List<Submenu>();
//            List<Menu> listaMenu = new List<Menu>();
//            lista = oHome.obtenerMenu((int)Session["IdLinea"]);
//            listaMenu = oHome.obtenerMenuPrincipal((int)Session["IdLinea"]);
//            ViewBag.Lista = lista;
//            ViewBag.ListaMenu = listaMenu;
//            return View(ViewBag);
//        }

//        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
//        {
//            List<object> lista = new List<object>();
//            object respuesta = null;
//            int total;

//            try
//            {
//                var datos = from periodos in db.CancelacionIngresoRom
//                            where periodos.Id_LineaNegocio == lineaNegocio
//                            group periodos by periodos.Periodo into g
//                            select new
//                            {
//                                Id = g.Key,
//                                Periodo = g.Key
//                            };

//                foreach (var elemento in datos)
//                {
//                    lista.Add(new
//                    {
//                        Id = elemento.Id,
//                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
//                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
//                    });
//                }

//                total = lista.Count();
//                lista = lista.Skip(start).Take(limit).ToList();
//                respuesta = new { success = true, results = lista, total = total };
//            }
//            catch (Exception e)
//            {
//                lista = null;
//                respuesta = new { success = false, results = e.Message };
//            }

//            return Json(respuesta, JsonRequestBehavior.AllowGet);
//        }

//        public JsonResult LlenaGrid(DateTime periodo, int start, int limit)
//        {
//            object respuesta = null;
//            List<object> lista = new List<object>();
//            int total = 0;
//            try
//            {
//                var query = from cancelacion in db.CancelacionIngresoRom
//                            where cancelacion.Periodo.Month == periodo.Month &&
//                            cancelacion.Periodo.Year == periodo.Year &&
//                            cancelacion.Id_LineaNegocio == 1
//                            select new
//                            {
//                                cancelacion.Id,
//                                cancelacion.Bandera,
//                                cancelacion.No_Provision,
//                                cancelacion.Id_Operador,
//                                cancelacion.Concepto,
//                                cancelacion.Id_Grupo,
//                                cancelacion.Id_Deudor,
//                                cancelacion.Monto_Provision,
//                                cancelacion.Id_Moneda,
//                                cancelacion.Periodo,
//                                cancelacion.Tipo,
//                                cancelacion.No_Documento,
//                                cancelacion.Folio_Documento,
//                                cancelacion.TC_Provision,
//                                cancelacion.Importe_MXN,
//                                cancelacion.Importe_Factura,
//                                cancelacion.Div_Prov_Factura,
//                                cancelacion.Tipo_Cambio_Factura,
//                                cancelacion.Exceso_ProvMXN,
//                                cancelacion.Insuficiencia_ProvMXN,
//                            };
//                foreach (var elemento in query)
//                {
//                    lista.Add(new
//                    {
//                        elemento.Id,
//                        elemento.Bandera,
//                        elemento.No_Provision,
//                        elemento.Id_Operador,
//                        elemento.Concepto,
//                        elemento.Id_Grupo,
//                        elemento.Id_Deudor,
//                        elemento.Monto_Provision,
//                        elemento.Id_Moneda,
//                        periodo = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month],
//                        elemento.Tipo,
//                        elemento.No_Documento,
//                        elemento.Folio_Documento,
//                        elemento.TC_Provision,
//                        elemento.Importe_MXN,
//                        elemento.Importe_Factura,
//                        elemento.Div_Prov_Factura,
//                        elemento.Tipo_Cambio_Factura,
//                        elemento.Exceso_ProvMXN,
//                        elemento.Insuficiencia_ProvMXN

//                    });
//                }

//                total = lista.Count();
//                lista = lista.Skip(start).Take(limit).ToList();
//                respuesta = new { results = lista, start = start, limit = limit, total = total, succes = true };

//            }
//            catch (Exception e)
//            {
//                respuesta = new { success = false, results = e.Message };
//            }
//            return Json(respuesta, JsonRequestBehavior.AllowGet);
//        }

//        //[HttpPost]
//        //public JsonResult ExportarReporte(DateTime periodo)
//        //{
//        //    string nombreArchivo = "Cierre LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
//        //    string templatePath = Server.MapPath("~/Plantillas/Cierre_LDI.xlsx");
//        //    string filePath = @"C:\\RepositoriosDocs\\Cierre LDI\\" + nombreArchivo;
//        //    object respuesta = null;
//        //    int fila = 5;
//        //    FileInfo datafile = new FileInfo(templatePath);

//        //    decimal tipo_cambio = (decimal)db.TC_Cierre.Where(x => x.Mes_Consumo.Year == periodo.Year && x.Mes_Consumo.Month == (periodo.Month) && x.Id_Moneda == 5 && x.Id_LineaNegocio == 2 && x.Activo == 1).Select(x => x.TC_MXN).SingleOrDefault();

//        //    if (System.IO.File.Exists(filePath))
//        //    {
//        //        datafile = new FileInfo(filePath);
//        //    }

//        //    using (ExcelPackage excelPackage = new ExcelPackage(datafile))
//        //    {
//        //        // Selecciona la hoja de Cirre Costo
//        //        ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["Costo LDI"];
//        //        worksheet.Cells["D1"].Value = meses[periodo.Month];
//        //        worksheet.Cells["D1"].Style.Font.Color.SetColor(Color.Red);
//        //        worksheet.Cells["H1"].Value = tipo_cambio;
//        //        worksheet.Cells["H1"].Style.Numberformat.Format = "_-$* #,##0.00_-";

//        //        try
//        //        {
//        //            List<cierreCostosLDI> lista = new List<cierreCostosLDI>();
//        //            var query = from costos in db.cierreCostosLDI
//        //                        where costos.periodo.Month == periodo.Month &&
//        //                        costos.periodo.Year == periodo.Year &&
//        //                        costos.lineaNegocio == 2
//        //                        select new
//        //                        {
//        //                            costos.Id,
//        //                            costos.periodo,
//        //                            costos.moneda,
//        //                            costos.operador,
//        //                            costos.trafico,
//        //                            costos.minuto,
//        //                            costos.tarifa,
//        //                            costos.USD,
//        //                            costos.MXN,
//        //                            costos.tipoCambio
//        //                        };
//        //            foreach (var elemento in query)
//        //            {
//        //                lista.Add(new cierreCostosLDI
//        //                {
//        //                    Id = elemento.Id,
//        //                    moneda = elemento.moneda,
//        //                    operador = elemento.operador,
//        //                    trafico = elemento.trafico,
//        //                    minuto = elemento.minuto,
//        //                    tarifa = elemento.tarifa,
//        //                    USD = elemento.USD,
//        //                    MXN = elemento.MXN,
//        //                    tipoCambio = elemento.tipoCambio
//        //                });
//        //            }

//        //            foreach (cierreCostosLDI row in lista)
//        //            {
//        //                if (row.operador != "TOTAL GENERAL")
//        //                    worksheet.Cells[("A" + fila)].Value = meses[periodo.Month] + " " + periodo.Year;
//        //                worksheet.Cells[("B" + fila)].Value = row.moneda;
//        //                worksheet.Cells[("C" + fila)].Value = row.operador;
//        //                worksheet.Cells[("D" + fila)].Value = row.trafico;

//        //                worksheet.Cells[("E" + fila)].Value = row.minuto;
//        //                worksheet.Cells[("E" + fila)].Style.Numberformat.Format = "#,##0.00_-";

//        //                worksheet.Cells[("F" + fila)].Value = row.tarifa;
//        //                worksheet.Cells[("F" + fila)].Style.Numberformat.Format = "#,##0.0000_-";

//        //                worksheet.Cells[("G" + fila)].Value = row.USD;
//        //                worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "#,##0.00_-";

//        //                worksheet.Cells[("H" + fila)].Value = row.MXN;
//        //                worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

//        //                worksheet.Column(fila).AutoFit();
//        //                if (row.trafico == "TOTAL")
//        //                {
//        //                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.PatternType = ExcelFillStyle.Solid;
//        //                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.BackgroundColor.SetColor(Color.Khaki);

//        //                    fila++;
//        //                }
//        //                fila++;
//        //            }

//        //            if (System.IO.File.Exists(filePath))
//        //            {
//        //                excelPackage.Save();
//        //            }
//        //            else if (System.IO.File.Exists(templatePath))
//        //            {
//        //                FileInfo newfile = new FileInfo(filePath);
//        //                excelPackage.SaveAs(newfile);
//        //            }

//        //            if (System.IO.File.Exists(filePath))
//        //            {
//        //                byte[] bytesfile = System.IO.File.ReadAllBytes(filePath);
//        //                respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
//        //            }
//        //            else
//        //            {
//        //                respuesta = new { results = "", success = false };
//        //            }

//        //        }
//        //        catch (Exception err)
//        //        {
//        //            respuesta = new { results = err.Message, success = false };
//        //        }
//        //        return Json(respuesta, JsonRequestBehavior.AllowGet);
//        //    }
//        //}
//    }
//}