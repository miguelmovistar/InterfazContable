//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IC2.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class BonoConsumo
    {
        public int Id { get; set; }
        public Nullable<int> Id_Operador { get; set; }
        public string NombreOpe { get; set; }
        public Nullable<decimal> FactMin { get; set; }
        public Nullable<decimal> FactMax { get; set; }
        public Nullable<decimal> BonoComPor { get; set; }
        public Nullable<System.DateTime> FechaInicio { get; set; }
        public Nullable<System.DateTime> FechaFin { get; set; }
        public Nullable<int> Activo { get; set; }
        public Nullable<int> Id_LineaNegocio { get; set; }
    
        public virtual Operador Operador { get; set; }
    }
}
