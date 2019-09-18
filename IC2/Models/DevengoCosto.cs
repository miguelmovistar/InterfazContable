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
    
    public partial class DevengoCosto
    {
        public int Id { get; set; }
        public string Cuenta { get; set; }
        public string CentroCostos { get; set; }
        public string AreaFuncional { get; set; }
        public Nullable<int> id_servicio { get; set; }
        public Nullable<int> id_acreedor { get; set; }
        public Nullable<int> id_operador { get; set; }
        public string SoGL { get; set; }
        public string Operador { get; set; }
        public string NombreCorto { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public Nullable<System.DateTime> FechaConsumo { get; set; }
        public Nullable<System.DateTime> FechaSolicitud { get; set; }
        public Nullable<decimal> TipoCambio { get; set; }
        public Nullable<decimal> CancelacionProvision { get; set; }
        public Nullable<decimal> CancelacionprovisionNCR { get; set; }
        public Nullable<decimal> Facturacion { get; set; }
        public Nullable<decimal> NCREmitidas { get; set; }
        public Nullable<decimal> Provision { get; set; }
        public Nullable<decimal> ProvisionNCR { get; set; }
        public Nullable<decimal> Exceso { get; set; }
        public Nullable<decimal> TotalDevengo { get; set; }
    }
}
