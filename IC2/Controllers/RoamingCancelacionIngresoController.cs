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

    }
}