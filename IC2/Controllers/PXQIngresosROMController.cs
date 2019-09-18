using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using System.IO;
using System.Transactions;
using OfficeOpenXml;
using System.Text;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class PXQIngresosROMController : Controller
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

        // GET: PXQIngresos
        public ActionResult Index()
        {
            //LeerArchivo();
            //CalcularPXQIngresos(new DateTime(2018, 09, 01));

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

        /// <summary>
        /// Copia el layout de un archivo Excel Existe de nombre master_layout.xlsx
        /// </summary>  
        public bool CrearLayoutExcel(string nombre, string directorio)
        {
            // Crea el directorio del 
            if (!System.IO.Directory.Exists(directorio))
            {
                System.IO.Directory.CreateDirectory(directorio);
            }

            // Ubicacion del layout maestro
            string sourceFile = System.IO.Path.Combine(@"C:\RepositoriosDocs", "layout_master.xlsx");
            string destFile = System.IO.Path.Combine(directorio, nombre);

            // Copia el archivo con el layout, sobreescribe si ya existe
            try
            {
                System.IO.File.Copy(sourceFile, destFile, true);
            }
            catch (Exception)
            {
                return false;
            }


            if (System.IO.File.Exists(destFile))
                return true;
            return false;
        }

        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;

            try
            {
                ICPruebaEntities db = new ICPruebaEntities();

                var datos = from oPXQ in db.PXQIngresosROM
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
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception)
            {
                lista = null;
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaGrid(DateTime periodo, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            string dia = string.Empty;
            decimal total_MIN_MOC_REDONDEADO = 0;
            decimal total_MIN_MOC_REAL = 0;
            decimal total_SDR_MOC = 0;
            decimal total_MIN_MTC_REDONDEADO = 0;
            decimal total_MIN_MTC_REAL = 0;
            decimal total_SDR_MTC = 0;
            decimal total_SMS_MO = 0;
            decimal total_SDR_SMS = 0;
            decimal total_GPRS = 0;
            decimal total_SDR_GPRS = 0;
            decimal total_USD_MOC = 0;
            decimal total_USD_MTC = 0;
            decimal total_USD_SMS_MO = 0;
            decimal total_USD_GPRS = 0;
            decimal total_ingresoTraficoUSD = 0;
            decimal total_tarifa_MOC = 0;
            decimal total_tarifa_MTC = 0;
            decimal total_tarifa_SMS_MO = 0;
            decimal total_tarifa_GPRS = 0;
            decimal total_IOT_TAR_MOC = 0;
            decimal total_IOT_TAR_MTC = 0;
            decimal total_IOT_TAR_SMS_MO = 0;
            decimal total_IOT_TAR_GPRS = 0;
            decimal total_USD_MOC_IOTFacturado = 0;
            decimal total_USD_MTC_IOTFacturado = 0;
            decimal total_USD_SMS_MO_IOTFacturado = 0;
            decimal total_USD_GPRS_IOTFacturado = 0;
            decimal total_USD_MOC_IOT_REAL = 0;
            decimal total_USD_MTC_IOT_REAL = 0;
            decimal total_USD_MOC_IOT_DESC = 0;
            decimal total_USD_MTC_IOT_DESC = 0;
            decimal total_USD_SMS_MO_IOT_DESC = 0;
            decimal total_USD_GPRS_IOT_DESC = 0;
            decimal total_USD_SUMA_PROV_TARIFA = 0;
            decimal total_PROV_NC_M2M_USD = 0;
            decimal total_PROVRealTarifaMesAnteriorUSD = 0;
            decimal total_ajustePROV_M2M_USD_MesAnterior = 0;
            decimal total_PROV_TAR_MesAnteriorUSD = 0;
            decimal total_ajusteRal_VS_DevengoTarifaMesAnterior = 0;
            decimal total_total_USD_PROV_Tarifa = 0;
            decimal total_facturacion_REALTraficoMesAnterior = 0;
            decimal total_PROVTraficoMesAnteriorUSD = 0;
            decimal total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD = 0;
            decimal total_ajusteTraficoMesAnterior = 0;
            decimal total_ajusteTarifaMesAnterior = 0;
            decimal total_complementoTarifaMesAnterior = 0;
            decimal total_ajusteMesesAnterioresUSD = 0;
            decimal total_totalUSDTrafico = 0;
            decimal total_totalNetoUSD = 0;
            int total = 0;
            ICPruebaEntities db = new ICPruebaEntities();
            try
            {
                var query = from ingresos in db.PXQIngresosROM
                            orderby ingresos.PLMN_PROV_TAR
                            where ingresos.fecha.Month == periodo.Month &&
                            ingresos.fecha.Year == periodo.Year &&
                            ingresos.lineaNegocio == 1
                            select new
                            {
                                ingresos.Id,
                                ingresos.fecha,
                                ingresos.PLMN_PROV_TAR,
                                ingresos.PLMN_V,
                                ingresos.PLMN_GPO,
                                ingresos.pais,
                                ingresos.deudor,
                                ingresos.MIN_MOC_REDONDEADO,
                                ingresos.MIN_MOC_REAL,
                                ingresos.SDR_MOC,
                                ingresos.MIN_MTC_REDONDEADO,
                                ingresos.MIN_MTC_REAL,
                                ingresos.SDR_MTC,
                                ingresos.SMS_MO,
                                ingresos.SDR_SMS,
                                ingresos.GPRS,
                                ingresos.SDR_GPRS,
                                ingresos.USD_MOC,
                                ingresos.USD_MTC,
                                ingresos.USD_SMS_MO,
                                ingresos.USD_GPRS,
                                ingresos.ingresoTraficoUSD,
                                ingresos.tarifa_MOC,
                                ingresos.tarifa_MTC,
                                ingresos.tarifa_SMS_MO,
                                ingresos.tarifa_GPRS,
                                ingresos.IOT_TAR_MOC,
                                ingresos.IOT_TAR_MTC,
                                ingresos.IOT_TAR_SMS_MO,
                                ingresos.IOT_TAR_GPRS,
                                ingresos.USD_MOC_IOTFacturado,
                                ingresos.USD_MTC_IOTFacturado,
                                ingresos.USD_SMS_MO_IOTFacturado,
                                ingresos.USD_GPRS_IOTFacturado,
                                ingresos.USD_MOC_IOT_REAL,
                                ingresos.USD_MTC_IOT_REAL,
                                ingresos.USD_MOC_IOT_DESC,
                                ingresos.USD_MTC_IOT_DESC,
                                ingresos.USD_SMS_MO_IOT_DESC,
                                ingresos.USD_GPRS_IOT_DESC,
                                ingresos.USD_SUMA_PROV_TARIFA,
                                ingresos.PROV_NC_M2M_USD,
                                ingresos.PROVRealTarifaMesAnteriorUSD,
                                ingresos.ajustePROV_M2M_USD_MesAnterior,
                                ingresos.PROV_TAR_MesAnteriorUSD,
                                ingresos.ajusteRal_VS_DevengoTarifaMesAnterior,
                                ingresos.total_USD_PROV_Tarifa,
                                ingresos.facturacion_REALTraficoMesAnterior,
                                ingresos.PROVTraficoMesAnteriorUSD,
                                ingresos.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                ingresos.ajusteTraficoMesAnterior,
                                ingresos.ajusteTarifaMesAnterior,
                                ingresos.complementoTarifaMesAnterior,
                                ingresos.ajusteMesesAnterioresUSD,
                                ingresos.totalUSDTrafico,
                                ingresos.totalNetoUSD,
                                ingresos.lineaNegocio
                            };
                foreach (var elemento in query)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        fecha = elemento.fecha.Day + "-" + elemento.fecha.Month + "-" + elemento.fecha.Year,
                        elemento.PLMN_PROV_TAR,
                        elemento.PLMN_V,
                        elemento.PLMN_GPO,
                        elemento.pais,
                        elemento.deudor,
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
                        elemento.ingresoTraficoUSD,
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
                        elemento.PROV_NC_M2M_USD,
                        elemento.PROVRealTarifaMesAnteriorUSD,
                        elemento.ajustePROV_M2M_USD_MesAnterior,
                        elemento.PROV_TAR_MesAnteriorUSD,
                        elemento.ajusteRal_VS_DevengoTarifaMesAnterior,
                        elemento.total_USD_PROV_Tarifa,
                        elemento.facturacion_REALTraficoMesAnterior,
                        elemento.PROVTraficoMesAnteriorUSD,
                        elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                        elemento.ajusteTraficoMesAnterior,
                        elemento.ajusteTarifaMesAnterior,
                        elemento.complementoTarifaMesAnterior,
                        elemento.ajusteMesesAnterioresUSD,
                        elemento.totalUSDTrafico,
                        elemento.totalNetoUSD,
                        elemento.lineaNegocio
                    });

                    dia = elemento.fecha.Day + "-" + elemento.fecha.Month + "-" + elemento.fecha.Year;
                    total_MIN_MOC_REDONDEADO += Convert.ToDecimal(elemento.MIN_MOC_REDONDEADO);
                    total_MIN_MOC_REAL += Convert.ToDecimal(elemento.MIN_MOC_REAL);
                    total_SDR_MOC += Convert.ToDecimal(elemento.SDR_MOC);
                    total_MIN_MTC_REDONDEADO += Convert.ToDecimal(elemento.MIN_MTC_REDONDEADO);
                    total_MIN_MTC_REAL += Convert.ToDecimal(elemento.MIN_MTC_REAL);
                    total_SDR_MTC += Convert.ToDecimal(elemento.SDR_MTC);
                    total_SMS_MO += Convert.ToDecimal(elemento.SMS_MO);
                    total_SDR_SMS += Convert.ToDecimal(elemento.SDR_SMS);
                    total_GPRS += Convert.ToDecimal(elemento.GPRS);
                    total_SDR_GPRS += Convert.ToDecimal(elemento.SDR_GPRS);
                    total_USD_MOC += Convert.ToDecimal(elemento.USD_MOC);
                    total_USD_MTC += Convert.ToDecimal(elemento.USD_MTC);
                    total_USD_SMS_MO += Convert.ToDecimal(elemento.USD_SMS_MO);
                    total_USD_GPRS += Convert.ToDecimal(elemento.USD_GPRS);
                    total_ingresoTraficoUSD += Convert.ToDecimal(elemento.ingresoTraficoUSD);
                    total_tarifa_MOC += Convert.ToDecimal(elemento.tarifa_MOC);
                    total_tarifa_MTC += Convert.ToDecimal(elemento.tarifa_MTC);
                    total_tarifa_SMS_MO += Convert.ToDecimal(elemento.tarifa_SMS_MO);
                    total_tarifa_GPRS += Convert.ToDecimal(elemento.tarifa_GPRS);
                    total_IOT_TAR_MOC += Convert.ToDecimal(elemento.IOT_TAR_MOC);
                    total_IOT_TAR_MTC += Convert.ToDecimal(elemento.IOT_TAR_MTC);
                    total_IOT_TAR_SMS_MO += Convert.ToDecimal(elemento.IOT_TAR_GPRS);
                    total_IOT_TAR_GPRS += Convert.ToDecimal(elemento.IOT_TAR_GPRS);
                    total_USD_MOC_IOTFacturado += Convert.ToDecimal(elemento.USD_MOC_IOTFacturado);
                    total_USD_MTC_IOTFacturado += Convert.ToDecimal(elemento.USD_MTC_IOTFacturado);
                    total_USD_SMS_MO_IOTFacturado += Convert.ToDecimal(elemento.USD_SMS_MO_IOTFacturado);
                    total_USD_GPRS_IOTFacturado += Convert.ToDecimal(elemento.USD_GPRS_IOTFacturado);
                    total_USD_MOC_IOT_REAL += Convert.ToDecimal(elemento.USD_MOC_IOT_REAL);
                    total_USD_MTC_IOT_REAL += Convert.ToDecimal(elemento.USD_MTC_IOT_REAL);
                    total_USD_MOC_IOT_DESC += Convert.ToDecimal(elemento.USD_MOC_IOT_DESC);
                    total_USD_MTC_IOT_DESC += Convert.ToDecimal(elemento.USD_MTC_IOT_DESC);
                    total_USD_SMS_MO_IOT_DESC += Convert.ToDecimal(elemento.USD_SMS_MO_IOT_DESC);
                    total_USD_GPRS_IOT_DESC += Convert.ToDecimal(elemento.USD_GPRS_IOT_DESC);
                    total_USD_SUMA_PROV_TARIFA += Convert.ToDecimal(elemento.USD_SUMA_PROV_TARIFA);
                    total_PROV_NC_M2M_USD += Convert.ToDecimal(elemento.PROV_NC_M2M_USD);
                    total_PROVRealTarifaMesAnteriorUSD += Convert.ToDecimal(elemento.PROVRealTarifaMesAnteriorUSD);
                    total_ajustePROV_M2M_USD_MesAnterior += Convert.ToDecimal(elemento.ajustePROV_M2M_USD_MesAnterior);
                    total_PROV_TAR_MesAnteriorUSD += Convert.ToDecimal(elemento.PROV_TAR_MesAnteriorUSD);
                    total_ajusteRal_VS_DevengoTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteRal_VS_DevengoTarifaMesAnterior);
                    total_total_USD_PROV_Tarifa += Convert.ToDecimal(elemento.total_USD_PROV_Tarifa);
                    total_facturacion_REALTraficoMesAnterior += Convert.ToDecimal(elemento.facturacion_REALTraficoMesAnterior);
                    total_PROVTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.PROVTraficoMesAnteriorUSD);
                    total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD += Convert.ToDecimal(elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                    total_ajusteTraficoMesAnterior += Convert.ToDecimal(elemento.ajusteTraficoMesAnterior);
                    total_ajusteTarifaMesAnterior += Convert.ToDecimal(elemento.ajusteTarifaMesAnterior);
                    total_complementoTarifaMesAnterior += Convert.ToDecimal(elemento.complementoTarifaMesAnterior);
                    total_ajusteMesesAnterioresUSD += Convert.ToDecimal(elemento.ajusteMesesAnterioresUSD);
                    total_totalUSDTrafico += Convert.ToDecimal(elemento.totalUSDTrafico);
                    total_totalNetoUSD += Convert.ToDecimal(elemento.totalNetoUSD);
                }

                List<object> listaTotales = new List<object>();
               
                total = lista.Count();
                lista = lista.Skip(start).Take(limit).ToList();
                lista.Add(new
                {
                    deudor = "SUMAS TOTALES",
                    MIN_MOC_REDONDEADO = total_MIN_MOC_REDONDEADO,
                    MIN_MOC_REAL = total_MIN_MOC_REAL,
                    SDR_MOC = total_SDR_MOC,
                    MIN_MTC_REDONDEADO = total_MIN_MTC_REDONDEADO,
                    MIN_MTC_REAL = total_MIN_MTC_REAL,
                    SDR_MTC = total_SDR_MTC,
                    SMS_MO = total_SMS_MO,
                    SDR_SMS = total_SDR_SMS,
                    GPRS = total_GPRS,
                    SDR_GPRS = total_SDR_GPRS,
                    USD_MOC = total_USD_MOC,
                    USD_MTC = total_USD_MTC,
                    USD_SMS_MO = total_USD_SMS_MO,
                    USD_GPRS = total_USD_GPRS,
                    ingresoTraficoUSD = total_ingresoTraficoUSD,
                    tarifa_MOC = total_tarifa_MOC,
                    tarifa_MTC = total_tarifa_MTC,
                    tarifa_SMS_MO = total_tarifa_SMS_MO,
                    tarifa_GPRS = total_tarifa_GPRS,
                    IOT_TAR_MOC = total_IOT_TAR_MOC,
                    IOT_TAR_MTC = total_IOT_TAR_MTC,
                    IOT_TAR_SMS_MO = total_IOT_TAR_SMS_MO,
                    IOT_TAR_GPRS = total_IOT_TAR_GPRS,
                    USD_MOC_IOTFacturado = total_USD_MOC_IOTFacturado,
                    USD_MTC_IOTFacturado = total_USD_MTC_IOTFacturado,
                    USD_SMS_MO_IOTFacturado = total_USD_SMS_MO_IOTFacturado,
                    USD_GPRS_IOTFacturado = total_USD_GPRS_IOTFacturado,
                    USD_MOC_IOT_REAL = total_USD_MOC_IOT_REAL,
                    USD_MTC_IOT_REAL = total_USD_MTC_IOT_REAL,
                    USD_MOC_IOT_DESC = total_USD_MOC_IOT_DESC,
                    USD_MTC_IOT_DESC = total_USD_MTC_IOT_DESC,
                    USD_SMS_MO_IOT_DESC = total_USD_SMS_MO_IOT_DESC,
                    USD_GPRS_IOT_DESC = total_USD_GPRS_IOT_DESC,
                    USD_SUMA_PROV_TARIFA = total_USD_SUMA_PROV_TARIFA,
                    PROV_NC_M2M_USD = total_PROV_NC_M2M_USD,
                    PROVRealTarifaMesAnteriorUSD = total_PROVRealTarifaMesAnteriorUSD,
                    ajustePROV_M2M_USD_MesAnterior = total_ajustePROV_M2M_USD_MesAnterior,
                    PROV_TAR_MesAnteriorUSD = total_PROV_TAR_MesAnteriorUSD,
                    ajusteRal_VS_DevengoTarifaMesAnterior = total_ajusteRal_VS_DevengoTarifaMesAnterior,
                    total_USD_PROV_Tarifa = total_total_USD_PROV_Tarifa,
                    facturacion_REALTraficoMesAnterior = total_facturacion_REALTraficoMesAnterior,
                    PROVTraficoMesAnteriorUSD = total_PROVTraficoMesAnteriorUSD,
                    ajusteReal_VS_DevengoTraficoMesAnteriorUSD = total_ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                    ajusteTraficoMesAnterior = total_ajusteTraficoMesAnterior,
                    ajusteTarifaMesAnterior = total_ajusteTarifaMesAnterior,
                    complementoTarifaMesAnterior = total_complementoTarifaMesAnterior,
                    ajusteMesesAnterioresUSD = total_ajusteMesesAnterioresUSD,
                    totalUSDTrafico = total_totalUSDTrafico,
                    totalNetoUSD = total_totalNetoUSD,

                });

                respuesta = new { results = lista, listaTotales, start, limit, total, succes = true };

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
            string nombreArchivo = "PxQ ROM" + meses[periodo.Month].Substring(0, 3) + periodo.Year.ToString().Substring(2, 2) + ".xlsx";
            string templatePath = Server.MapPath("~/Plantillas/PxQ_ROM.xlsx");
            object respuesta = null;
            int fila = 2;
            FileInfo datafile = new FileInfo(templatePath);

            using (ExcelPackage excelPackage = new ExcelPackage(datafile))
            {
                ExcelWorksheet worksheet = excelPackage.Workbook.Worksheets["PxQ Ingresos ROM"];

                try
                {
                    List<PXQIngresosROM> lista = new List<PXQIngresosROM>();
                    var query = from PxQI in db.PXQIngresosROM
                                where PxQI.fecha.Month == periodo.Month &&
                                        PxQI.fecha.Year == periodo.Year
                                select new
                                {
                                    PxQI.fecha,
                                    PxQI.PLMN_PROV_TAR,
                                    PxQI.PLMN_V,
                                    PxQI.PLMN_GPO,
                                    PxQI.pais,
                                    PxQI.deudor,
                                    PxQI.MIN_MOC_REDONDEADO,
                                    PxQI.MIN_MOC_REAL,
                                    PxQI.SDR_MOC,
                                    PxQI.MIN_MTC_REDONDEADO,
                                    PxQI.MIN_MTC_REAL,
                                    PxQI.SDR_MTC,
                                    PxQI.SMS_MO,
                                    PxQI.SDR_SMS,
                                    PxQI.GPRS,
                                    PxQI.SDR_GPRS,
                                    PxQI.USD_MOC,
                                    PxQI.USD_MTC,
                                    PxQI.USD_SMS_MO,
                                    PxQI.USD_GPRS,
                                    PxQI.ingresoTraficoUSD,
                                    PxQI.tarifa_MOC,
                                    PxQI.tarifa_MTC,
                                    PxQI.tarifa_SMS_MO,
                                    PxQI.tarifa_GPRS,
                                    PxQI.IOT_TAR_MOC,
                                    PxQI.IOT_TAR_MTC,
                                    PxQI.IOT_TAR_SMS_MO,
                                    PxQI.IOT_TAR_GPRS,
                                    PxQI.USD_MOC_IOTFacturado,
                                    PxQI.USD_MTC_IOTFacturado,
                                    PxQI.USD_SMS_MO_IOTFacturado,
                                    PxQI.USD_GPRS_IOTFacturado,
                                    PxQI.USD_MOC_IOT_REAL,
                                    PxQI.USD_MTC_IOT_REAL,
                                    PxQI.USD_MOC_IOT_DESC,
                                    PxQI.USD_MTC_IOT_DESC,
                                    PxQI.USD_SMS_MO_IOT_DESC,
                                    PxQI.USD_GPRS_IOT_DESC,
                                    PxQI.USD_SUMA_PROV_TARIFA,
                                    PxQI.PROV_NC_M2M_USD,
                                    PxQI.PROVRealTarifaMesAnteriorUSD,
                                    PxQI.ajustePROV_M2M_USD_MesAnterior,
                                    PxQI.PROV_TAR_MesAnteriorUSD,
                                    PxQI.ajusteRal_VS_DevengoTarifaMesAnterior,
                                    PxQI.total_USD_PROV_Tarifa,
                                    PxQI.facturacion_REALTraficoMesAnterior,
                                    PxQI.PROVTraficoMesAnteriorUSD,
                                    PxQI.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                                    PxQI.ajusteTraficoMesAnterior,
                                    PxQI.ajusteTarifaMesAnterior,
                                    PxQI.complementoTarifaMesAnterior,
                                    PxQI.ajusteMesesAnterioresUSD,
                                    PxQI.totalUSDTrafico
                                };
                    foreach (var elemento in query)
                    {
                        lista.Add(new PXQIngresosROM
                        {
                            fecha = elemento.fecha,
                            PLMN_PROV_TAR = elemento.PLMN_PROV_TAR,
                            PLMN_V = elemento.PLMN_V,
                            PLMN_GPO = elemento.PLMN_GPO,
                            pais = elemento.pais,
                            deudor = elemento.deudor,
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
                            ingresoTraficoUSD = elemento.ingresoTraficoUSD,
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
                            PROV_NC_M2M_USD = elemento.PROV_NC_M2M_USD,
                            PROVRealTarifaMesAnteriorUSD = elemento.PROVRealTarifaMesAnteriorUSD,
                            ajustePROV_M2M_USD_MesAnterior = elemento.ajustePROV_M2M_USD_MesAnterior,
                            PROV_TAR_MesAnteriorUSD = elemento.PROV_TAR_MesAnteriorUSD,
                            ajusteRal_VS_DevengoTarifaMesAnterior = elemento.ajusteRal_VS_DevengoTarifaMesAnterior,
                            total_USD_PROV_Tarifa = elemento.total_USD_PROV_Tarifa,
                            facturacion_REALTraficoMesAnterior = elemento.facturacion_REALTraficoMesAnterior,
                            PROVTraficoMesAnteriorUSD = elemento.PROVTraficoMesAnteriorUSD,
                            ajusteReal_VS_DevengoTraficoMesAnteriorUSD = elemento.ajusteReal_VS_DevengoTraficoMesAnteriorUSD,
                            ajusteTraficoMesAnterior = elemento.ajusteTraficoMesAnterior,
                            ajusteTarifaMesAnterior = elemento.ajusteTarifaMesAnterior,
                            complementoTarifaMesAnterior = elemento.complementoTarifaMesAnterior,
                            ajusteMesesAnterioresUSD = elemento.ajusteMesesAnterioresUSD,
                            totalUSDTrafico = elemento.totalUSDTrafico
                        });
                    }
                    foreach (PXQIngresosROM row in lista)
                    {
                        worksheet.Cells[("A" + fila)].Value = meses[periodo.Month] + " " + periodo.Year;
                        //worksheet.Cells[("A" + fila)]
                        worksheet.Cells[("B" + fila)].Value = row.PLMN_PROV_TAR;
                        worksheet.Cells[("C" + fila)].Value = row.PLMN_V;
                        worksheet.Cells[("D" + fila)].Value = row.PLMN_GPO;
                        worksheet.Cells[("E" + fila)].Value = row.pais;
                        worksheet.Cells[("F" + fila)].Value = row.deudor;
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
                        worksheet.Cells[("U" + fila)].Value = row.ingresoTraficoUSD;
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
                        worksheet.Cells[("AO" + fila)].Value = row.PROV_NC_M2M_USD;
                        worksheet.Cells[("AO" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AP" + fila)].Value = row.PROVRealTarifaMesAnteriorUSD;
                        worksheet.Cells[("AP" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AQ" + fila)].Value = row.ajustePROV_M2M_USD_MesAnterior;
                        worksheet.Cells[("AQ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AR" + fila)].Value = row.PROV_TAR_MesAnteriorUSD;
                        worksheet.Cells[("AR" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AS" + fila)].Value = row.ajusteRal_VS_DevengoTarifaMesAnterior;
                        worksheet.Cells[("AS" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AT" + fila)].Value = row.total_USD_PROV_Tarifa;
                        worksheet.Cells[("AT" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AU" + fila)].Value = row.facturacion_REALTraficoMesAnterior;
                        worksheet.Cells[("AU" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AV" + fila)].Value = row.PROVTraficoMesAnteriorUSD;
                        worksheet.Cells[("AV" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AW" + fila)].Value = row.ajusteReal_VS_DevengoTraficoMesAnteriorUSD;
                        worksheet.Cells[("AW" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AX" + fila)].Value = row.ajusteTraficoMesAnterior;
                        worksheet.Cells[("AX" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AY" + fila)].Value = row.ajusteTarifaMesAnterior;
                        worksheet.Cells[("AY" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("AZ" + fila)].Value = row.complementoTarifaMesAnterior;
                        worksheet.Cells[("AZ" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BA" + fila)].Value = row.ajusteMesesAnterioresUSD;
                        worksheet.Cells[("BA" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BB" + fila)].Value = row.totalUSDTrafico;
                        worksheet.Cells[("BB" + fila)].Style.Numberformat.Format = "#,##0.00_-";
                        worksheet.Cells[("BC" + fila)].Value = row.totalNetoUSD;
                        worksheet.Cells[("BC" + fila)].Style.Numberformat.Format = "#,##0.00_-";


                        ++fila;

                    }

                    worksheet.Cells[("C" + (fila + 4))].Value = "SUMAS TOTALES";
                    var sum1 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MOC_REDONDEADO);
                    worksheet.Cells[("G" + (fila + 4))].Value = sum1;
                    worksheet.Cells[("G" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum2 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MOC_REAL);
                    worksheet.Cells[("H" + (fila + 4))].Value = sum2;
                    worksheet.Cells[("H" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum3 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_MOC);
                    worksheet.Cells[("I" + (fila + 4))].Value = sum3;
                    worksheet.Cells[("I" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum4 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MTC_REDONDEADO);
                    worksheet.Cells[("J" + (fila + 4))].Value = sum4;
                    worksheet.Cells[("J" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum5 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.MIN_MTC_REAL);
                    worksheet.Cells[("K" + (fila + 4))].Value = sum5;
                    worksheet.Cells[("K" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum6 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_MTC);
                    worksheet.Cells[("L" + (fila + 4))].Value = sum6;
                    worksheet.Cells[("L" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum7 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.SMS_MO);
                    worksheet.Cells[("M" + (fila + 4))].Value = sum7;
                    worksheet.Cells[("M" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum8 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_SMS);
                    worksheet.Cells[("N" + (fila + 4))].Value = sum8;
                    worksheet.Cells[("N" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum9 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.GPRS);
                    worksheet.Cells[("O" + (fila + 4))].Value = sum9;
                    worksheet.Cells[("O" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum10 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.SDR_GPRS);
                    worksheet.Cells[("P" + (fila + 4))].Value = sum10;
                    worksheet.Cells[("P" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum11 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC);
                    worksheet.Cells[("Q" + (fila + 4))].Value = sum11;
                    worksheet.Cells[("Q" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum12 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC);
                    worksheet.Cells[("R" + (fila + 4))].Value = sum12;
                    worksheet.Cells[("R" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum13 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SMS_MO);
                    worksheet.Cells[("S" + (fila + 4))].Value = sum13;
                    worksheet.Cells[("S" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum14 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_GPRS);
                    worksheet.Cells[("T" + (fila + 4))].Value = sum14;
                    worksheet.Cells[("T" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum15 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ingresoTraficoUSD);
                    worksheet.Cells[("U" + (fila + 4))].Value = sum15;
                    worksheet.Cells[("U" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum16 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_MOC);
                    worksheet.Cells[("v" + (fila + 4))].Value = sum16;
                    worksheet.Cells[("v" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum17 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_MTC);
                    worksheet.Cells[("W" + (fila + 4))].Value = sum17;
                    worksheet.Cells[("W" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum18 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_SMS_MO);
                    worksheet.Cells[("X" + (fila + 4))].Value = sum18;
                    worksheet.Cells[("X" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum19 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.tarifa_GPRS);
                    worksheet.Cells[("Y" + (fila + 4))].Value = sum19;
                    worksheet.Cells[("Y" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum20 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_MOC);
                    worksheet.Cells[("Z" + (fila + 4))].Value = sum20;
                    worksheet.Cells[("Z" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum21 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_MTC);
                    worksheet.Cells[("AA" + (fila + 4))].Value = sum21;
                    worksheet.Cells[("AA" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum22 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_SMS_MO);
                    worksheet.Cells[("AB" + (fila + 4))].Value = sum22;
                    worksheet.Cells[("AB" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum23 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.IOT_TAR_GPRS);
                    worksheet.Cells[("AC" + (fila + 4))].Value = sum23;
                    worksheet.Cells[("AC" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum24 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC_IOTFacturado);
                    worksheet.Cells[("AD" + (fila + 4))].Value = sum24;
                    worksheet.Cells[("AD" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum25 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC_IOTFacturado);
                    worksheet.Cells[("AE" + (fila + 4))].Value = sum25;
                    worksheet.Cells[("AE" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum26 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SMS_MO_IOTFacturado);
                    worksheet.Cells[("AF" + (fila + 4))].Value = sum26;
                    worksheet.Cells[("AF" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum27 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_GPRS_IOTFacturado);
                    worksheet.Cells[("AG" + (fila + 4))].Value = sum27;
                    worksheet.Cells[("AG" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum28 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC_IOT_REAL);
                    worksheet.Cells[("AH" + (fila + 4))].Value = sum28;
                    worksheet.Cells[("AH" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum29 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC_IOT_REAL);
                    worksheet.Cells[("AI" + (fila + 4))].Value = sum29;
                    worksheet.Cells[("AI" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum30 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MOC_IOT_DESC);
                    worksheet.Cells[("AJ" + (fila + 4))].Value = sum30;
                    worksheet.Cells[("AJ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum31 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_MTC_IOT_DESC);
                    worksheet.Cells[("AK" + (fila + 4))].Value = sum31;
                    worksheet.Cells[("AK" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum32 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SMS_MO_IOT_DESC);
                    worksheet.Cells[("AL" + (fila + 4))].Value = sum32;
                    worksheet.Cells[("AL" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum33 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_GPRS_IOT_DESC);
                    worksheet.Cells[("AM" + (fila + 4))].Value = sum33;
                    worksheet.Cells[("AM" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum34 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.USD_SUMA_PROV_TARIFA);
                    worksheet.Cells[("AN" + (fila + 4))].Value = sum34;
                    worksheet.Cells[("AN" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum35 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.PROV_NC_M2M_USD);
                    worksheet.Cells[("AO" + (fila + 4))].Value = sum35;
                    worksheet.Cells[("AO" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum36 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.PROVRealTarifaMesAnteriorUSD);
                    worksheet.Cells[("AP" + (fila + 4))].Value = sum36;
                    worksheet.Cells[("AP" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum37 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ajustePROV_M2M_USD_MesAnterior);
                    worksheet.Cells[("AQ" + (fila + 4))].Value = sum37;
                    worksheet.Cells[("AQ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum38 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.PROV_TAR_MesAnteriorUSD);
                    worksheet.Cells[("AR" + (fila + 4))].Value = sum38;
                    worksheet.Cells[("AR" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum39 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteRal_VS_DevengoTarifaMesAnterior);
                    worksheet.Cells[("AS" + (fila + 4))].Value = sum39;
                    worksheet.Cells[("AS" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum40 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.total_USD_PROV_Tarifa);
                    worksheet.Cells[("AT" + (fila + 4))].Value = sum40;
                    worksheet.Cells[("AT" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum41 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.facturacion_REALTraficoMesAnterior);
                    worksheet.Cells[("AU" + (fila + 4))].Value = sum41;
                    worksheet.Cells[("AU" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum42 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.PROVTraficoMesAnteriorUSD);
                    worksheet.Cells[("AV" + (fila + 4))].Value = sum42;
                    worksheet.Cells[("AV" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum43 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteReal_VS_DevengoTraficoMesAnteriorUSD);
                    worksheet.Cells[("AW" + (fila + 4))].Value = sum43;
                    worksheet.Cells[("AW" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum44 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteTraficoMesAnterior);
                    worksheet.Cells[("AX" + (fila + 4))].Value = sum44;
                    worksheet.Cells[("AX" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum45 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteTarifaMesAnterior);
                    worksheet.Cells[("AY" + (fila + 4))].Value = sum45;
                    worksheet.Cells[("AY" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum46 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.complementoTarifaMesAnterior);
                    worksheet.Cells[("AZ" + (fila + 4))].Value = sum46;
                    worksheet.Cells[("AZ" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum47 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.ajusteMesesAnterioresUSD);
                    worksheet.Cells[("BA" + (fila + 4))].Value = sum47;
                    worksheet.Cells[("BA" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum48 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.totalUSDTrafico);
                    worksheet.Cells[("BB" + (fila + 4))].Value = sum48;
                    worksheet.Cells[("BB" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";
                    var sum49 = db.PXQIngresosROM.Where(x => x.fecha == periodo).Sum(x => x.totalNetoUSD);
                    worksheet.Cells[("BC" + (fila + 4))].Value = sum49;
                    worksheet.Cells[("BC" + (fila + 4))].Style.Numberformat.Format = "#,##0.00_-";

                    byte[] bytesfile = excelPackage.GetAsByteArray();
                    respuesta = new { responseText = nombreArchivo, Success = true, bytes = bytesfile };
                }
                catch (Exception err)
                {
                    respuesta = new { success = false, results = err.Message };
                }
                return Json(respuesta, JsonRequestBehavior.AllowGet);
            }
        }

        public void SavePXQIngresos(List<PXQIngresosLDI> lista)
        {
            using (TransactionScope scope = new TransactionScope())
            {
                foreach (var elemento in lista)
                {
                    db.PXQIngresosLDI.Add(elemento);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(elemento, "Nuevo", "PXQIngresosLDI.html", Request.UserHostAddress);
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
