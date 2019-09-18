using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Web.Mvc;
using IC2.Models;
using System.Transactions;
using OfficeOpenXml;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PXQCostosROMController : Controller
    {
        // GET: 
        ICPruebaEntities db = new ICPruebaEntities();
        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"}, {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"}, {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"}, {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        public ActionResult Index()
        {
            //CalcularPXQCostos(new DateTime(2018, 09, 01));
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
            //db.sp_InsertarPXQCostosROM();
            try
            {
                var datos = from oPXQ in db.PXQCostosROM
                            where oPXQ.lineaNegocio == lineaNegocio
                            group oPXQ by oPXQ.fecha into g
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
                respuesta = new { success = true, results = lista, total };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message, total = 0 };
                lista = null;
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
                var query = from pc in db.PXQCostosROM
                            where pc.fecha.Month == periodo.Month &&
                            pc.fecha.Year == periodo.Year &&
                            pc.lineaNegocio == 1
                            select new
                            {
                                pc.Id,
                                pc.fecha,
                                pc.PLMNPROVTAR,
                                pc.PLMN_V,
                                pc.PLMN_GPO,
                                pc.pais,
                                pc.acreedor,
                                pc.MIN_MOC_REDONDEADO,
                                pc.MIN_MOC_REAL,
                                pc.SDR_MOC,
                                pc.MIN_MTC_REDONDEADO,
                                pc.MIN_MTC_REAL,
                                pc.SDR_MTC,
                                pc.SMS_MO,
                                pc.SDR_SMS,
                                pc.GPRS,
                                pc.SDR_GPRS,
                                pc.USD_MOC,
                                pc.USD_MTC,
                                pc.USD_SMS_MO,
                                pc.USD_GPRS,
                                pc.COSTO_TRAFICO_USD,
                                pc.tarifa_MOC,
                                pc.tarifa_MTC,
                                pc.tarifa_SMS_MO,
                                pc.tarifa_GPRS,
                                pc.IOT_TAR_MOC,
                                pc.IOT_TAR_MTC,
                                pc.IOT_TAR_SMS_MO,
                                pc.IOT_TAR_GPRS,
                                pc.USD_MOC_IOTFacturado,
                                pc.USD_MTC_IOTFacturado,
                                pc.USD_SMS_MO_IOTFacturado,
                                pc.USD_GPRS_IOTFacturado,
                                pc.USD_MOC_IOT_REAL,
                                pc.USD_MTC_IOT_REAL,
                                pc.USD_MOC_IOT_DESC,
                                pc.USD_MTC_IOT_DESC,
                                pc.USD_SMS_MO_IOT_DESC,
                                pc.USD_GPRS_IOT_DESC,
                                pc.USD_SUMA_PROV_TARIFA,
                                pc.costosFijosRecurrentes,
                                pc.PROVRealTarifaMesAnteriorUSD,
                                pc.PROVTarMesAnteriorUSD,
                                pc.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                                pc.total_USD_PROV_Tarifa,
                                pc.facturacionRealMesAnteriorUSD,
                                pc.PROVTraficoMesAnteriorUSD,
                                pc.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                pc.ajusteSaldoMesAnterior,
                                pc.totalUSDTrafico,
                                pc.ajusteTraficoMesAnterior,
                                pc.ajusteTarifaMesAnterior,
                                pc.ajusteCostosRecurresntesMesesAnteriores,
                                pc.complementoTarifaMesAnterior,
                                pc.ajusteMesesAnterioresUSD,
                                pc.totalNeto,
                                pc.lineaNegocio
                            };
                foreach (var elemento in query)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        fecha = elemento.fecha.Day + "/" + elemento.fecha.Month + "/" + elemento.fecha.Year,
                        elemento.PLMNPROVTAR,
                        elemento.PLMN_V,
                        elemento.PLMN_GPO,
                        elemento.pais,
                        elemento.acreedor,
                        elemento.MIN_MOC_REDONDEADO,
                        elemento.MIN_MOC_REAL,
                        elemento.SDR_MOC,
                        elemento.MIN_MTC_REDONDEADO,
                        elemento.MIN_MTC_REAL,
                        elemento.SDR_MTC,
                        elemento.SMS_MO,
                        elemento.SDR_SMS,
                        elemento.GPRS,
                        elemento.SDR_GPRS,
                        elemento.USD_MOC,
                        elemento.USD_MTC,
                        elemento.USD_SMS_MO,
                        elemento.USD_GPRS,
                        elemento.COSTO_TRAFICO_USD,
                        elemento.tarifa_MOC,
                        elemento.tarifa_MTC,
                        elemento.tarifa_SMS_MO,
                        elemento.tarifa_GPRS,
                        elemento.IOT_TAR_MOC,
                        elemento.IOT_TAR_MTC,
                        elemento.IOT_TAR_SMS_MO,
                        elemento.IOT_TAR_GPRS,
                        elemento.USD_MOC_IOTFacturado,
                        elemento.USD_MTC_IOTFacturado,
                        elemento.USD_SMS_MO_IOTFacturado,
                        elemento.USD_GPRS_IOTFacturado,
                        elemento.USD_MOC_IOT_REAL,
                        elemento.USD_MTC_IOT_REAL,
                        elemento.USD_MOC_IOT_DESC,
                        elemento.USD_MTC_IOT_DESC,
                        elemento.USD_SMS_MO_IOT_DESC,
                        elemento.USD_GPRS_IOT_DESC,
                        elemento.USD_SUMA_PROV_TARIFA,
                        elemento.costosFijosRecurrentes,
                        elemento.PROVRealTarifaMesAnteriorUSD,
                        elemento.PROVTarMesAnteriorUSD,
                        elemento.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                        elemento.total_USD_PROV_Tarifa,
                        elemento.facturacionRealMesAnteriorUSD,
                        elemento.PROVTraficoMesAnteriorUSD,
                        elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                        elemento.ajusteSaldoMesAnterior,
                        elemento.totalUSDTrafico,
                        elemento.ajusteTraficoMesAnterior,
                        elemento.ajusteTarifaMesAnterior,
                        elemento.ajusteCostosRecurresntesMesesAnteriores,
                        elemento.complementoTarifaMesAnterior,
                        elemento.ajusteMesesAnterioresUSD,
                        elemento.totalNeto,
                        elemento.lineaNegocio
                    });
                }

                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                respuesta = new { results = lista, start = start, limit = limit, total = total, succes = true };

            }
            catch (Exception e)
            {
                respuesta = new { results = e, success = false };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult ExportarReporte(DateTime periodo)
        {
            string nombreArchivo = "PxQ ROM " + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/PxQ_ROM.xlsx");
            object respuesta = null;
            int fila = 2;
            FileInfo datafile = new FileInfo(templatePath);
            

            using (ExcelPackage excelPackage = new ExcelPackage(datafile))
            {
                ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["PxQ Costos ROM"];

                try
                {
                    List<PXQCostosROM> lista = new List<PXQCostosROM>();
                    var query = from PxQC in db.PXQCostosROM
                                where PxQC.fecha.Month == periodo.Month &&
                                        PxQC.fecha.Year == periodo.Year
                                select new
                                {
                                    PxQC.Id,
                                    PxQC.fecha,
                                    PxQC.PLMNPROVTAR,
                                    PxQC.PLMN_V,
                                    PxQC.PLMN_GPO,
                                    PxQC.pais,
                                    PxQC.acreedor,
                                    PxQC.MIN_MOC_REDONDEADO,
                                    PxQC.MIN_MOC_REAL,
                                    PxQC.SDR_MOC,
                                    PxQC.MIN_MTC_REDONDEADO,
                                    PxQC.MIN_MTC_REAL,
                                    PxQC.SDR_MTC,
                                    PxQC.SMS_MO,
                                    PxQC.SDR_SMS,
                                    PxQC.GPRS,
                                    PxQC.SDR_GPRS,
                                    PxQC.USD_MOC,
                                    PxQC.USD_MTC,
                                    PxQC.USD_SMS_MO,
                                    PxQC.USD_GPRS,
                                    PxQC.COSTO_TRAFICO_USD,
                                    PxQC.tarifa_MOC,
                                    PxQC.tarifa_MTC,
                                    PxQC.tarifa_SMS_MO,
                                    PxQC.tarifa_GPRS,
                                    PxQC.IOT_TAR_MOC,
                                    PxQC.IOT_TAR_MTC,
                                    PxQC.IOT_TAR_SMS_MO,
                                    PxQC.IOT_TAR_GPRS,
                                    PxQC.USD_MOC_IOTFacturado,
                                    PxQC.USD_MTC_IOTFacturado,
                                    PxQC.USD_SMS_MO_IOTFacturado,
                                    PxQC.USD_GPRS_IOTFacturado,
                                    PxQC.USD_MOC_IOT_REAL,
                                    PxQC.USD_MTC_IOT_REAL,
                                    PxQC.USD_MOC_IOT_DESC,
                                    PxQC.USD_MTC_IOT_DESC,
                                    PxQC.USD_SMS_MO_IOT_DESC,
                                    PxQC.USD_GPRS_IOT_DESC,
                                    PxQC.USD_SUMA_PROV_TARIFA,
                                    PxQC.costosFijosRecurrentes,
                                    PxQC.PROVRealTarifaMesAnteriorUSD,
                                    PxQC.PROVTarMesAnteriorUSD,
                                    PxQC.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                                    PxQC.total_USD_PROV_Tarifa,
                                    PxQC.facturacionRealMesAnteriorUSD,
                                    PxQC.PROVTraficoMesAnteriorUSD,
                                    PxQC.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                    PxQC.ajusteSaldoMesAnterior,
                                    PxQC.totalUSDTrafico,
                                    PxQC.ajusteTraficoMesAnterior,
                                    PxQC.ajusteTarifaMesAnterior,
                                    PxQC.ajusteCostosRecurresntesMesesAnteriores,
                                    PxQC.complementoTarifaMesAnterior,
                                    PxQC.ajusteMesesAnterioresUSD,
                                    PxQC.totalNeto,
                                };
                    foreach (var elemento in query)
                    {
                        lista.Add(new PXQCostosROM
                        {
                            fecha = elemento.fecha,
                            PLMNPROVTAR = elemento.PLMNPROVTAR,
                            PLMN_V = elemento.PLMN_V,
                            PLMN_GPO = elemento.PLMN_GPO,
                            pais = elemento.pais,
                            acreedor = elemento.acreedor,
                            MIN_MOC_REDONDEADO = elemento.MIN_MOC_REDONDEADO,
                            MIN_MOC_REAL = elemento.MIN_MOC_REAL,
                            SDR_MOC = elemento.SDR_MOC,
                            MIN_MTC_REDONDEADO = elemento.MIN_MTC_REDONDEADO,
                            MIN_MTC_REAL = elemento.MIN_MTC_REAL,
                            SDR_MTC = elemento.SDR_MTC,
                            SMS_MO = elemento.SMS_MO,
                            SDR_SMS = elemento.SDR_SMS,
                            GPRS = elemento.GPRS,
                            SDR_GPRS = elemento.SDR_GPRS,
                            USD_MOC = elemento.USD_MOC,
                            USD_MTC = elemento.USD_MTC,
                            USD_SMS_MO = elemento.USD_SMS_MO,
                            USD_GPRS = elemento.USD_GPRS,
                            COSTO_TRAFICO_USD = elemento.COSTO_TRAFICO_USD,
                            tarifa_MOC = elemento.tarifa_MOC,
                            tarifa_MTC = elemento.tarifa_MTC,
                            tarifa_SMS_MO = elemento.tarifa_SMS_MO,
                            tarifa_GPRS = elemento.tarifa_GPRS,
                            IOT_TAR_MOC = elemento.IOT_TAR_MOC,
                            IOT_TAR_MTC = elemento.IOT_TAR_MTC,
                            IOT_TAR_SMS_MO = elemento.IOT_TAR_SMS_MO,
                            IOT_TAR_GPRS = elemento.IOT_TAR_GPRS,
                            USD_MOC_IOTFacturado = elemento.USD_MOC_IOTFacturado,
                            USD_MTC_IOTFacturado = elemento.USD_MTC_IOTFacturado,
                            USD_SMS_MO_IOTFacturado = elemento.USD_SMS_MO_IOTFacturado,
                            USD_GPRS_IOTFacturado = elemento.USD_GPRS_IOTFacturado,
                            USD_MOC_IOT_REAL = elemento.USD_MOC_IOT_REAL,
                            USD_MTC_IOT_REAL = elemento.USD_MTC_IOT_REAL,
                            USD_MOC_IOT_DESC = elemento.USD_MOC_IOT_DESC,
                            USD_MTC_IOT_DESC = elemento.USD_MTC_IOT_DESC,
                            USD_SMS_MO_IOT_DESC = elemento.USD_SMS_MO_IOT_DESC,
                            USD_GPRS_IOT_DESC = elemento.USD_GPRS_IOT_DESC,
                            USD_SUMA_PROV_TARIFA = elemento.USD_SUMA_PROV_TARIFA,
                            costosFijosRecurrentes = elemento.costosFijosRecurrentes,
                            PROVRealTarifaMesAnteriorUSD = elemento.PROVRealTarifaMesAnteriorUSD,
                            PROVTarMesAnteriorUSD = elemento.PROVTarMesAnteriorUSD,
                            ajuste_Real_VS_DevengoTarifaMesAnteriroUSD = elemento.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD,
                            total_USD_PROV_Tarifa = elemento.total_USD_PROV_Tarifa,
                            facturacionRealMesAnteriorUSD = elemento.facturacionRealMesAnteriorUSD,
                            PROVTraficoMesAnteriorUSD = elemento.PROVTraficoMesAnteriorUSD,
                            ajusteReal_VS_DevengoTraficoMesAnteriorUSD = elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                            ajusteSaldoMesAnterior = elemento.ajusteSaldoMesAnterior,
                            totalUSDTrafico = elemento.totalUSDTrafico,
                            ajusteTraficoMesAnterior = elemento.ajusteTraficoMesAnterior,
                            ajusteTarifaMesAnterior = elemento.ajusteTarifaMesAnterior,
                            ajusteCostosRecurresntesMesesAnteriores = elemento.ajusteCostosRecurresntesMesesAnteriores,
                            complementoTarifaMesAnterior = elemento.complementoTarifaMesAnterior,
                            ajusteMesesAnterioresUSD = elemento.ajusteMesesAnterioresUSD,
                            totalNeto = elemento.totalNeto,

                        });
                    }
                    foreach (PXQCostosROM row in lista)
                    {
                        worksheet.Cells[("A" + fila)].Value = meses[periodo.Month] + " " + periodo.Year;
                        worksheet.Cells[("B" + fila)].Value = row.PLMNPROVTAR;
                        worksheet.Cells[("C" + fila)].Value = row.PLMN_V;
                        worksheet.Cells[("D" + fila)].Value = row.PLMN_GPO;
                        worksheet.Cells[("E" + fila)].Value = row.pais;
                        worksheet.Cells[("F" + fila)].Value = row.acreedor;
                        worksheet.Cells[("G" + fila)].Value = row.MIN_MOC_REDONDEADO;
                        worksheet.Cells[("G" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("H" + fila)].Value = row.MIN_MOC_REAL;
                        worksheet.Cells[("H" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("I" + fila)].Value = row.SDR_MOC;
                        worksheet.Cells[("I" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("J" + fila)].Value = row.MIN_MTC_REDONDEADO;
                        worksheet.Cells[("J" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("K" + fila)].Value = row.MIN_MTC_REAL;
                        worksheet.Cells[("K" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("L" + fila)].Value = row.SDR_MTC;
                        worksheet.Cells[("L" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("M" + fila)].Value = row.SMS_MO;
                        worksheet.Cells[("M" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("N" + fila)].Value = row.SDR_SMS;
                        worksheet.Cells[("N" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("O" + fila)].Value = row.GPRS;
                        worksheet.Cells[("O" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("P" + fila)].Value = row.SDR_GPRS;
                        worksheet.Cells[("P" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("Q" + fila)].Value = row.USD_MOC;
                        worksheet.Cells[("Q" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("R" + fila)].Value = row.USD_MTC;
                        worksheet.Cells[("R" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("S" + fila)].Value = row.USD_SMS_MO;
                        worksheet.Cells[("S" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("T" + fila)].Value = row.USD_GPRS;
                        worksheet.Cells[("T" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("U" + fila)].Value = row.COSTO_TRAFICO_USD;
                        worksheet.Cells[("U" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("V" + fila)].Value = row.tarifa_MOC;
                        worksheet.Cells[("V" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("W" + fila)].Value = row.tarifa_MTC;
                        worksheet.Cells[("W" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("X" + fila)].Value = row.tarifa_SMS_MO;
                        worksheet.Cells[("X" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("Y" + fila)].Value = row.tarifa_GPRS;
                        worksheet.Cells[("Y" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("Z" + fila)].Value = row.IOT_TAR_MOC;
                        worksheet.Cells[("Z" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AA" + fila)].Value = row.IOT_TAR_MTC;
                        worksheet.Cells[("AA" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AB" + fila)].Value = row.IOT_TAR_SMS_MO;
                        worksheet.Cells[("AB" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AC" + fila)].Value = row.IOT_TAR_GPRS;
                        worksheet.Cells[("AC" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AD" + fila)].Value = row.USD_MOC_IOTFacturado;
                        worksheet.Cells[("AD" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AE" + fila)].Value = row.USD_MTC_IOTFacturado;
                        worksheet.Cells[("AE" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AF" + fila)].Value = row.USD_SMS_MO_IOTFacturado;
                        worksheet.Cells[("AF" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AG" + fila)].Value = row.USD_GPRS_IOTFacturado;
                        worksheet.Cells[("AG" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AH" + fila)].Value = row.USD_MOC_IOT_REAL;
                        worksheet.Cells[("AH" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AI" + fila)].Value = row.USD_MTC_IOT_REAL;
                        worksheet.Cells[("AI" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AJ" + fila)].Value = row.USD_MOC_IOT_DESC;
                        worksheet.Cells[("AJ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AK" + fila)].Value = row.USD_MTC_IOT_DESC;
                        worksheet.Cells[("AK" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AL" + fila)].Value = row.USD_SMS_MO_IOT_DESC;
                        worksheet.Cells[("AL" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AM" + fila)].Value = row.USD_GPRS_IOT_DESC;
                        worksheet.Cells[("AM" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AN" + fila)].Value = row.USD_SUMA_PROV_TARIFA;
                        worksheet.Cells[("AN" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AO" + fila)].Value = row.costosFijosRecurrentes;
                        worksheet.Cells[("AO" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AP" + fila)].Value = row.PROVRealTarifaMesAnteriorUSD;
                        worksheet.Cells[("AP" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AQ" + fila)].Value = row.PROVTarMesAnteriorUSD;
                        worksheet.Cells[("AQ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AR" + fila)].Value = row.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD;
                        worksheet.Cells[("AR" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AS" + fila)].Value = row.total_USD_PROV_Tarifa;
                        worksheet.Cells[("AS" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AT" + fila)].Value = row.facturacionRealMesAnteriorUSD;
                        worksheet.Cells[("AT" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AU" + fila)].Value = row.PROVTraficoMesAnteriorUSD;
                        worksheet.Cells[("AU" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AV" + fila)].Value = row.ajusteReal_VS_DevengoTraficoMesAnteriorUSD;
                        worksheet.Cells[("AV" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AW" + fila)].Value = row.ajusteSaldoMesAnterior;
                        worksheet.Cells[("AW" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AX" + fila)].Value = row.totalUSDTrafico;
                        worksheet.Cells[("AX" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AY" + fila)].Value = row.ajusteTraficoMesAnterior;
                        worksheet.Cells[("AY" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AZ" + fila)].Value = row.ajusteTarifaMesAnterior;
                        worksheet.Cells[("AZ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BA" + fila)].Value = row.ajusteCostosRecurresntesMesesAnteriores;
                        worksheet.Cells[("BA" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BB" + fila)].Value = row.complementoTarifaMesAnterior;
                        worksheet.Cells[("BB" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BC" + fila)].Value = row.ajusteMesesAnterioresUSD;
                        worksheet.Cells[("BC" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BD" + fila)].Value = row.totalNeto;
                        worksheet.Cells[("BD" + fila)].Style.Numberformat.Format = "#,##0.00_-";

                        ++fila;


                    }
                    worksheet.Cells[("C" + (fila + 4))].Value = "SUMAS TOTALES";
                    var sum1 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MOC_REDONDEADO);
                    worksheet.Cells[("G" + (fila + 4))].Value = sum1;
                    worksheet.Cells[("G" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum2 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MOC_REAL);
                    worksheet.Cells[("H" + (fila + 4))].Value = sum2;
                    worksheet.Cells[("H" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum3 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_MOC);
                    worksheet.Cells[("I" + (fila + 4))].Value = sum3;
                    worksheet.Cells[("I" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum4 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MTC_REDONDEADO);
                    worksheet.Cells[("J" + (fila + 4))].Value = sum4;
                    worksheet.Cells[("J" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum5 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MTC_REAL);
                    worksheet.Cells[("K" + (fila + 4))].Value = sum5;
                    worksheet.Cells[("K" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum6 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_MTC);
                    worksheet.Cells[("L" + (fila + 4))].Value = sum6;
                    worksheet.Cells[("L" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum7 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.SMS_MO);
                    worksheet.Cells[("M" + (fila + 4))].Value = sum7;
                    worksheet.Cells[("M" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum8 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_SMS);
                    worksheet.Cells[("N" + (fila + 4))].Value = sum8;
                    worksheet.Cells[("N" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum9 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.GPRS);
                    worksheet.Cells[("O" + (fila + 4))].Value = sum9;
                    worksheet.Cells[("O" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum10 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_GPRS);
                    worksheet.Cells[("P" + (fila + 4))].Value = sum10;
                    worksheet.Cells[("P" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum11 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC);
                    worksheet.Cells[("Q" + (fila + 4))].Value = sum11;
                    worksheet.Cells[("Q" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum12 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC);
                    worksheet.Cells[("R" + (fila + 4))].Value = sum12;
                    worksheet.Cells[("R" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum13 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SMS_MO);
                    worksheet.Cells[("S" + (fila + 4))].Value = sum13;
                    worksheet.Cells[("S" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum14 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_GPRS);
                    worksheet.Cells[("T" + (fila + 4))].Value = sum14;
                    worksheet.Cells[("T" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum15 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.COSTO_TRAFICO_USD);
                    worksheet.Cells[("U" + (fila + 4))].Value = sum15;
                    worksheet.Cells[("U" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum16 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_MOC);
                    worksheet.Cells[("v" + (fila + 4))].Value = sum16;
                    worksheet.Cells[("v" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum17 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_MTC);
                    worksheet.Cells[("W" + (fila + 4))].Value = sum17;
                    worksheet.Cells[("W" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum18 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_SMS_MO);
                    worksheet.Cells[("X" + (fila + 4))].Value = sum18;
                    worksheet.Cells[("X" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum19 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_GPRS);
                    worksheet.Cells[("Y" + (fila + 4))].Value = sum19;
                    worksheet.Cells[("Y" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum20 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_MOC);
                    worksheet.Cells[("Z" + (fila + 4))].Value = sum20;
                    worksheet.Cells[("Z" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum21 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_MTC);
                    worksheet.Cells[("AA" + (fila + 4))].Value = sum21;
                    worksheet.Cells[("AA" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum22 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_SMS_MO);
                    worksheet.Cells[("AB" + (fila + 4))].Value = sum22;
                    worksheet.Cells[("AB" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum23 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_GPRS);
                    worksheet.Cells[("AC" + (fila + 4))].Value = sum23;
                    worksheet.Cells[("AC" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum24 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC_IOTFacturado);
                    worksheet.Cells[("AD" + (fila + 4))].Value = sum24;
                    worksheet.Cells[("AD" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum25 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC_IOTFacturado);
                    worksheet.Cells[("AE" + (fila + 4))].Value = sum25;
                    worksheet.Cells[("AE" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum26 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SMS_MO_IOTFacturado);
                    worksheet.Cells[("AF" + (fila + 4))].Value = sum26;
                    worksheet.Cells[("AF" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum27 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_GPRS_IOTFacturado);
                    worksheet.Cells[("AG" + (fila + 4))].Value = sum27;
                    worksheet.Cells[("AG" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum28 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC_IOT_REAL);
                    worksheet.Cells[("AH" + (fila + 4))].Value = sum28;
                    worksheet.Cells[("AH" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum29 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC_IOT_REAL);
                    worksheet.Cells[("AI" + (fila + 4))].Value = sum29;
                    worksheet.Cells[("AI" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum30 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC_IOT_DESC);
                    worksheet.Cells[("AJ" + (fila + 4))].Value = sum30;
                    worksheet.Cells[("AJ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum31 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC_IOT_DESC);
                    worksheet.Cells[("AK" + (fila + 4))].Value = sum31;
                    worksheet.Cells[("AK" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum32 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SMS_MO_IOT_DESC);
                    worksheet.Cells[("AL" + (fila + 4))].Value = sum32;
                    worksheet.Cells[("AL" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum33 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_GPRS_IOT_DESC);
                    worksheet.Cells[("AM" + (fila + 4))].Value = sum33;
                    worksheet.Cells[("AM" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum34 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SUMA_PROV_TARIFA);
                    worksheet.Cells[("AN" + (fila + 4))].Value = sum34;
                    worksheet.Cells[("AN" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum35 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.costosFijosRecurrentes);
                    worksheet.Cells[("AO" + (fila + 4))].Value = sum35;
                    worksheet.Cells[("AO" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum36 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.PROVRealTarifaMesAnteriorUSD);
                    worksheet.Cells[("AP" + (fila + 4))].Value = sum36;
                    worksheet.Cells[("AP" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum37 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.PROVTarMesAnteriorUSD);
                    worksheet.Cells[("AQ" + (fila + 4))].Value = sum37;
                    worksheet.Cells[("AQ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum38 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajuste_Real_VS_DevengoTarifaMesAnteriroUSD);
                    worksheet.Cells[("AR" + (fila + 4))].Value = sum38;
                    worksheet.Cells[("AR" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum39 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.total_USD_PROV_Tarifa);
                    worksheet.Cells[("AS" + (fila + 4))].Value = sum39;
                    worksheet.Cells[("AS" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum40 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.facturacionRealMesAnteriorUSD);
                    worksheet.Cells[("AT" + (fila + 4))].Value = sum40;
                    worksheet.Cells[("AT" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum41 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.PROVTraficoMesAnteriorUSD);
                    worksheet.Cells[("AU" + (fila + 4))].Value = sum41;
                    worksheet.Cells[("AU" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum42 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                    worksheet.Cells[("AV" + (fila + 4))].Value = sum42;
                    worksheet.Cells[("AV" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum43 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteSaldoMesAnterior);
                    worksheet.Cells[("AW" + (fila + 4))].Value = sum43;
                    worksheet.Cells[("AW" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum44 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.totalUSDTrafico);
                    worksheet.Cells[("AX" + (fila + 4))].Value = sum44;
                    worksheet.Cells[("AX" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum45 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteTraficoMesAnterior);
                    worksheet.Cells[("AY" + (fila + 4))].Value = sum45;
                    worksheet.Cells[("AY" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum46 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteTarifaMesAnterior);
                    worksheet.Cells[("AZ" + (fila + 4))].Value = sum46;
                    worksheet.Cells[("AZ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum47 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteCostosRecurresntesMesesAnteriores);
                    worksheet.Cells[("BA" + (fila + 4))].Value = sum47;
                    worksheet.Cells[("BA" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum48 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.complementoTarifaMesAnterior);
                    worksheet.Cells[("BB" + (fila + 4))].Value = sum48;
                    worksheet.Cells[("BB" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum49 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteMesesAnterioresUSD);
                    worksheet.Cells[("BC" + (fila + 4))].Value = sum49;
                    worksheet.Cells[("BC" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum50 = db.PXQCostosROM.Where(x => x.fecha == periodo).Sum(x => x.totalNeto);
                    worksheet.Cells[("BD" + (fila + 4))].Value = sum50;
                    worksheet.Cells[("BD" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    

                    byte[] bytesfile = excelPackage.GetAsByteArray(); ;
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                    
                }
                catch (Exception err)
                {
                    respuesta = new { success = false, results = err.Message };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }

        
        public void SavePXQCostos(List<PXQCostosLDI> lista)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                foreach (var elemento in lista)
                {
                    db.PXQCostosLDI.Add(elemento);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(elemento, "Nuevo", "PXQCostosLDI.html", Request.UserHostAddress);

                    db.SaveChanges();
                }
                scope.Complete();
            }
        }

        [HttpPost]
        public void ExportaCSV(DateTime periodo)
        {
        }
    }
}