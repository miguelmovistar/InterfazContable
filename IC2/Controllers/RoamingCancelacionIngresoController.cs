using IC2.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace IC2.Controllers
{
    public class RoamingCancelacionIngresoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();

        // GET: RoamingCancelacionIngreso
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

        public JsonResult cargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            List<string> listaErrores = new List<string>();
            var hoy = DateTime.Now;
            IEnumerable<string> lineas = null;
            object respuesta = null;
            int totalProcesados = 0;
            int lineaActual = 1;
            int contador = 0;
            bool status = false;
            string ope, fact;
            string exception = "Error, se presento un error inesperado.";

            try
            {
                List<string> csvData = new List<string>();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(archivoCSV.InputStream, System.Text.Encoding.UTF8))
                {
                    while (!reader.EndOfStream)
                    {
                        csvData.Add(reader.ReadLine());
                    }
                }
                lineas = csvData.Skip(1);

                using (TransactionScope scope = new TransactionScope())
                {
                    foreach (string ln in lineas)
                    {
                        string linea = ln.Replace('%', ' ');
                        var lineaSplit = linea.Split('|');
                        ++lineaActual;
                        if (lineaSplit.Count() == 19)
                        {
                            RoamingCancelacionIngreso entidad = new RoamingCancelacionIngreso();

                            try
                            {
                                contador++;
                                ope = lineaSplit[2];
                                fact = lineaSplit[11];

                                entidad.BanderaConcepto = lineaSplit[0];
                                entidad.NumeroProvision = lineaSplit[1];
                                entidad.IdOperador = lineaSplit[2];
                                entidad.Concepto = lineaSplit[3];
                                entidad.Grupo = lineaSplit[4];
                                entidad.Deudor = lineaSplit[5];
                                entidad.MontoProvision = lineaSplit[6];
                                entidad.Moneda = lineaSplit[7];
                                entidad.Periodo = lineaSplit[8];
                                entidad.Tipo = lineaSplit[9];
                                entidad.NumeroDocumentoSap = lineaSplit[10];
                                entidad.FolioDocumento = lineaSplit[11];
                                entidad.TipoCambioProvision = lineaSplit[12];
                                entidad.ImporteMxn = lineaSplit[13];
                                entidad.ImporteFactura = lineaSplit[14];
                                entidad.DiferenciaProvisionFactura = lineaSplit[15];
                                entidad.TipoCambioFactura = lineaSplit[16];
                                entidad.ExcesoProvisionMxn = lineaSplit[17];
                                entidad.InsuficienciaProvisionMxn = lineaSplit[18];
                                entidad.Activo = "1";
                                entidad.LineaNegocio = "1";
                                entidad.FechaCarga = DateTime.Now;

                                totalProcesados++;

                                db.RoamingCancelacionIngreso.Add(entidad);
                            }
                            catch (FormatException e)
                            {
                                if (e.Message == "String was not recognized as a valid DateTime.")
                                {
                                    listaErrores.Add("Línea " + lineaActual + ": Campo de Fecha con formato erróneo.");
                                }
                                else
                                    listaErrores.Add("Línea " + lineaActual + ": Campo con formato erróneo.");
                            }
                            catch (Exception)
                            {
                                listaErrores.Add("Línea " + lineaActual + ": Error desconocido. ");
                            }
                        }
                        else
                        {
                            listaErrores.Add("Línea " + lineaActual + ": Número de campos insuficiente.");
                        }
                    }
                    db.SaveChanges();
                    scope.Complete();
                    exception = "Datos cargados con éxito";
                    status = true;
                }
            }
            catch (FileNotFoundException)
            {
                exception = "El archivo Selecionado aún no existe en el Repositorio.";
                status = false;
            }
            catch (UnauthorizedAccessException)
            {
                exception = "No tiene permiso para acceder al archivo actual.";
                status = false;
            }
            catch (IOException e) when ((e.HResult & 0x0000FFFF) == 32)
            {
                exception = "Falta el nombre del archivo, o el archivo o directorio está en uso.";
                status = false;
            }
            catch (TransactionAbortedException)
            {
                exception = "Transacción abortada. Se presentó un error.";
                status = false;
            }
            catch (Exception err)
            {
                exception = "Error desconocido. " + err.InnerException.ToString();
                status = false;
            }
            finally
            {
                respuesta = new
                {
                    success = true,
                    results = listaErrores,
                    mensaje = exception,
                    totalProcesados = totalProcesados,
                    status = status
                };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LlenaPeriodo(int lineaNegocio, int start, int limit)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            int total;
            string _LineaNegocio = lineaNegocio.ToString();

            try
            {
                var datos = (from periodos in db.datosTraficoTAPOUTA
                             group periodos by periodos.settlementDate into g
                             orderby g.Key ascending
                             select new
                             {
                                 Id = g.Key,
                                 Periodo = g.Key
                             }).FirstOrDefault();

                DateTime _Fecha = DateTime.Parse(datos.Periodo.ToString());

                lista.Add(new
                {
                    Id = _Fecha,
                    Periodo = _Fecha.Year + "-" + (_Fecha.AddMonths(1).Month.ToString("d2")) + "-" + _Fecha.Day,
                    Fecha = _Fecha.Year + " " + meses[(_Fecha.AddMonths(1).Month)]
                });

                total = lista.Count();
                respuesta = new { success = true, results = lista, total = total };
            }
            catch (Exception e)
            {
                lista = null;
                respuesta = new { success = false, results = e.Message };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        IDictionary<int, string> meses = new Dictionary<int, string>() {
            {1, "ENERO"}, {2, "FEBRERO"},
            {3, "MARZO"}, {4, "ABRIL"},
            {5, "MAYO"}, {6, "JUNIO"},
            {7, "JULIO"}, {8, "AGOSTO"},
            {9, "SEPTIEMBRE"}, {10, "OCTUBRE"},
            {11, "NOVIEMBRE"}, {12, "DICIEMBRE"}
        };

        public JsonResult LlenaGrid(int? lineaNegocio, DateTime Periodo, int start, int limit)
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            int total = 0;
            DateTime periodo = DateTime.Now;

            string mes = Periodo.Month.ToString().Length == 1 ? "0" + Periodo.Month.ToString() : Periodo.Month.ToString();
            string anio = Periodo.Year.ToString();

            try
            {
                var JoinQuery = from C in db.RoamingCancelacionIngreso
                                join D in db.RoamingDocumentoIngreso on C.FolioDocumento equals D.FolioDocumento
                                where C.FechaCarga.Month == periodo.Month &&
                                C.FechaCarga.Year == periodo.Year &&
                                C.LineaNegocio == "1"
                                orderby C.FolioDocumento ascending

                    select new
                    {
                        C.BanderaConcepto,
                        C.NumeroProvision,
                        C.IdOperador,
                        C.Concepto,
                        C.Grupo,
                        C.Deudor,
                        C.MontoProvision,
                        C.Moneda,
                        C.Periodo,
                        C.Tipo,
                        C.NumeroDocumentoSap,
                        C.FolioDocumento,
                        C.TipoCambioProvision,
                        C.ImporteMxn,
                        C.ImporteFactura,
                        C.DiferenciaProvisionFactura,
                        C.TipoCambioFactura,
                        C.ExcesoProvisionMxn,
                        C.InsuficienciaProvisionMxn,
                        D.FechaConsumo,
                        D.TipoCambio,
                        D.MontoFacturado
                    };

                string MontoFacturado = "", FechaConsumo = "", TipoCambio = "";
                foreach (var elemento in JoinQuery)
                {

                    if (elemento.ImporteFactura == "")
                    {
                        MontoFacturado = elemento.MontoFacturado;
                        FechaConsumo = elemento.FechaConsumo;
                        TipoCambio = elemento.TipoCambio;
                    }

                    lista.Add(new
                    {
                        elemento.BanderaConcepto,
                        elemento.NumeroProvision,
                        elemento.IdOperador,
                        elemento.Concepto,
                        elemento.Grupo,
                        elemento.Deudor,
                        elemento.MontoProvision,
                        elemento.Moneda,
                        elemento.Periodo,
                        elemento.Tipo,
                        elemento.NumeroDocumentoSap,
                        elemento.FolioDocumento,
                        elemento.TipoCambioProvision,
                        elemento.ImporteMxn,
                        elemento.ImporteFactura,
                        elemento.DiferenciaProvisionFactura,
                        elemento.TipoCambioFactura,
                        elemento.ExcesoProvisionMxn,
                        elemento.InsuficienciaProvisionMxn,
                        FechaConsumo,
                        TipoCambio,
                        MontoFacturado
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

    }
}