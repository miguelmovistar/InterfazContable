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
    
    public partial class PXQSMSLDI
    {
        public int Id { get; set; }
        public System.DateTime periodo { get; set; }
        public string trafico { get; set; }
        public string movimiento { get; set; }
        public decimal eventos { get; set; }
        public Nullable<decimal> tarifa { get; set; }
        public Nullable<decimal> USD { get; set; }
        public Nullable<decimal> MXN { get; set; }
        public Nullable<decimal> tipoCambio { get; set; }
        public int lineaNegocio { get; set; }
    }
}
