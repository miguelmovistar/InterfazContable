using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.IO;
using System.Transactions;
using OfficeOpenXml;
using System.Drawing;
using OfficeOpenXml.Style;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CancelacionCostoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();

        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };
       
        public ActionResult Index()
        {
            //CalcularCierreCostos(new DateTime(2018, 09, 11));
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
                var datos = from periodos in db.CancelacionCostoRom
                            where periodos.Id_LineaNegocio == lineaNegocio
                            group periodos by periodos.Periodo into g
                            select new
                            {
                                Id = g.Key,
                                Periodo = g.Key
                            };

                foreach (var elemento in datos)
                {
                    lista.Add(new
                    {
                        Id = elemento.Id,
                        Periodo = elemento.Periodo.Year + "-" + elemento.Periodo.Month + "-" + elemento.Periodo.Day,
                        Fecha = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month]
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGrid(DateTime periodo, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;
            try
            {
                var query = from cancelacion in db.CancelacionCostoRom
                            where cancelacion.Periodo.Month == periodo.Month &&
                            cancelacion.Periodo.Year == periodo.Year &&
                            cancelacion.Id_LineaNegocio == 1
                            select new
                            {
                                cancelacion.Id,
                                cancelacion.Bandera,
                                cancelacion.No_Provision,
                                cancelacion.Id_Operador,
                                cancelacion.Concepto,
                                cancelacion.Id_Grupo,
                                cancelacion.Id_Acreedor,
                                cancelacion.Monto_Provision,
                                cancelacion.Id_Moneda,
                                cancelacion.Periodo,
                                cancelacion.Tipo,
                                cancelacion.No_Documento_Sap,
                                cancelacion.Folio_Documento,
                                cancelacion.TC_Provision,
                                cancelacion.Importe_MXN,
                                cancelacion.Importe_Factura,
                                cancelacion.Diferencia_ProvFactura,
                                cancelacion.Tipo_Cambio_Factura,
                                cancelacion.Exceso_Provision_MXN,
                                cancelacion.Insuficiencia_ProvisionMXN,
                            };
                foreach (var elemento in query)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        elemento.Bandera,
                        elemento.No_Provision,
                        elemento.Id_Operador,
                        elemento.Concepto,
                        elemento.Id_Grupo,
                        elemento.Id_Acreedor,
                        elemento.Monto_Provision,
                        elemento.Id_Moneda,
                        periodo = elemento.Periodo.Year + " " + meses[elemento.Periodo.Month],
                        elemento.Tipo,
                        elemento.No_Documento_Sap,
                        elemento.Folio_Documento,
                        elemento.TC_Provision,
                        elemento.Importe_MXN,
                        elemento.Importe_Factura,
                        elemento.Diferencia_ProvFactura,
                        elemento.Tipo_Cambio_Factura,
                        elemento.Exceso_Provision_MXN,
                        elemento.Insuficiencia_ProvisionMXN

                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { results = lista, start = start, limit = limit, total = total, succes = true };

            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        //public JsonResult ExportarReporte(DateTime periodo)
        //{
        //    string nombreArchivo = "Cierre LDI " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
        //    string templatePath = Server.MapPath("~/Plantillas/Cierre_LDI.xlsx");
        //    string filePath = @"C:\\RepositoriosDocs\\Cierre LDI\\" + nombreArchivo;
        //    object respuesta = null;
        //    int fila = 5;
        //    FileInfo datafile = new FileInfo(templatePath);

        //    decimal tipo_cambio = (decimal)db.TC_Cierre.Where(x => x.Mes_Consumo.Year == periodo.Year && x.Mes_Consumo.Month == (periodo.Month) && x.Id_Moneda == 5 && x.Id_LineaNegocio == 2 && x.Activo == 1).Select(x => x.TC_MXN).SingleOrDefault();

        //    if (System.IO.File.Exists(filePath))
        //    {
        //        datafile = new FileInfo(filePath);
        //    }

        //    using (ExcelPackage excelPackage = new ExcelPackage(datafile))
        //    {
        //        // Selecciona la hoja de Cirre Costo
        //        ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["Costo LDI"];
        //        worksheet.Cells["D1"].Value = meses[periodo.Month];
        //        worksheet.Cells["D1"].Style.Font.Color.SetColor(Color.Red);
        //        worksheet.Cells["H1"].Value = tipo_cambio;
        //        worksheet.Cells["H1"].Style.Numberformat.Format = "_-$* #,##0.00_-";

        //        try
        //        {
        //            List<cierreCostosLDI> lista = new List<cierreCostosLDI>();
        //            var query = from costos in db.cierreCostosLDI
        //                        where costos.periodo.Month == periodo.Month &&
        //                        costos.periodo.Year == periodo.Year &&
        //                        costos.lineaNegocio == 2
        //                        select new
        //                        {
        //                            costos.Id,
        //                            costos.periodo,
        //                            costos.moneda,
        //                            costos.operador,
        //                            costos.trafico,
        //                            costos.minuto,
        //                            costos.tarifa,
        //                            costos.USD,
        //                            costos.MXN,
        //                            costos.tipoCambio
        //                        };
        //            foreach (var elemento in query)
        //            {
        //                lista.Add(new cierreCostosLDI
        //                {
        //                    Id = elemento.Id,
        //                    moneda = elemento.moneda,
        //                    operador = elemento.operador,
        //                    trafico = elemento.trafico,
        //                    minuto = elemento.minuto,
        //                    tarifa = elemento.tarifa,
        //                    USD = elemento.USD,
        //                    MXN = elemento.MXN,
        //                    tipoCambio = elemento.tipoCambio
        //                });
        //            }

        //            foreach (cierreCostosLDI row in lista)
        //            {
        //                if (row.operador != "TOTAL GENERAL")
        //                    worksheet.Cells[("A" + fila)].Value = meses[periodo.Month] + " " + periodo.Year;
        //                worksheet.Cells[("B" + fila)].Value = row.moneda;
        //                worksheet.Cells[("C" + fila)].Value = row.operador;
        //                worksheet.Cells[("D" + fila)].Value = row.trafico;

        //                worksheet.Cells[("E" + fila)].Value = row.minuto;
        //                worksheet.Cells[("E" + fila)].Style.Numberformat.Format = "#,##0.00_-";

        //                worksheet.Cells[("F" + fila)].Value = row.tarifa;
        //                worksheet.Cells[("F" + fila)].Style.Numberformat.Format = "#,##0.0000_-";

        //                worksheet.Cells[("G" + fila)].Value = row.USD;
        //                worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "#,##0.00_-";

        //                worksheet.Cells[("H" + fila)].Value = row.MXN;
        //                worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "_-$* #,##0.00_-";

        //                worksheet.Column(fila).AutoFit();
        //                if (row.trafico == "TOTAL")
        //                {
        //                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.PatternType = ExcelFillStyle.Solid;
        //                    worksheet.Cells["E" + fila + ":H" + fila].Style.Fill.BackgroundColor.SetColor(Color.Khaki);

        //                    fila++;
        //                }
        //                fila++;
        //            }

        //            if (System.IO.File.Exists(filePath))
        //            {
        //                excelPackage.Save();
        //            }
        //            else if (System.IO.File.Exists(templatePath))
        //            {
        //                FileInfo newfile = new FileInfo(filePath);
        //                excelPackage.SaveAs(newfile);
        //            }

        //            if (System.IO.File.Exists(filePath))
        //            {
        //                byte[] bytesfile = System.IO.File.ReadAllBytes(filePath);
        //                respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
        //            }
        //            else
        //            {
        //                respuesta = new { results = "", success = false };
        //            }

        //        }
        //        catch (Exception err)
        //        {
        //            respuesta = new { results = err.Message, success = false };
        //        }
        //        return Json(respuesta, JsonRequestBehavior.AllowGet);
        //    }
        //}
    }
}