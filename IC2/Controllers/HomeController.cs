using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using IC2.Models;
using IC2.Helpers;

namespace IC2.Controllers
{
    public class HomeController : Controller
    {
        ICPruebaEntities db = new ICPruebaEntities();

        public ActionResult Index(int IdLinea)
        {
            ViewBag.Linea = "Linea";
            Session["IdLinea"] = IdLinea;
            ViewBag.IdLinea = IdLinea;
            List<Submenu> listaSubmenu = new List<Submenu>();
            List<Menu> listaMenu = new List<Menu>();
            listaSubmenu = obtenerMenu(IdLinea);
            listaMenu = obtenerMenuPrincipal(IdLinea);
            Session["Lista"] = listaSubmenu;
            Session["ListaMenu"] = listaMenu;
            ViewBag.IdLinea = IdLinea;
            ViewBag.Lista = listaSubmenu;
            ViewBag.ListaMenu = listaMenu;
            return View(ViewBag);
        }
        public List<Submenu> obtenerMenu(int IdLinea)
        {
            List<Submenu> ListaMenu = new List<Submenu>();
            Submenu parametros = new Submenu();
            var acceso = from oAcceso in db.Acceso
                         join oSubmenu in db.Submenu
                         on oAcceso.Id_Submenu equals oSubmenu.Id
                         where oSubmenu.Activo == 1 && oAcceso.Id_LineaNegocio == IdLinea
                         && oSubmenu.Controlador != "ParametrosCarga"
                         select new
                         {
                             oSubmenu.Controlador,
                             oSubmenu.Nombre,
                             oSubmenu.Id_Menu
                         };
            foreach (var elemento in acceso) {
                ListaMenu.Add(new Submenu
                {
                    Nombre = elemento.Nombre,
                    Controlador = elemento.Controlador,
                    Id_Menu = elemento.Id_Menu
                });
            }
            ListaMenu = ListaMenu.OrderBy(x => x.Nombre ).ToList();
            parametros = db.Submenu.Where(x => x.Controlador == "ParametrosCarga").SingleOrDefault();
            ListaMenu.Insert(0, parametros);
            //ListaMenu.Add(parametros);

            
            return ListaMenu;
        }

        public List<Menu> obtenerMenuPrincipal(int IdLinea)
        {
            List<Menu> lista = new List<Menu>();
            var menu = from oMenu in db.Menu
                       join oMenuacceso in db.MenuAcceso
                       on oMenu.Id equals oMenuacceso.Id_Menu
                       where oMenuacceso.Id_LineaNegocio == IdLinea
                       select new
                       {
                           oMenu.Id,
                           oMenu.Nombre
                       };
            foreach (var elemento in menu) {
                lista.Add(new Menu
                {
                    Id = elemento.Id,
                    Nombre = elemento.Nombre
                });

            }
            return lista;
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}