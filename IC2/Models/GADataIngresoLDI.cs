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
    
    public partial class GADataIngresoLDI
    {
        public int id { get; set; }
        public Nullable<System.DateTime> fecha_proceso { get; set; }
        public Nullable<System.DateTime> fecha_contable { get; set; }
        public Nullable<System.DateTime> mes { get; set; }
        public Nullable<int> id_movimiento { get; set; }
        public Nullable<int> id_moneda { get; set; }
        public Nullable<int> id_servicio { get; set; }
        public Nullable<int> id_grupo { get; set; }
        public Nullable<int> id_operador { get; set; }
        public Nullable<int> id_deudor { get; set; }
        public Nullable<int> id_trafico { get; set; }
        public Nullable<decimal> segundos { get; set; }
        public Nullable<decimal> min_fact { get; set; }
        public Nullable<decimal> tarifa_ext { get; set; }
        public Nullable<decimal> tarifa_final { get; set; }
        public Nullable<decimal> cantidad { get; set; }
        public Nullable<decimal> importe_ingreso { get; set; }
        public string no_factura_referencia { get; set; }
        public Nullable<decimal> monto_facturado { get; set; }
        public Nullable<int> llamadas { get; set; }
        public Nullable<decimal> iva { get; set; }
        public Nullable<decimal> sobrecargo { get; set; }
        public Nullable<int> estatus { get; set; }
        public Nullable<int> id_origen { get; set; }
    }
}
