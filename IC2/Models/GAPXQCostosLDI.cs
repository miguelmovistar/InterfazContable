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
    
    public partial class GAPXQCostosLDI
    {
        public int Id { get; set; }
        public System.DateTime periodo { get; set; }
        public string moneda { get; set; }
        public string grupo { get; set; }
        public string trafico { get; set; }
        public Nullable<decimal> minuto { get; set; }
        public Nullable<decimal> tarifa { get; set; }
        public Nullable<decimal> USD { get; set; }
        public Nullable<decimal> pesos { get; set; }
        public Nullable<decimal> tipoCambio { get; set; }
        public int lineaNegocio { get; set; }
    }
}
