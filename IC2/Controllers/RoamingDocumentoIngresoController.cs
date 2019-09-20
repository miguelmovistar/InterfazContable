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
    public class RoamingDocumentoIngresoController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();

        // GET: RoamingDocumentoIngreso
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult CargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            List<string> listaErrores = new List<string>();
            var hoy = DateTime.Now;
            IEnumerable<string> lineas = null;
            object respuesta = null;
            int totalProcesados = 0;
            int lineaActual = 1;
            bool status = false;
            string ope, fact;
            string exception = "Error, se presento un error inesperado.";

            try
            {
                List<string> csvData = new List<string>();
                using (System.IO.StreamReader reader = new System.IO.StreamReader(archivoCSV.InputStream))
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
                        if (lineaSplit.Count() == 26)
                        {

                            RoamingDocumentoIngreso entidad = new RoamingDocumentoIngreso();

                            try
                            {
                                ope = lineaSplit[6];
                                fact = lineaSplit[19];

                                entidad.Anio = lineaSplit[0];
                                entidad.FechaContable = lineaSplit[1];
                                entidad.FechaConsumo = lineaSplit[2];
                                entidad.Compania = lineaSplit[3];
                                entidad.Servicio = lineaSplit[4];
                                entidad.Grupo = lineaSplit[5];
                                entidad.IdOperador = lineaSplit[6];
                                entidad.NombreOperador = lineaSplit[7];
                                entidad.Deudor = lineaSplit[8];
                                entidad.Material = lineaSplit[9];
                                entidad.Trafico = lineaSplit[10];
                                entidad.Iva = lineaSplit[11];
                                entidad.PorcentajeIva = lineaSplit[12];
                                entidad.Moneda = lineaSplit[13];
                                entidad.Minutos = lineaSplit[14];
                                entidad.Tarifa = lineaSplit[15];
                                entidad.Monto = lineaSplit[16];
                                entidad.MontoFacturado = lineaSplit[17];
                                entidad.FechaFactura = lineaSplit[18];
                                entidad.FolioDocumento = lineaSplit[19];
                                entidad.TipoCambio = lineaSplit[20];
                                entidad.MontoMxn = lineaSplit[21];
                                entidad.CuentaContable = lineaSplit[22];
                                entidad.ClaseDocumento = lineaSplit[23];
                                entidad.ClaseDocumentoSap = lineaSplit[24];
                                entidad.NumeroDocumentoSap = lineaSplit[25];
                                entidad.Activo = "1";
                                entidad.LineaNegocio = "1";
                                entidad.FechaCarga = DateTime.Now;

                                totalProcesados++;

                                db.RoamingDocumentoIngreso.Add(entidad);

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