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
    
    public partial class ajustesObjecion
    {
        public int Id { get; set; }
        public string sentido { get; set; }
        public Nullable<int> idSociedad { get; set; }
        public string sociedad { get; set; }
        public Nullable<int> idTrafico { get; set; }
        public string trafico { get; set; }
        public Nullable<int> idServicio { get; set; }
        public string servicio { get; set; }
        public Nullable<int> idDeudorAcreedor { get; set; }
        public string deudorAcreedor { get; set; }
        public Nullable<int> idOperador { get; set; }
        public string operador { get; set; }
        public Nullable<int> idGrupo { get; set; }
        public string grupo { get; set; }
        public System.DateTime periodo { get; set; }
        public Nullable<decimal> importe { get; set; }
        public string moneda { get; set; }
        public int activo { get; set; }
        public int lineaNegocio { get; set; }
        public System.DateTime periodoContable { get; set; }
    }
}
