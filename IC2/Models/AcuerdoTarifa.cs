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
    
    public partial class AcuerdoTarifa
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AcuerdoTarifa()
        {
            this.Acuerdo_Grupo = new HashSet<Acuerdo_Grupo>();
        }
    
        public int IdAcuerdo { get; set; }
        public string Id_Acuerdo { get; set; }
        public int Id_Operador { get; set; }
        public Nullable<decimal> EntInferior { get; set; }
        public Nullable<decimal> EntSuperior { get; set; }
        public Nullable<decimal> TarifaEnt { get; set; }
        public Nullable<decimal> Ingreso { get; set; }
        public Nullable<decimal> SalInferior { get; set; }
        public Nullable<decimal> SalSuperior { get; set; }
        public Nullable<decimal> TarifaSal { get; set; }
        public Nullable<decimal> Costo { get; set; }
        public Nullable<decimal> Ratio { get; set; }
        public Nullable<System.DateTime> FechaInicio { get; set; }
        public Nullable<System.DateTime> FechaFin { get; set; }
        public Nullable<int> Activo { get; set; }
        public Nullable<int> Id_LineaNegocio { get; set; }
        public Nullable<int> Id_TraficoEntrada { get; set; }
        public Nullable<int> Id_TraficoSalida { get; set; }
        public Nullable<System.DateTime> fecha_modificacion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Acuerdo_Grupo> Acuerdo_Grupo { get; set; }
    }
}
