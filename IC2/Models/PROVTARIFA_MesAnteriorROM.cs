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
    
    public partial class PROVTARIFA_MesAnteriorROM
    {
        public long Id { get; set; }
        public string PLMN { get; set; }
        public string OPERADOR { get; set; }
        public Nullable<int> DEUDOR { get; set; }
        public Nullable<decimal> PROVTARIFA_MesAnterior { get; set; }
        public Nullable<decimal> AjNcRealVsDevengMesAnter { get; set; }
        public Nullable<decimal> ProvDevengoTarifa_MesAnterior { get; set; }
        public Nullable<decimal> ProvisionNcTarifaCancelada { get; set; }
        public Nullable<decimal> ProvisionNcTarifa_MesAnterior { get; set; }
        public Nullable<decimal> TotalProvisionNcTarifa_MesAnterior { get; set; }
        public Nullable<decimal> ProvisionIngresoTarifaCancelada { get; set; }
        public Nullable<decimal> ProvIngresoTarifa_MesAnterior { get; set; }
        public Nullable<decimal> TotalProvIngresoTarifa_MesAnterior { get; set; }
        public Nullable<decimal> ComplementoTarifaMesesAnteriores { get; set; }
        public Nullable<decimal> TotalProvTarifa_MesAnterior { get; set; }
    }
}
