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
    
    public partial class GAFluctuacionCostoLDI
    {
        public int id { get; set; }
        public string cuentaContable { get; set; }
        public Nullable<int> id_grupo { get; set; }
        public string nombreGrupo { get; set; }
        public Nullable<int> id_acreedor { get; set; }
        public string nombreAcreedorSAP { get; set; }
        public string codigoAcreedor { get; set; }
        public Nullable<int> id_operador { get; set; }
        public string sociedadGL { get; set; }
        public Nullable<System.DateTime> fecha_contable { get; set; }
        public string claseDocumento { get; set; }
        public string sentido { get; set; }
        public string factura { get; set; }
        public string num_Documento_PF { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public string moneda { get; set; }
        public Nullable<int> id_servicio { get; set; }
        public Nullable<int> id_trafico { get; set; }
        public string cuenta_Fluctuacion { get; set; }
        public Nullable<decimal> TC_Provision { get; set; }
        public Nullable<decimal> TC_Cierre { get; set; }
        public Nullable<decimal> TC_Facturado { get; set; }
        public Nullable<decimal> importe_Provision { get; set; }
        public Nullable<decimal> importe_Provision_MXN { get; set; }
        public Nullable<decimal> importe_Revaluado { get; set; }
        public Nullable<decimal> importe_Facturado { get; set; }
        public Nullable<decimal> imp_Fac_Sop_Provision { get; set; }
        public Nullable<decimal> facturado_MXN { get; set; }
        public Nullable<decimal> variacion_MXN { get; set; }
        public Nullable<decimal> efecto_Operativo { get; set; }
        public Nullable<decimal> fluctuacion_Cambiaria { get; set; }
        public string estatus { get; set; }
        public Nullable<System.DateTime> periodo { get; set; }
    }
}
