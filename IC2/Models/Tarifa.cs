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
    
    public partial class Tarifa
    {
        public int Id { get; set; }
        public string SentidoTrafico { get; set; }
        public Nullable<int> Id_OperadorTarifa { get; set; }
        public Nullable<int> Id_TraficoSal { get; set; }
        public Nullable<decimal> VolMinimo { get; set; }
        public Nullable<decimal> VolMaximo { get; set; }
        public Nullable<decimal> Tarifa1 { get; set; }
        public Nullable<System.DateTime> VigInicio { get; set; }
        public Nullable<System.DateTime> VigFin { get; set; }
        public Nullable<int> Activo { get; set; }
        public Nullable<int> Id_LineaNegocio { get; set; }
    
        public virtual Operador Operador { get; set; }
        public virtual Trafico Trafico { get; set; }
    }
}
