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
    
    public partial class NCTarifaROM
    {
        public long Id { get; set; }
        public Nullable<System.DateTime> FECHA_INICIO { get; set; }
        public Nullable<System.DateTime> FECHA_FIN { get; set; }
        public string PLMN { get; set; }
        public string DEUDOR { get; set; }
        public string OPERADOR { get; set; }
        public string FOLIOFACTURA_SAP { get; set; }
        public string FACTURADO_SIN_IMPUESTOS { get; set; }
        public string GRUPO { get; set; }
        public Nullable<decimal> TC { get; set; }
        public Nullable<decimal> MXN { get; set; }
    }
}
