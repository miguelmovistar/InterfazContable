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
    
    public partial class PolizasRoaming
    {
        public long Id { get; set; }
        public Nullable<long> IdPoliza { get; set; }
        public string Poliza { get; set; }
        public string TipoFichero { get; set; }
        public string Sentido { get; set; }
        public string Servicio { get; set; }
        public string SociedadSAP { get; set; }
        public string Estado { get; set; }
        public Nullable<bool> Enviado { get; set; }
        public string Nombre { get; set; }
        public string FechaCreacion { get; set; }
        public string FechaEnvio { get; set; }
        public string TipoFactura { get; set; }
        public Nullable<System.DateTime> PeriodoConsumido { get; set; }
        public string NumeroPoliza { get; set; }
        public string DescripcionMensaje { get; set; }
        public string Rechazado { get; set; }
        public string Reprocesado { get; set; }
        public Nullable<bool> PolizaGenerada { get; set; }
    }
}
