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
    
    public partial class Concepto
    {
        public int Id { get; set; }
        public Nullable<int> Operador_Id { get; set; }
        public Nullable<int> Trafico_Id { get; set; }
        public string TraficoDescripcion { get; set; }
        public string Concepto1 { get; set; }
        public Nullable<int> Activo { get; set; }
        public Nullable<int> Id_LineaNegocio { get; set; }
    
        public virtual Operador Operador { get; set; }
        public virtual Trafico Trafico { get; set; }
    }
}
