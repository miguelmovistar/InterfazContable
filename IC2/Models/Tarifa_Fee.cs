//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IC2.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tarifa_Fee
    {
        public int Id { get; set; }
        public Nullable<int> Id_Sociedad { get; set; }
        public Nullable<int> Id_Grupo { get; set; }
        public Nullable<int> Id_Trafico { get; set; }
        public string Fee { get; set; }
        public Nullable<System.DateTime> Fecha_Inicio { get; set; }
        public Nullable<System.DateTime> Fecha_Fin { get; set; }
        public Nullable<decimal> Tarifa { get; set; }
        public Nullable<decimal> Porcentaje { get; set; }
        public Nullable<int> Activo { get; set; }
        public Nullable<int> Id_LineaNegocio { get; set; }
    
        public virtual Grupo Grupo { get; set; }
        public virtual Sociedad Sociedad { get; set; }
        public virtual Trafico Trafico { get; set; }
    }
}
