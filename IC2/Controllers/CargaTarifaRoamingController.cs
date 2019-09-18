using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using IC2.Funciones;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class CargaTarifaRoamingController : Controller
    {
        // GET: CargaTarifaRoaming
        ICPruebaEntities db = new ICPruebaEntities();
        Cadenas c = new Cadenas();

        public ActionResult Index()
        {
            HomeController oHome = new HomeController();
            ViewBag.Linea = "Linea";
            ViewBag.IdLinea = (int)Session["IdLinea"];
            List<Submenu> lista = new List<Submenu>();
            List<IC2.Models.Menu> listaMenu = new List<IC2.Models.Menu>();
            lista = oHome.obtenerMenu((int)Session["IdLinea"]);
            listaMenu = oHome.obtenerMenuPrincipal((int)Session["IdLinea"]);
            ViewBag.Lista = lista;
            ViewBag.ListaMenu = listaMenu;
            return View(ViewBag);
        }

        public JsonResult cargarCSV(HttpPostedFileBase archivoCSV, int? lineaNegocio)
        {
            object respuesta = null;
            Cadenas oCadena = new Cadenas();
            int numLinea = 0,  n_code = 0, procesados = 0;
            string nuevaLinea, codes = "", operadores = "";

            string[] arreglo = null;
            List<TarifaRoaming> lista = new List<TarifaRoaming>();
            List<TarifaRoaming> listaProcesados = new List<TarifaRoaming>();
            List<Operador> listaOperador = new List<Operador>();
            List<Grupo> listaCode = new List<Grupo>();
            List<object> ids = new List<object>();
            List<string> listaErroneos = new List<string>();
            try
            {
                IEnumerable<string> Lineas = System.IO.File.ReadLines(archivoCSV.FileName, Encoding.Default);
                string[] arrCodes = new string[Lineas.Count()];
                string[] arrOperadores = new string[Lineas.Count()];
                foreach (string linea in Lineas)
                {
                    if (numLinea > 0)
                    {//Inicio if
                        nuevaLinea = linea;
                        //validacion
                        if (nuevaLinea.Contains('"'))
                        {
                            nuevaLinea = oCadena.fixCadena(nuevaLinea);
                            arreglo = nuevaLinea.Split(',');

                        }
                        else
                            arreglo = nuevaLinea.Split(',');
                         //Llena la lista con las tarifas en el archivo.
                        if (validaLinea(arreglo))
                        {
                            lista.Add(new TarifaRoaming
                            {
                                Sentido = (arreglo[0] == "IB") ? "INGRESO" : "COSTO",
                                Direccion = arreglo[0],
                                iva = decimal.Parse(arreglo[9]),
                                FechaInicio = DateTime.Parse(arreglo[3]),
                                FechaFin = DateTime.Parse(arreglo[4]),
                                ToData = (arreglo[5] != "Gross") ? decimal.Parse(arreglo[5]) : -1,
                                ToSMSMo = (arreglo[6] != "Gross") ? decimal.Parse(arreglo[6]) : -1,
                                ToVoiceMo = (arreglo[7] != "Gross") ? decimal.Parse(arreglo[7]) : -1,
                                ToVoiceMt = (arreglo[8] != "Gross") ? decimal.Parse(arreglo[8]) : -1,
                                TfData = 0,
                                TfSMSMo = 0,
                                TfVoiceMo = 0,
                                TfVoiceMt = 0
                            });
                            codes = codes + arreglo[1] + ",";
                            arrCodes[n_code] = arreglo[1];

                            operadores = operadores + arreglo[2] + ",";
                            arrOperadores[n_code] = arreglo[2];

                            n_code++;
                        }
                        else
                        {
                            string texto = "Linea " + numLinea + ": Número de campos insuficiente.";
                            listaErroneos.Add(texto);

                        }


                    }//Fin if
                    numLinea++;

                }
               
                //Obtener lista operador
                listaOperador = todosOperadores(codes);
                lista = calculaTarifa(lista);
                //Asigna el Id de grupo correspondiente y actualiza la lista de errores con los operadores y grupos no encontrados.
                lista = buscaOperador(lista, listaOperador, arrCodes, listaErroneos);
        
                listaErroneos.Count();
                listaProcesados = lista.Where(x => x.Id_Operador != null && x.Code != null && x.Activo!=0).ToList();
                procesados = listaProcesados.Count();
              
                insertaLotes(listaProcesados);
                respuesta = new { success = true, results = listaErroneos, totalProcesados = procesados,  mensaje="Datos cargados con éxito" };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.InnerException, mensaje=e.Message};
            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        public bool validaLinea(string[] arreglo)
        {
            bool valido = true;
            for (int i = 0; i < arreglo.Length; i++)
            {
                if (arreglo[i] == "" || arreglo[i] == null)
                    return valido = false;
            }
            return valido;
        }

        #region Proceso de inserción
        public bool inserta(List<TarifaRoaming> lista)
        {
            bool exito = true;

            object respuesta = null;
            int limite = lista.Count();
            using (ICPruebaEntities db = new ICPruebaEntities())
            {
                try
                {

                    foreach (var tarifa in lista)
                    {
                        var oTarifa = new TarifaRoaming();
                        oTarifa.Sentido = tarifa.Sentido;
                        oTarifa.Direccion = tarifa.Direccion;
                        oTarifa.Code = tarifa.Code;
                        oTarifa.Id_Operador = tarifa.Id_Operador;
                        oTarifa.FechaInicio = tarifa.FechaInicio;
                        oTarifa.FechaFin = tarifa.FechaFin;
                        oTarifa.ToData = tarifa.ToData;
                        oTarifa.ToSMSMo = tarifa.ToSMSMo;
                        oTarifa.ToVoiceMo = tarifa.ToVoiceMo;
                        oTarifa.ToVoiceMt = tarifa.ToVoiceMt;
                        oTarifa.TfData = tarifa.TfData;
                        oTarifa.TfSMSMo = tarifa.TfSMSMo;
                        oTarifa.TfVoiceMo = tarifa.TfVoiceMo;
                        oTarifa.TfVoiceMt = tarifa.TfVoiceMt;
                        oTarifa.iva = tarifa.iva;
                        oTarifa.Activo = 1;
                        oTarifa.Id_LineaNegocio = 1;

                        db.TarifaRoaming.Add(oTarifa);
                        Log log = new Log();
                        log.insertaNuevoOEliminado(oTarifa, "Nuevo", "TarifaRoaming.html", Request.UserHostAddress);

                        db.SaveChanges();
                    }

                    respuesta = new { success = true, results = "ok" };
                }

                catch (Exception e)
                {
                    respuesta = new { success = false, results = e.Message };
                    exito = false;
                }

            }

            return exito;
        }
        public void insertaLotes(List<TarifaRoaming> lista)
        {
            List<TarifaRoaming> listaParcial = new List<TarifaRoaming>();
            try
            {
                for (int i = 0; i < lista.Count(); i = i + 500)
                {
                    listaParcial = lista.Skip(i).Take(500).ToList();
                    inserta(listaParcial);

                }
            }
            catch (Exception e)
            {
                var er = e.ToString();
            }

        }
        #endregion

        #region complementos lista
        public List<TarifaRoaming> calculaTarifa(List<TarifaRoaming> lista)
        {

            try
            {

                foreach (var tarifa in lista)
                {
                    tarifa.TfData = (tarifa.ToData != -1) ? tarifa.ToData - (tarifa.ToData * tarifa.iva) : -1;
                    tarifa.TfVoiceMo = (tarifa.ToVoiceMo != -1) ? tarifa.ToVoiceMo - (tarifa.ToVoiceMo * tarifa.iva) : -1;
                    tarifa.TfVoiceMt = (tarifa.ToVoiceMt != -1) ? tarifa.ToVoiceMt - (tarifa.ToVoiceMt * tarifa.iva) : -1;
                    tarifa.TfSMSMo = (tarifa.ToSMSMo != -1) ? tarifa.ToSMSMo - (tarifa.ToSMSMo * tarifa.iva) : -1;
                }

            }
            catch (Exception )
            {

            }
            return lista;
        }
        public List<Grupo> todosGrupos(string codes)
        {
            codes = codes.TrimEnd(',');
            List<Grupo> listaCode = new List<Grupo>();
            try
            {
                var grupo = db.sp_ic_obtieneIdGrupo(codes);
                foreach (var ogrupo in grupo)
                {
                    listaCode.Add(new Grupo
                    {
                        Id = ogrupo.Id,
                        Grupo1 = ogrupo.Grupo
                    });
                }
            }
            catch (Exception )
            {

            }
            return listaCode;
        }

        public List<Operador> todosOperadores(string codes)
        {
            codes = codes.TrimEnd(',');

            List<Operador> listaOperador = new List<Operador>();
            try
            {
                var operador = db.sp_ic_obtieneIdsOperadorGrupo(codes);

                foreach (var oOperador in operador.ToList())
                {
                    listaOperador.Add(new Operador
                    {
                        Id = oOperador.idoperador,
                        Id_Grupo = oOperador.idgrupo,
                        Razon_Social = oOperador.razonsocial
                    });
                }
            }
            catch (Exception )
            {

            }
            return listaOperador;
        }

        public List<TarifaRoaming> buscaGrupo(List<TarifaRoaming> lista, List<Grupo> listaGrupo, string[] arrCode, List<string> listaErroneos)
        {
            try
            {
                arrCode = arrCode.Where(x => !string.IsNullOrEmpty(x)).ToArray();
                int contador = 0;
                foreach (var elemento in lista)
                {
                    if (listaGrupo.Exists(x => x.Grupo1 == arrCode[contador]))
                        elemento.Code = listaGrupo.Where(x => x.Grupo1 == arrCode[contador]).SingleOrDefault().Id;
                    else
                    {
                        listaErroneos.Add("Linea: " + contador + " Code: " + arrCode[contador] + " No existe");
                        lista.Remove(elemento);
                    }

                    contador++;
                }

            }
            catch (Exception )
            {

            }
            return lista;
        }

        public List<TarifaRoaming> buscaOperador(List<TarifaRoaming> lista, List<Operador> listaOperador, string[] arrCodes, List<string> listaErroneos)
        {
            int contador = 0;
            try
            {
                arrCodes = arrCodes.Where(x => !string.IsNullOrEmpty(x)).ToArray();

                foreach (var elemento in lista)
                {
                    string codigo = arrCodes[contador];
                    Grupo grp = db.Grupo.Where(x => x.Grupo1 == codigo).SingleOrDefault();
                    if (grp != null)
                    {
                        if (listaOperador.Exists(x => x.Id_Grupo == grp.Id))
                        {
                            elemento.Id_Operador = listaOperador.Where(x => x.Id_Grupo == grp.Id).SingleOrDefault().Id;
                            elemento.Code = listaOperador.Where(x => x.Id_Grupo == grp.Id).SingleOrDefault().Id_Grupo;
                        }
                        else
                        {
                            listaErroneos.Add("Linea: " + contador + " Operador: " + arrCodes[contador] + " No existe");
                            elemento.Activo = 0;
                        }
                    }
                    else
                    {
                        listaErroneos.Add("Linea: " + contador + " Grupo: " + arrCodes[contador] + " No existe");
                        elemento.Activo = 0;
                    }

                    contador++;
                }

            }
            catch (Exception )
            {
                string error = contador.ToString();
            }
            return lista;
        }
        #endregion

        #region Combo
        public JsonResult llenaCarga()
        {
            object respuesta = null;
            List<object> lista = new List<object>();
            try
            {
                var submenu = from elementos in db.Submenu
                              join acceso in db.Acceso
                              on elementos.Id equals acceso.Id_Submenu
                              where acceso.Id_LineaNegocio == 1
                              && elementos.Activo == 1
                              && elementos.Id_Menu == 1
                              && elementos.carga == 1
                              select new
                              {
                                  elementos.Nombre,
                                  elementos.Id
                              };
                foreach (var elemento in submenu)
                {
                    lista.Add(new
                    {
                        elemento.Id,
                        elemento.Nombre
                    });
                }

                respuesta = new { success = true, results = lista };
            }
            catch (Exception e)
            {
                respuesta = new { success = false, results = e.Message };

            }
            return Json(respuesta, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}