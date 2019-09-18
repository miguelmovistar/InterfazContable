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
    
    public partial class DatosTraficoLDI
    {
        public int Id { get; set; }
        public string Franchise { get; set; }
        public string Direccion { get; set; }
        public string Billed_Product { get; set; }
        public string Rating_Component { get; set; }
        public Nullable<int> Billing_Operator { get; set; }
        public Nullable<decimal> Unit_Cost_User { get; set; }
        public Nullable<System.DateTime> Month { get; set; }
        public Nullable<decimal> Calls { get; set; }
        public Nullable<decimal> Actual_Usage { get; set; }
        public Nullable<decimal> Charge_Usage { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public Nullable<decimal> Amount { get; set; }
        public Nullable<decimal> Iva { get; set; }
        public Nullable<int> id_trafico { get; set; }
        public Nullable<decimal> Sobrecargo { get; set; }
        public Nullable<int> NumeroCarga { get; set; }
        public Nullable<int> Id_Carga { get; set; }
        public Nullable<System.DateTime> fecha_proceso { get; set; }
        public Nullable<System.DateTime> fecha_contable { get; set; }
        public Nullable<int> estatus { get; set; }
    }
}
