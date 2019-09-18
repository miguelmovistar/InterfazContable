using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.IO;
using System.Web.Mvc;
using IC2.Models;
using System.Transactions;
using System.Text;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CostoFCController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();
        FuncionesGeneralesController funGralCtrl = new FuncionesGeneralesController();

        // GET: CostoFC
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
        


        public JsonResult llenaGrid(int lineaNegocio)
        {
            List<object> listaCostoFC = new List<object>();
            object respuesta = null;
            try
            {

                var pais = from elemento in db.CostoFR
                          where elemento.Id_LineaNegocio == lineaNegocio && elemento.Activo == 1
                           select new
                           {
                               elemento.Id,
                               elemento.TipoOperador,
                               elemento.Operador,
                               elemento.AcreedorSap,
                               elemento.NombreProveedor,
                               elemento.Moneda,
                               elemento.Importe,
                               elemento.Fecha_Inicio,
                               elemento.Fecha_Fin,
                               elemento.CuentaR,
                               elemento.SociedadGL,
                               elemento.TC
                           };

                foreach (var elemento in pais)
                {
                    listaCostoFC.Add(new
                    {
                        Id = elemento.Id,
                        elemento.TipoOperador,
                        elemento.Operador,
                        elemento.AcreedorSap,
                        elemento.NombreProveedor,
                        elemento.Moneda,
                        elemento.Importe,
                        elemento.Fecha_Inicio,
                        elemento.Fecha_Fin,
                        elemento.CuentaR,
                        elemento.SociedadGL,
                        elemento.TC
                    });
                }
                respuesta = new { success = true, results = listaCostoFC };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //Borrar
        public JsonResult borrarCostoFC(string strID)
        {
            int Id = 0;
            strID = strID.TrimEnd(',');
            string strmsg = "ok";
            string strSalto = "</br>";
            bool blsucc = true;
            object respuesta;
            try
            {
                string[] Ids = strID.Split(',');

                for (int i = 0; i < Ids.Length; i++)
                {
                    if (Ids[i].Length != 0)
                    {
                        Id = int.Parse(Ids[i]);

                        string strresp_val = funGralCtrl.ValidaRelacion("CostoFC", Id);

                        if (strresp_val.Length == 0)
                        {
                            CostoFR CostoFC = db.CostoFR.Where(x => x.Id == Id).SingleOrDefault();
                            CostoFC.Activo = 0;
                            Log log = new Log();
                            log.insertaNuevoOEliminado(CostoFC, "Eliminado", "CostoFR.html", Request.UserHostAddress);

                            db.SaveChanges();
                        }
                        else
                        {
                            strmsg = "El(Los) " + Ids.Length.ToString() + " registro(s) que quieres borrar se está(n) usando en el(los) catálogo(s) " + strSalto;
                            strmsg = strmsg + strresp_val + strSalto;
                            blsucc = false;
                            break;
                        }
                    }
                }
                respuesta = new { success = blsucc, results = strmsg };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //agregar                                                   
        public JsonResult agregarCostoFC(int Id_Acreedor, int Id_Operador, int Id_Moneda, decimal Importe, DateTime Fecha_Inicio, DateTime Fecha_fin, int Id_Cuenta, int Id_Sociedad, int Linea_Negocio)
        {
            object respuesta = null;
            bool valid = true;
            var mensaje = "";
            TC_Cierre tC_Cierre = db.TC_Cierre.Where(x => x.Id_Moneda == Id_Moneda && x.Mes_Consumo.Year == Fecha_Inicio.Year && x.Mes_Consumo.Month == Fecha_Inicio.Month && x.Sentido == "COSTO" && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Operador operador = db.Operador.Where(x => x.Id == Id_Operador && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Acreedor acreedor = db.Acreedor.Where(x => x.Id == Id_Acreedor && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Moneda moneda = db.Moneda.Where(x => x.Id == Id_Moneda && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            CuentaResultado cuentaR = db.CuentaResultado.Where(x => x.Id == Id_Cuenta && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            Sociedad sociedad = db.Sociedad.Where(x => x.Id == Id_Sociedad && x.Id_LineaNegocio == Linea_Negocio && x.Activo == 1).SingleOrDefault();
            
            if (DateTime.Compare(Fecha_Inicio, Fecha_fin) >= 0) 
            {
                valid = false;
                mensaje = "Fecha Inicio Debe Ser MENOR que  Fin";
            }

            if (Convert.ToInt64(cuentaR.Cuenta) <= 0) //numeros negativos
            {
                valid = false;
                if (mensaje != "")
                    mensaje = mensaje + " y " + "Importe No Pueder Ser Menor a Cero";
                else
                    mensaje = "Cuenta debe ser mayor a cero";
            }

            if (valid)
            {
                try
                {
                    var nuevo = new CostoFR();
                    nuevo.TipoOperador = operador.Tipo_Operador;
                    nuevo.Operador = operador.Id_Operador;
                    nuevo.AcreedorSap = acreedor.Acreedor1;
                    nuevo.NombreProveedor = acreedor.NombreAcreedor;
                    nuevo.Moneda = moneda.Moneda1;
                    nuevo.Importe = Importe;
                    nuevo.Fecha_Inicio = Fecha_Inicio.ToShortDateString();
                    nuevo.Fecha_Fin = Fecha_fin.ToShortDateString() ;
                    nuevo.CuentaR = cuentaR.Cuenta;
                    nuevo.SociedadGL = int.Parse(sociedad.Id_Sociedad);
                    if (tC_Cierre == null)
                        nuevo.TC = 0;
                    else
                        nuevo.TC = tC_Cierre.TC_MXN;
                    nuevo.Activo = 1;
                    nuevo.Id_LineaNegocio = Linea_Negocio;
                    
                    db.CostoFR.Add(nuevo);
                    Log log = new Log();
                    log.insertaNuevoOEliminado(nuevo, "Nuevo", "CostoFR.html", Request.UserHostAddress);

                    db.SaveChanges();
                    respuesta = new { success = true,  result = "ok" };

                }
                catch (Exception ex)
                {
                    var error = ex.Message;
                    respuesta = new { success = false, result = "Hubo un error mientras se procesaba la petición" };
                }
            }
            else
            {
                respuesta = new { success = false, result = mensaje };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        
        //modificar
        public JsonResult ModificarCostoFC(int Id, string Id_Acreedor, string nombre, string Id_Moneda, decimal Importe, DateTime Fecha_Inicio, DateTime Fecha_Fin, string Cuenta, string Id_Sociedad, int lineaNegocio)
        {
            object respuesta = null;
            CultureInfo cultureInfo = new CultureInfo("es-ES", false);
            CostoFR costofr = db.CostoFR.Where(x => x.Id == Id).SingleOrDefault();
            //Trafico trafico = db.Trafico.Where(x => x.Id_TraficoTR == Id_TraficoTR && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1 && x.Sentido == "Costos").SingleOrDefault();
            Acreedor acreedor = db.Acreedor.Where(x => x.Acreedor1 == Id_Acreedor && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            Operador operador = db.Operador.Where(x => x.Id_Operador == nombre && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            Moneda moneda = db.Moneda.Where(x => x.Moneda1 == Id_Moneda && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            CuentaResultado cuentaResultado = db.CuentaResultado.Where(x => x.Cuenta == Cuenta && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            Sociedad sociedad = db.Sociedad.Where(x => x.Id_Sociedad == Id_Sociedad && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1).SingleOrDefault();
            //Acreedor acreedor = db.Acreedor.Where(x => x.Acreedor1 == Id_Acreedor && x.Id_LineaNegocio == lineaNegocio && x.Activo == 1);
            //costofr.Id_Operador = operador.Id;
            

            bool valid = true;
            var mensaje = "";


            if (DateTime.Compare(Fecha_Inicio, Fecha_Fin) > 0)
            {
                valid = false;
                mensaje = "Fecha Inicio debe ser menor que Fecha Fin";
            }
            

             if (valid){
                try
                {
                    costofr.TipoOperador = operador.Tipo_Operador;
                    costofr.Operador = operador.Id_Operador;
                    costofr.AcreedorSap = acreedor.Acreedor1;
                    costofr.NombreProveedor = acreedor.NombreAcreedor;
                    costofr.Moneda = moneda.Moneda1;
                    costofr.Importe = Importe;
                    costofr.Fecha_Inicio = Fecha_Inicio.ToShortDateString();
                    costofr.Fecha_Fin = Fecha_Fin.ToShortDateString();
                    costofr.CuentaR = cuentaResultado.Cuenta;
                    costofr.SociedadGL = int.Parse(sociedad.Id_Sociedad);
                    Log log = new Log();
                    log.insertaBitacoraModificacion(costofr, "Id", costofr.Id, "CostoFR.html", Request.UserHostAddress);
                    db.SaveChanges();
                    respuesta = new { success = true, results = "ok" };

                }
                catch (Exception ex)
                {
                    var error = ex.Message;
                    respuesta = new { success = false, results = "Hubo un error mientras se procesaba la petición" };
                }
            } else{
                respuesta = new { success = false, results = mensaje };
            }

            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult cargarCSV(HttpPostedFileBase archivoCSV, int lineaNegocio)
        {
            FuncionesGeneralesController FNCGrales = new FuncionesGeneralesController();
            List<string> listaErrores = new List<string>();
            IEnumerable<string> lineas = null;
            object respuesta = null;
            int totalProcesados = 0;
            int lineaActual = 2;
            bool status = false;
            string exception = "Error, se presento un error inesperado";
            //DateTime fecha = new DateTime();
            try
            {
                List<string> csvData = new List<string>();
                using (StreamReader reader = new StreamReader(archivoCSV.InputStream, Encoding.Default))
                {
                    while (!reader.EndOfStream)
                    {
                        csvData.Add(reader.ReadLine());
                    }
                }

                lineas = csvData.Skip(1);

                totalProcesados = lineas.Count();
                using (TransactionScope scope = new TransactionScope())
                {
                    foreach (string linea in lineas)
                    {
                        var lineaSplit = linea.Split(';');
                        if (lineaSplit.Count() == 12)
                        {
                            try
                            {
                                CostoFR CFR = new CostoFR();

                                CFR.TipoOperador = lineaSplit[0];
                                CFR.Operador = lineaSplit[1];
                                CFR.AcreedorSap = lineaSplit[2];
                                CFR.NombreProveedor = lineaSplit[3];
                                CFR.Moneda = lineaSplit[4];
                                CFR.Importe = Convert.ToDecimal(string.IsNullOrEmpty( lineaSplit[5]) ? "0" : lineaSplit[5]);
                               // DateTime FechaInicio = FNCGrales.ConvierteFecha(lineaSplit[6], '/', "DMY");
                                CFR.Fecha_Inicio = lineaSplit[6];
                               // DateTime FechaFin = FNCGrales.ConvierteFecha(lineaSplit[7], '/', "DMY");
                                CFR.Fecha_Fin = lineaSplit[7];
                                CFR.CuentaR = lineaSplit[8];
                                CFR.SociedadGL = int.Parse(string.IsNullOrEmpty(lineaSplit[9]) ? "0" : lineaSplit[9]);
                                CFR.TC = decimal.Parse(string.IsNullOrEmpty(lineaSplit[10]) ? "0" : lineaSplit[10]);
                                CFR.Activo = 1;
                                CFR.Id_LineaNegocio = lineaNegocio;

                                db.CostoFR.Add(CFR);
                                Log log = new Log();
                                log.insertaNuevoOEliminado(CFR, "Nuevo", "CostoFR.html", Request.UserHostAddress);

                            }
                            catch (FormatException)
                            {
                                listaErrores.Add("línea " + lineaActual + ": Campo con formato erróneo");
                            }
                        }
                        else
                        {
                            listaErrores.Add("Línea " + lineaActual + ": Número de campos insuficiente.");
                        }
                        ++lineaActual;
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
            finally
            {
                respuesta = new
                {
                    success = true,
                    results = listaErrores,
                    mensaje = exception,
                    totalProcesados,
                    status
                };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        #region Combos
        public JsonResult llenaTraficoCuenta(int? Id_TraficoTR)
        {
            List<object> list = new List<object>();
            object respuesta = null;
            try
            {

                var operador = from CuentaResultado in db.CuentaResultado
                               where CuentaResultado.Trafico_Id == Id_TraficoTR
                               select new
                               {
                                   id = CuentaResultado.Trafico_Id,
                                   cuenta = CuentaResultado.Cuenta

                               };

                foreach (var item in operador)
                {
                    list.Add(new
                    {
                        id = item.id,
                        cuenta = item.cuenta
                    });
                }

                respuesta = new { success = true, result = list };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaSociedad(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Sociedad
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                elemento.Id_Sociedad,
                                elemento.NombreSociedad,
                                elemento.Id,

                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Sociedad = elemento.Id_Sociedad,
                        NombreSociedad = elemento.NombreSociedad,
                        Id = elemento.Id
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaOperador(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Operador
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new
                            {
                                elemento.Id_Operador,
                                elemento.Id,
                                elemento.Nombre,
                                //Acreedor.Acreedor1,
                                //elemento.Acreedor,
                                //NombreAcreedor = elemento.Acreedor,


                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Operador = elemento.Id_Operador,
                        Id = elemento.Id,
                        Nombre = elemento.Nombre,
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenarAcreedor(int lineaNEgocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Acreedor
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNEgocio
                            select new
                            {
                                elemento.Acreedor1,
                                elemento.NombreAcreedor,
                                elemento.Id
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Acreedor = elemento.Acreedor1,
                        NombreAcreedor = elemento.NombreAcreedor,
                        Id = elemento.Id
                    });
                }
                respuesta = new { success = true, results = lista };

            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenaMoneda(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Moneda
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio
                            select new

                            {
                                elemento.Moneda1,
                                elemento.Id
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new

                    {
                        Moneda = elemento.Moneda1,
                        Id = elemento.Id
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        //llena Trafico
        public JsonResult llenaTrafico(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.Trafico
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio && elemento.Sentido == "Costos"
                            select new

                            {
                                elemento.Id_TraficoTR,
                                elemento.Id
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new

                    {
                        Trafico = elemento.Id_TraficoTR,
                        Id = elemento.Id
                    });
                }
                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { success = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }

        public JsonResult llenarCuenta(int lineaNegocio)
        {
            List<object> lista = new List<object>();
            object respuesta = null;
            try
            {
                var grupo = from elemento in db.CuentaResultado
                            where elemento.Activo == 1 && elemento.Id_LineaNegocio == lineaNegocio && elemento.Sentido == "Costos"
                            select new
                            {
                                elemento.Cuenta,
                                elemento.Id
                            };
                foreach (var elemento in grupo)
                {
                    lista.Add(new
                    {
                        Cuenta = elemento.Cuenta,
                        Id = elemento.Id
                    });
                }

                respuesta = new { success = true, results = lista };
            }
            catch (Exception ex)
            {
                respuesta = new { seccess = false, results = ex.Message };
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion   
    }
}