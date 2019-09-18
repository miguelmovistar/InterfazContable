/* Nombre: CierreIngresosROM.js  
* Creado por: Una Pinche Pistola
* Fecha de Creación: 12/junio/2019
* Descripcion: JS de Reportes Devengo Costo LDI
* Modificado por: Esther Sandoval
* Ultima Fecha de modificación: 12-07-2019
*/
Ext.define('CMS.view.FileDownload', {
    extend: 'Ext.Component',
    alias: 'widget.FileDownloader',
    autoEl: {
        tag: 'iframe',
        cls: 'x-hidden',
        src: Ext.SSL_SECURE_URL
    },
    stateful: false,
    load: function (config) {
        var e = this.getEl();
        e.dom.src = config.url +
            (config.params ? '?' + Ext.urlEncode(config.params) : '');
        e.dom.onload = function () {
            if (e.dom.contentDocument.body.childNodes[0].wholeText == '404') {
                Ext.Msg.show({
                    title: 'NO FUE POSIBLE GENERAR EL DOCUMENTO...',
                    msg: 'Por favor contacte al area de soporte para identificar el origen del problema.',
                    buttons: Ext.Msg.OK,
                    icon: Ext.MessageBox.ERROR
                })
            }
        }
    }
});

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;

    Ext.define('model_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });
    Ext.define('model_BuscarIngreso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Cuenta_Resultados', mapping: 'Cuenta_Resultados' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'Provisiones', mapping: 'Provisiones' },
                { name: 'Provisiones_NC_Objeciones', mapping: 'Provisiones_NC_Objeciones' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'SoGL', mapping: 'SoGL' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Cancelacion_Devengo_Trafico', mapping: 'Cancelacion_Devengo_Trafico' },
                { name: 'Cancelacion_Prov_NC_Tarifa', mapping: 'Cancelacion_Prov_NC_Tarifa' },
                { name: 'Cancelacion_Prov_Ingreso_Tarifa', mapping: 'Cancelacion_Prov_Ingreso_Tarifa' },
                { name: 'Cancelacion_Prov_NC_Objecion', mapping: 'Cancelacion_Prov_NC_Objecion' },
                { name: 'CancelacionProvision', mapping: 'CancelacionProvision' },
                { name: 'CancelacionprovisionNCR', mapping: 'CancelacionprovisionNCR' },
                { name: 'Cancelacion_Devengo_Total', mapping: 'Cancelacion_Devengo_Total' },
                { name: 'Facturacion_Trafico', mapping: 'Facturacion_Trafico' },
                { name: 'Facturacion_Tarifa', mapping: 'Facturacion_Tarifa' },
                { name: 'NCR_Trafico', mapping: 'NCR_Trafico' },
                { name: 'NCR_Tarifa', mapping: 'NCR_Tarifa' },
                { name: 'Devengo_Ingreso_Trafico', mapping: 'Devengo_Ingreso_Trafico' },
                { name: 'Prov_Ingreso_DIF_Tarifa', mapping: 'Prov_Ingreso_DIF_Tarifa' },
                { name: 'Prov_NCR_DIF_Tarjeta', mapping: 'Prov_NCR_DIF_Tarjeta' },
                { name: 'Prov_NCR_Objeciones', mapping: 'Prov_NCR_Objeciones' },
                { name: 'Exceso', mapping: 'Exceso' },
                { name: 'Fluctuacion', mapping: 'Fluctuacion' },
                { name: 'Total_Devengo', mapping: 'Total_Devengo' },
                { name: 'Grupo', mapping: 'Grupo' },
                { name: 'Suma_Total', mapping: 'Suma_Total' }
            ]
        });
    Ext.define('model_BuscarCancelProvIngreso', // CPI 
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'Devengo_Trafico', mapping: 'Devengo_Trafico' },
                { name: 'Devengo_Pendiente', mapping: 'Devengo_Pendiente' },
                { name: 'Devengo_Acumulado', mapping: 'Devengo_Acumulado' }
            ]
        });
    Ext.define('model_BuscarCancelProvTrafico', // PT 
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'Provision_Tarifa', mapping: 'Provision_Tarifa' },
                { name: 'AjusteNC_Devengo', mapping: 'AjusteNC_Devengo' },
                { name: 'ProvisionDevengo_Tarifa', mapping: 'ProvisionDevengo_Tarifa' },
                { name: 'ProvisionNC_TarifaCancelada', mapping: 'ProvisionNC_TarifaCancelada' },
                { name: 'ProvisionNC_Tarifa', mapping: 'ProvisionNC_Tarifa' },
                { name: 'TotalProvisionNC_Tarifa', mapping: 'TotalProvisionNC_Tarifa' },
                { name: 'ProvisionIngreso_TarifaCancelada', mapping: 'ProvisionIngreso_TarifaCancelada' },
                { name: 'ProvisionIngreso_Tarifa', mapping: 'ProvisionIngreso_Tarifa' },
                { name: 'TotalProvisionIngreso_Tarifa', mapping: 'TotalProvisionIngreso_Tarifa' },
                { name: 'Complemento_Tarifa', mapping: 'Complemento_Tarifa' },
                { name: 'TotalProvision_Tarifa', mapping: 'TotalProvision_Tarifa' }
            ]
        });
    Ext.define('model_BuscarDataIngresosRoadming',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'NoProvision', mapping: 'NoProvision' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'RazonSocial', mapping: 'RazonSocial' },
                { name: 'NoDeudorSAP', mapping: 'NoDeudorSAP' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'TipoRegistro', mapping: 'TipoRegistro' },
                { name: 'Operacion', mapping: 'Operacion' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'TC', mapping: 'TC' },
                { name: 'ImporteMD', mapping: 'ImporteMD' },
                { name: 'ImporteMXN', mapping: 'ImporteMXN' },
                { name: 'SociedadGL', mapping: 'SociedadGL' },
                { name: 'RealConfirmado', mapping: 'RealConfirmado' },
                { name: 'Cancelacion', mapping: 'Cancelacion' },
                { name: 'RemanenteMD', mapping: 'RemanenteMD' },
                { name: 'RemanenteMXN', mapping: 'RemanenteMXN' },
                { name: 'RemanenteUSD', mapping: 'RemanenteUSD' },
                { name: 'Dias', mapping: 'Dias' },
                { name: 'Cajon', mapping: 'Cajon' },
                { name: 'Plazo', mapping: 'Plazo' },
                { name: 'FechaCierre', mapping: 'FechaCierre' },
                { name: 'TCCierre', mapping: 'TCCierre' },
                { name: 'FilaSuma', mapping: 'FilaSuma' },
                { name: 'FilaResumen', mapping: 'FilaResumen' }
            ]
        });
    Ext.define('model_BuscarCancelProvicion',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Deudor', mapping: 'Deudor' },
                { name: 'SociedadGL', mapping: 'SociedadGL' },
                { name: 'PLMN', mapping: 'PLMN' },
                { name: 'TipoConcepto', mapping: 'TipoConcepto' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'ImporteMonedaDocumento', mapping: 'ImporteMonedaDocumento' },
                { name: 'ImporteMXN', mapping: 'ImporteMXN' },
                { name: 'TC', mapping: 'TC' },
                { name: 'FolioDocumento', mapping: 'FolioDocumento' },
                { name: 'NoDocSAP', mapping: 'NoDocSAP' },
                { name: 'Grupo', mapping: 'Grupo' }
            ]
        });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/LlenaPeriodo?lineaNegocio=' + 2,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    var store_BuscarIngreso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarIngreso',
        storeId: 'idstore_BuscarIngreso',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostos/LlenaGridIngreso',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    var store_BuscarCPI = Ext.create('Ext.data.Store', {
        model: 'model_BuscarIngreso',
        storeId: 'model_BuscarCancelProvIngreso',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostos/LlenaGridCPI',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    var store_BuscarCPT = Ext.create('Ext.data.Store', {
        model: 'model_BuscarIngreso',
        storeId: 'model_BuscarCancelProvTrafico',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostos/LlenaGridCPI',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    var store_BuscarIngresoRoadming = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDataIngresosRoadming',
        storeId: 'model_BuscarDataIngresoRoadming',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostos/LlenaGridCPI',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    var store_BuscarCancelProvicion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCancelProvicion',
        storeId: 'model_BuscarCancelProvicion',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostos/LlenaGridCPI',
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success',
                totalProperty: 'total'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarIngreso,
        displayInfo: true,
        displayMsg: "Roadming Ingreso",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '20%',
                margin: '0 0 30 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarIngreso.pageSize = cuenta;
                        store_BuscarIngreso.load();
                    }

                }
            }
        ]
    });
    var paginadorCP = new Ext.PagingToolbar({
        id: 'paginadorCP',
        store: store_BuscarCPI,
        displayInfo: true,
        displayMsg: "Roadming CP",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '20%',
                margin: '0 0 30 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarCPI.pageSize = cuenta;
                        store_BuscarCPI.load();
                    }

                }
            }
        ]
    });
    var paginadorCPT = new Ext.PagingToolbar({
        id: 'paginadorCPT',
        store: store_BuscarCPT,
        displayInfo: true,
        displayMsg: "Roadming CPT",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '20%',
                margin: '0 0 30 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarCPT.pageSize = cuenta;
                        store_BuscarCPT.load();
                    }

                }
            }
        ]
    });
    var paginadorDIR = new Ext.PagingToolbar({
        id: 'paginadorDataIngresoRoadming',
        store: store_BuscarIngresoRoadming,
        displayInfo: true,
        displayMsg: "Roadming DIR",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '20%',
                margin: '0 0 30 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarIngresoRoadming.pageSize = cuenta;
                        store_BuscarIngresoRoadming.load();
                    }

                }
            }
        ]
    });
    var paginadorCancelProv = new Ext.PagingToolbar({
        id: 'paginadorCancelProv',
        store: store_BuscarCancelProvicion,
        displayInfo: true,
        displayMsg: "Roadming CancelProv",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '20%',
                margin: '0 0 30 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarCancelProvicion.pageSize = cuenta;
                        store_BuscarCancelProvicion.load();
                    }

                }
            }
        ]
    });


    //CierreIngresosROM

    var configIngresos = Utils.defineModelStore({
        name: 'Ingresos',
        paginadorText: "Ingresos",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarIngreso',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "FechaPeriodoCierre", mapping: "FechaPeriodoCierre" },
            { name: "CuentaResultados", mapping: "CuentaResultados" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "Sociedad_GL", mapping: "Sociedad_GL" },
            { name: "Moneda", mapping: "Moneda" },
            { name: "CancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
            { name: "CancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
            { name: "CancelacionProvIngreso_TarifaMesAnterior", mapping: "CancelacionProvIngreso_TarifaMesAnterior" },
            { name: "CancelacionTProvNcObjecion", mapping: "CancelacionTProvNcObjecion" },
            { name: "CancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior_ProvisionMesAnterior" },
            { name: "FacturacionTrafico", mapping: "FacturacionTrafico" },
            { name: "FacturacionTarifa", mapping: "FacturacionTarifa" },
            { name: "NCRTrafico", mapping: "NCRTrafico" },
            { name: "NCRTarifa", mapping: "NCRTarifa" },
            { name: "DevengoIngresoTrafico", mapping: "DevengoIngresoTrafico" },
            { name: "ProvIngresoDifTarifa", mapping: "ProvIngresoDifTarifa" },
            { name: "ProvNcrDifTarifa", mapping: "ProvNcrDifTarifa" },
            { name: "ProvNcrObjeciones", mapping: "ProvNcrObjeciones" },
            { name: "ExcesoInsufDevMesAnt", mapping: "ExcesoInsufDevMesAnt" },
            { name: "FluctuacionReclasificar", mapping: "FluctuacionReclasificar" },
            { name: "TotalDevengo", mapping: "TotalDevengo" },
            { name: "Grupo", mapping: "Grupo" },
            { name: "SUMACancelacionDevengoTrafico", mapping: "CancelacionDevengoTrafico" },
            { name: "SUMACancelacionProvNcTarifaMesAnterior", mapping: "CancelacionProvNcTarifaMesAnterior" },
            { name: "SUMACancelacionProvIngreso_TarifaMesAnterior", mapping: "CancelacionProvIngreso_TarifaMesAnterior" },
            { name: "SUMACancelacionTProvNcObjecion", mapping: "CancelacionTProvNcObjecion" },
            { name: "SUMACancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", mapping: "CancelacionDevengoTotalMesAnterior_ProvisionMesAnterior" },
            { name: "SUMAFacturacionTrafico", mapping: "FacturacionTrafico" },
            { name: "SUMAFacturacionTarifa", mapping: "FacturacionTarifa" },
            { name: "SUMANcrTrafico", mapping: "NCRTrafico" },
            { name: "SUMANcrTarifa", mapping: "NCRTarifa" },
            { name: "SUMADevengoIngresoTrafico", mapping: "DevengoIngresoTrafico" },
            { name: "SUMAProvIngresoDifTarifa", mapping: "ProvIngresoDifTarifa" },
            { name: "SUMAProvNcrDifTarifa", mapping: "ProvNcrDifTarifa" },
            { name: "SUMAProvNcrObjeciones", mapping: "ProvNcrObjeciones" },
            { name: "SUMAExcesoInsufDevMesAnt", mapping: "ExcesoInsufDevMesAnt" },
            { name: "SUMAFluctuacionReclasificar", mapping: "FluctuacionReclasificar" },
            { name: "SUMATotalDevengo", mapping: "TotalDevengo" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "FechaPeriodoCierre", dataIndex: "FechaPeriodoCierre", text: "FechaPeriodoCierre", width: "8%" },
            { id: "CuentaResultados", dataIndex: "CuentaResultados", text: "CuentaResultados", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "Sociedad_GL", dataIndex: "Sociedad_GL", text: "Sociedad_GL", width: "8%" },
            { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
            { id: "CancelacionDevengoTrafico", dataIndex: "CancelacionDevengoTrafico", text: "CancelacionDevengoTrafico", width: "8%" },
            { id: "CancelacionProvNcTarifaMesAnterior", dataIndex: "CancelacionProvNcTarifaMesAnterior", text: "CancelacionProvNcTarifaMesAnterior", width: "8%" },
            { id: "CancelacionProvIngreso_TarifaMesAnterior", dataIndex: "CancelacionProvIngreso_TarifaMesAnterior", text: "CancelacionProvIngreso_TarifaMesAnterior", width: "8%" },
            { id: "CancelacionTProvNcObjecion", dataIndex: "CancelacionTProvNcObjecion", text: "CancelacionTProvNcObjecion", width: "8%" },
            { id: "CancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", dataIndex: "CancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", text: "CancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", width: "8%" },
            { id: "FacturacionTrafico", dataIndex: "FacturacionTrafico", text: "FacturacionTrafico", width: "8%" },
            { id: "FacturacionTarifa", dataIndex: "FacturacionTarifa", text: "FacturacionTarifa", width: "8%" },
            { id: "NcrTrafico", dataIndex: "NCRTrafico", text: "NCRTrafico", width: "8%" },
            { id: "NcrTarifa", dataIndex: "NCRTarifa", text: "NCRTarifa", width: "8%" },
            { id: "DevengoIngresoTrafico", dataIndex: "DevengoIngresoTrafico", text: "DevengoIngresoTrafico", width: "8%" },
            { id: "ProvIngresoDifTarifa", dataIndex: "ProvIngresoDifTarifa", text: "ProvIngresoDifTarifa", width: "8%" },
            { id: "ProvNcrDifTarifa", dataIndex: "ProvNcrDifTarifa", text: "ProvNcrDifTarifa", width: "8%" },
            { id: "ProvNcrObjeciones", dataIndex: "ProvNcrObjeciones", text: "ProvNcrObjeciones", width: "8%" },
            { id: "ExcesoInsufDevMesAnt", dataIndex: "ExcesoInsufDevMesAnt", text: "ExcesoInsufDevMesAnt", width: "8%" },
            { id: "FluctuacionReclasificar", dataIndex: "FluctuacionReclasificar", text: "FluctuacionReclasificar", width: "8%" },
            { id: "TotalDevengo", dataIndex: "TotalDevengo", text: "TotalDevengo", width: "8%" },
            { id: "Grupo", dataIndex: "Grupo", text: "Grupo", width: "8%" },
            { id: "SUMACancelacionDevengoTrafico", dataIndex: "SUMACancelacionDevengoTrafico", text: "SUMACancelacionDevengoTrafico", width: "8%" },
            { id: "SUMACancelacionDevengoTrafico", dataIndex: "SUMACancelacionDevengoTrafico", text: "SUMACancelacionDevengoTrafico", width: "8%" },
            { id: "SUMACancelacionDevengoTrafico", dataIndex: "SUMACancelacionDevengoTrafico", text: "SUMACancelacionDevengoTrafico", width: "8%" },
            { id: "SUMACancelacionTProvNcObjecion", dataIndex: "SUMACancelacionTProvNcObjecion", text: "SUMACancelacionTProvNcObjecion", width: "8%" },
            { id: "SUMACancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", dataIndex: "SUMACancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", text: "SUMACancelacionDevengoTotalMesAnterior_ProvisionMesAnterior", width: "8%" },
            { id: "SUMAFacturacionTrafico", dataIndex: "SUMAFacturacionTrafico", text: "SUMAFacturacionTrafico", width: "8%" },
            { id: "SUMAFacturacionTarifa", dataIndex: "SUMAFacturacionTarifa", text: "SUMAFacturacionTarifa", width: "8%" },
            { id: "SUMANcrTrafico", dataIndex: "SUMANcrTrafico", text: "SUMANcrTrafico", width: "8%" },
            { id: "SUMANcrTarifa", dataIndex: "SUMANcrTarifa", text: "SUMANcrTarifa", width: "8%" },
            { id: "SUMADevengoIngresoTrafico", dataIndex: "SUMADevengoIngresoTrafico", text: "SUMADevengoIngresoTrafico", width: "8%" },
            { id: "SUMAProvIngresoDifTarifa", dataIndex: "SUMAProvIngresoDifTarifa", text: "SUMAProvIngresoDifTarifa", width: "8%" },
            { id: "SUMAProvNcrDifTarifa", dataIndex: "SUMAProvNcrDifTarifa", text: "SUMAProvNcrDifTarifa", width: "8%" },
            { id: "SUMAProvNcrObjeciones", dataIndex: "SUMAProvNcrObjeciones", text: "SUMAProvNcrObjeciones", width: "8%" },
            { id: "SUMAExcesoInsufDevMesAnt", dataIndex: "SUMAExcesoInsufDevMesAnt", text: "SUMAExcesoInsufDevMesAnt", width: "8%" },
            { id: "SUMAFluctuacionReclasificar", dataIndex: "SUMAFluctuacionReclasificar", text: "SUMAFluctuacionReclasificar", width: "8%" },
            { id: "SUMATotalDevengo", dataIndex: "SUMATotalDevengo", text: "SUMATotalDevengo", width: "8%" }
        ]
    });

    //Dev Acum Trafico Ingresos ROM

    var configDevAcumTraficoIngresoROM = Utils.defineModelStore({
        name: 'DevAcumTraficoIngresoROM',
        paginadorText: "DevAcumTraficoIngresoROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarDevAcumTraficoIngresoROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "DevengoTrafico_MesCIerre", mapping: "DevengoTrafico_MesCIerre" },
            { name: "DevengoPendEmitirFechaProvisionIngresoPendienteEmitir", mapping: "DevengoPendEmitirFechaProvisionIngresoPendienteEmitir" },
            { name: "DevengoAcumuladoFechaCierre", mapping: "DevengoAcumuladoFechaCierre" },
            { name: "DevengoAcumuladoA30_11_2018", mapping: "DevengoAcumuladoA30_11_2018" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "DevengoTrafico_MesCIerre", dataIndex: "DevengoTrafico_MesCIerre", text: "DevengoTrafico_MesCIerre", width: "8%" },
            { id: "DevengoPendEmitirFechaProvisionIngresoPendienteEmitir", dataIndex: "DevengoPendEmitirFechaProvisionIngresoPendienteEmitir", text: "DevengoPendEmitirFechaProvisionIngresoPendienteEmitir", width: "8%" },
            { id: "DevengoAcumuladoFechaCierre", dataIndex: "DevengoAcumuladoFechaCierre", text: "DevengoAcumuladoFechaCierre", width: "8%" },
            { id: "DevengoAcumuladoA30_11_2018", dataIndex: "DevengoAcumuladoA30_11_2018", text: "DevengoAcumuladoA30_11_2018", width: "8%" }
        ]
    });

    //Cancelac Prov Trafico Ingreso ROM

    var configCancelacProvTrafIngresoROM = Utils.defineModelStore({
        name: 'CancelacProvTrafIngresoROM',
        paginadorText: "CancelacProvTrafIngresoROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarCancelacProvTrafIngresoROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "DevengoTrafico_MesCierre", mapping: "DevengoTrafico_MesCierre" },
            { name: "DevengoPendEmitir_FechaProvisionIngresoPendienteEmitir", mapping: "DevengoPendEmitir_FechaProvisionIngresoPendienteEmitir" },
            { name: "DevengoAcumulado_AFechaCierre", mapping: "DevengoAcumulado_AFechaCierre" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "DevengoTrafico_MesCierre", dataIndex: "DevengoTrafico_MesCierre", text: "DevengoTrafico_MesCierre", width: "8%" },
            { id: "DevengoPendEmitir_FechaProvisionIngresoPendienteEmitir", dataIndex: "DevengoPendEmitir_FechaProvisionIngresoPendienteEmitir", text: "DevengoPendEmitir_FechaProvisionIngresoPendienteEmitir", width: "8%" },
            { id: "DevengoAcumulado_AFechaCierre", dataIndex: "DevengoAcumulado_AFechaCierre", text: "DevengoAcumulado_AFechaCierre", width: "8%" }
        ]
    });

    //Prov Tarifa

    var configPROVTARIFA_MesAnteriorROM = Utils.defineModelStore({
        name: 'PROVTARIFA_MesAnteriorROM',
        paginadorText: "PROVTARIFA_MesAnteriorROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarPROVTARIFA_MesAnteriorROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "PROVTARIFA_MesAnterior", mapping: "PROVTARIFA_MesAnterior" },
            { name: "AjNcRealVsDevengMesAnter", mapping: "AjNcRealVsDevengMesAnter" },
            { name: "ProvDevengoTarifa_MesAnterior", mapping: "ProvDevengoTarifa_MesAnterior" },
            { name: "ProvisionNcTarifaCancelada", mapping: "ProvisionNcTarifaCancelada" },
            { name: "ProvisionNcTarifa_MesAnterior", mapping: "ProvisionNcTarifa_MesAnterior" },
            { name: "TotalProvisionNcTarifa_MesAnterior", mapping: "TotalProvisionNcTarifa_MesAnterior" },
            { name: "ProvisionIngresoTarifaCancelada", mapping: "ProvisionIngresoTarifaCancelada" },
            { name: "ProvIngresoTarifa_MesAnterior", mapping: "ProvIngresoTarifa_MesAnterior" },
            { name: "TotalProvIngresoTarifa_MesAnterior", mapping: "TotalProvIngresoTarifa_MesAnterior" },
            { name: "ComplementoTarifaMesesAnteriores", mapping: "ComplementoTarifaMesesAnteriores" },
            { name: "TotalProvTarifa_MesAnterior", mapping: "TotalProvTarifa_MesAnterior" }

        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "PROVTARIFA_MesAnterior", dataIndex: "PROVTARIFA_MesAnterior", text: "PROVTARIFA_MesAnterior", width: "8%" },
            { id: "AjNcRealVsDevengMesAnter", dataIndex: "AjNcRealVsDevengMesAnter", text: "AjNcRealVsDevengMesAnter", width: "8%" },
            { id: "ProvDevengoTarifa_MesAnterior", dataIndex: "ProvDevengoTarifa_MesAnterior", text: "ProvDevengoTarifa_MesAnterior", width: "8%" },
            { id: "ProvisionNcTarifaCancelada", dataIndex: "ProvisionNcTarifaCancelada", text: "ProvisionNcTarifaCancelada", width: "8%" },
            { id: "ProvisionNcTarifa_MesAnterior", dataIndex: "ProvisionNcTarifa_MesAnterior", text: "ProvisionNcTarifa_MesAnterior", width: "8%" },
            { id: "TotalProvisionNcTarifa_MesAnterior", dataIndex: "TotalProvisionNcTarifa_MesAnterior", text: "TotalProvisionNcTarifa_MesAnterior", width: "8%" },
            { id: "ProvisionIngresoTarifaCancelada", dataIndex: "ProvisionIngresoTarifaCancelada", text: "ProvisionIngresoTarifaCancelada", width: "8%" },
            { id: "ProvIngresoTarifa_MesAnterior", dataIndex: "ProvIngresoTarifa_MesAnterior", text: "ProvIngresoTarifa_MesAnterior", width: "8%" },
            { id: "TotalProvIngresoTarifa_MesAnterior", dataIndex: "TotalProvIngresoTarifa_MesAnterior", text: "TotalProvIngresoTarifa_MesAnterior", width: "8%" },
            { id: "ComplementoTarifaMesesAnteriores", dataIndex: "ComplementoTarifaMesesAnteriores", text: "ComplementoTarifaMesesAnteriores", width: "8%" },
            { id: "TotalProvTarifa_MesAnterior", dataIndex: "TotalProvTarifa_MesAnterior", text: "TotalProvTarifa_MesAnterior", width: "8%" }

        ]
    });

    // Ajuste NC Real VS Dev
    var configAjusNcRealVsDevROM = Utils.defineModelStore({
        name: 'AjusNcRealVsDevROM',
        paginadorText: "AjusNcRealVsDevROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarAjusNcRealVsDevROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "ProvisionTarifaMesAnterior", mapping: "ProvisionTarifaMesAnterior" },
            { name: "ProvisionTarifaReal", mapping: "ProvisionTarifaReal" },
            { name: "Ajustes_tarifa", mapping: "Ajustes_tarifa" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "ProvisionTarifaMesAnterior", dataIndex: "ProvisionTarifaMesAnterior", text: "ProvisionTarifaMesAnterior", width: "8%" },
            { id: "ProvisionTarifaReal", dataIndex: "ProvisionTarifaReal", text: "ProvisionTarifaReal", width: "8%" },
            { id: "Ajustes_tarifa", dataIndex: "Ajustes_tarifa", text: "Ajustes_tarifa", width: "8%" }
        ]
    });

    //var configFacturaTarifa = Utils.defineModelStore({
    //    name: 'FacturaTarifaROM',
    //    paginadorText: "Factura Tarifa",
    //    urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarFacturaTarifa',
    //    modelFields: [
    //        { name: "Id", mapping: "Id" },
    //        { name: "FECHAINICIO", mapping: "FECHAINICIO" },
    //        { name: "FECHAFIN", mapping: "FECHAFIN" },
    //        { name: "PLMN", mapping: "PLMN" },
    //        { name: "DEUDOR", mapping: "DEUDOR" },
    //        { name: "OPERADOR", mapping: "OPERADOR" },
    //        { name: "FOLIOFACTURASAP", mapping: "FOLIOFACTURASAP" },
    //        { name: "FACTURADOSINIMPUESTOS", mapping: "FACTURADOSINIMPUESTOS" },
    //        { name: "GRUPO", mapping: "GRUPO" },
    //        { name: "TC", mapping: "TC" },
    //        { name: "MXN", mapping: "MXN" }
    //    ],
    //    gridColumns: [
    //        { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
    //        { id: "FECHAINICIO", dataIndex: "FECHAINICIO", text: "FECHAINICIO", width: "8%" },
    //        { id: "FECHAFIN", dataIndex: "FECHAFIN", text: "FECHAFIN", width: "8%" },
    //        { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
    //        { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
    //        { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
    //        { id: "FOLIOFACTURASAP", dataIndex: "FOLIOFACTURASAP", text: "FOLIOFACTURASAP", width: "8%" },
    //        { id: "FACTURADOSINIMPUESTOS", dataIndex: "FACTURADOSINIMPUESTOS", text: "FACTURADOSINIMPUESTOS", width: "8%" },
    //        { id: "GRUPO", dataIndex: "GRUPO", text: "GRUPO", width: "8%" },
    //        { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
    //        { id: "MXN", dataIndex: "MXN", text: "MXN", width: "8%" }
    //    ]
    //});

    //var configProvTarAcumMesesAnteROM = Utils.defineModelStore({
    //    name: 'ProvTarAcumMesesAnteROM',
    //    paginadorText: "ProvTarAcumMesesAnteROM",
    //    urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarProvTarAcumMesesAnteROM',
    //    modelFields: [
    //        { name: "Id", mapping: "Id" },
    //        { name: "PLMN", mapping: "PLMN" },
    //        { name: "OPERADOR", mapping: "OPERADOR" },
    //        { name: "DEUDOR", mapping: "DEUDOR" },
    //        { name: "ProvisionTarifaMesAnterior", mapping: "ProvisionTarifaMesAnterior" },
    //        { name: "ProvisionTarifaReal", mapping: "ProvisionTarifaReal" },
    //        { name: "Ajustes_tarifa", mapping: "Ajustes_tarifa" }
    //    ],
    //    gridColumns: [
    //        { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
    //        { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
    //        { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
    //        { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
    //        { id: "ProvisionTarifaMesAnterior", dataIndex: "ProvisionTarifaMesAnterior", text: "ProvisionTarifaMesAnterior", width: "8%" },
    //        { id: "ProvisionTarifaReal", dataIndex: "ProvisionTarifaReal", text: "ProvisionTarifaReal", width: "8%" },
    //        { id: "Ajustes_tarifa", dataIndex: "Ajustes_tarifa", text: "Ajustes_tarifa", width: "8%" }
    //    ]
    //});

    //var configCancelacionProvROM = Utils.defineModelStore({
    //    name: 'CancelacionProvROM',
    //    paginadorText: "CancelacionProvROM",
    //    urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarCancelacionProvROM',
    //    modelFields: [
    //        { name: "Id", mapping: "Id" },
    //        { name: "No_PROVISION", mapping: "No_PROVISION" },
    //        { name: "DEUDOR", mapping: "DEUDOR" },
    //        { name: "Sociedad_GL", mapping: "Sociedad_GL" },
    //        { name: "ID_OPERADOR", mapping: "ID_OPERADOR" },
    //        { name: "TIPO_O_CONCEPTO", mapping: "TIPO_O_CONCEPTO" },
    //        { name: "PERIODO", mapping: "PERIODO" },
    //        { name: "MONEDA", mapping: "MONEDA" },
    //        { name: "IMPORTE_MD", mapping: "IMPORTE_MD" },
    //        { name: "IMPORTE_MXN", mapping: "IMPORTE_MXN" },
    //        { name: "TC", mapping: "TC" },
    //        { name: "FOLIO_DOCUMENTO", mapping: "FOLIO_DOCUMENTO" },
    //        { name: "No_DOC_SAP", mapping: "No_DOC_SAP" },
    //        { name: "GRUPO", mapping: "GRUPO" }

    //    ],
    //    gridColumns: [
    //        { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
    //        { id: "No_PROVISION", dataIndex: "No_PROVISION", text: "No_PROVISION", width: "8%" },
    //        { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
    //        { id: "Sociedad_GL", dataIndex: "Sociedad_GL", text: "Sociedad_GL", width: "8%" },
    //        { id: "ID_OPERADOR", dataIndex: "ID_OPERADOR", text: "ID_OPERADOR", width: "8%" },
    //        { id: "TIPO_O_CONCEPTO", dataIndex: "TIPO_O_CONCEPTO", text: "TIPO_O_CONCEPTO", width: "8%" },
    //        { id: "PERIODO", dataIndex: "PERIODO", text: "PERIODO", width: "8%" },
    //        { id: "MONEDA", dataIndex: "MONEDA", text: "MONEDA", width: "8%" },
    //        { id: "IMPORTE_MD", dataIndex: "IMPORTE_MD", text: "IMPORTE_MD", width: "8%" },
    //        { id: "IMPORTE_MXN", dataIndex: "IMPORTE_MXN", text: "IMPORTE_MXN", width: "8%" },
    //        { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
    //        { id: "FOLIO_DOCUMENTO", dataIndex: "FOLIO_DOCUMENTO", text: "FOLIO_DOCUMENTO", width: "8%" },
    //        { id: "No_DOC_SAP", dataIndex: "No_DOC_SAP", text: "No_DOC_SAP", width: "8%" },
    //        { id: "GRUPO", dataIndex: "GRUPO", text: "GRUPO", width: "8%" }

    //    ]
    //});

    //Canc Provi Tar Per Anteri

    var configCancProvTarPerAnteROM = Utils.defineModelStore({
        name: 'CancProvTarPerAnteROM',
        paginadorText: "CancProvTarPerAnteROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarCancProvTarPerAnteROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PERIODO", mapping: "PERIODO" },
            { name: "ProvNcTarifaUSD", mapping: "ProvNcTarifaUSD" },
            { name: "ProvIngresoTarifaUSD", mapping: "ProvIngresoTarifaUSD" },
            { name: "ProvTarifaTotalUSD", mapping: "ProvTarifaTotalUSD" },
            { name: "TC", mapping: "TC" },
            { name: "ProvNcTarifaMXN", mapping: "ProvNcTarifaMXN" },
            { name: "ProvIngresoTarifaMXN", mapping: "ProvIngresoTarifaMXN" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "ProvNcTarifaUSDMesAnte", mapping: "ProvNcTarifaUSDMesAnte" },
            { name: "ProvIngresoTarifaUSDMesAnte", mapping: "ProvIngresoTarifaUSDMesAnte" },
            { name: "ProvTarifaTotalUSDMesAnte", mapping: "ProvTarifaTotalUSDMesAnte" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PERIODO", dataIndex: "PERIODO", text: "PERIODO", width: "8%" },
            { id: "ProvNcTarifaUSD", dataIndex: "ProvNcTarifaUSD", text: "ProvNcTarifaUSD", width: "8%" },
            { id: "ProvIngresoTarifaUSD", dataIndex: "ProvIngresoTarifaUSD", text: "ProvIngresoTarifaUSD", width: "8%" },
            { id: "ProvTarifaTotalUSD", dataIndex: "ProvTarifaTotalUSD", text: "ProvTarifaTotalUSD", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "ProvNcTarifaMXN", dataIndex: "ProvNcTarifaMXN", text: "ProvNcTarifaMXN", width: "8%" },
            { id: "ProvIngresoTarifaMXN", dataIndex: "ProvIngresoTarifaMXN", text: "ProvIngresoTarifaMXN", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "ProvNcTarifaUSDMesAnte", dataIndex: "ProvNcTarifaUSDMesAnte", text: "ProvNcTarifaUSDMesAnte", width: "8%" },
            { id: "ProvIngresoTarifaUSDMesAnte", dataIndex: "ProvIngresoTarifaUSDMesAnte", text: "ProvIngresoTarifaUSDMesAnte", width: "8%" },
            { id: "ProvTarifaTotalUSDMesAnte", dataIndex: "ProvTarifaTotalUSDMesAnte", text: "ProvTarifaTotalUSDMesAnte", width: "8%" }
        ]
    });

    //Prov Tar Acum Meses Anteri  lleva Columnas de Suma

    var configProvTarAcumMesesAnteROM = Utils.defineModelStore({
        name: 'ProvTarAcumMesesAnteROM',
        paginadorText: "ProvTarAcumMesesAnteROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarProvTarAcumMesesAnteROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PERIODO", mapping: "PERIODO" },
            { name: "ProvNcTarifaUSD", mapping: "ProvNcTarifaUSD" },
            { name: "ProvIngresoTarifaUSD", mapping: "ProvIngresoTarifaUSD" },
            { name: "ProvTarifaTotalUSD", mapping: "ProvTarifaTotalUSD" },
            { name: "CancelacionProvisionNcTarifa", mapping: "CancelacionProvisionNcTarifa" },
            { name: "CancelacionProvisionIngresoTarifa", mapping: "CancelacionProvisionIngresoTarifa" },
            { name: "TotalNcTarifaAcumuladaActual", mapping: "TotalNcTarifaAcumuladaActual" },
            { name: "TotalProvIngresoTarifaAcumuladaActual", mapping: "TotalProvIngresoTarifaAcumuladaActual" },
            { name: "TC", mapping: "TC" },
            { name: "ProvNcTarifaMXN", mapping: "ProvNcTarifaMXN" },
            { name: "ProvIngresoTarifaMXN", mapping: "ProvIngresoTarifaMXN" },
            { name: "ProvIngresoTarifaMXN", mapping: "ProvIngresoTarifaMXN" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PERIODO", dataIndex: "PERIODO", text: "PERIODO", width: "8%" },
            { id: "ProvNcTarifaUSD", dataIndex: "ProvNcTarifaUSD", text: "ProvNcTarifaUSD", width: "8%" },
            { id: "ProvIngresoTarifaUSD", dataIndex: "ProvIngresoTarifaUSD", text: "ProvIngresoTarifaUSD", width: "8%" },
            { id: "ProvTarifaTotalUSD", dataIndex: "ProvTarifaTotalUSD", text: "ProvTarifaTotalUSD", width: "8%" },
            { id: "CancelacionProvisionNcTarifa", dataIndex: "CancelacionProvisionNcTarifa", text: "CancelacionProvisionNcTarifa", width: "8%" },
            { id: "CancelacionProvisionIngresoTarifa", dataIndex: "CancelacionProvisionIngresoTarifa", text: "CancelacionProvisionIngresoTarifa", width: "8%" },
            { id: "TotalNcTarifaAcumuladaActual", dataIndex: "TotalNcTarifaAcumuladaActual", text: "TotalNcTarifaAcumuladaActual", width: "8%" },
            { id: "TotalProvIngresoTarifaAcumuladaActual", dataIndex: "TotalProvIngresoTarifaAcumuladaActual", text: "TotalProvIngresoTarifaAcumuladaActual", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "ProvNcTarifaMXN", dataIndex: "ProvNcTarifaMXN", text: "ProvNcTarifaMXN", width: "8%" },
            { id: "ProvIngresoTarifaMXN", dataIndex: "ProvIngresoTarifaMXN", text: "ProvIngresoTarifaMXN", width: "8%" }
        ]
    });

    // Fatura Trafico

    var configFacturaTraficoROM = Utils.defineModelStore({
        name: 'FacturaTraficoROM',
        paginadorText: "FacturaTraficoROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarFacturaTraficoROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "FECHATRAFICO", mapping: "FECHATRAFICO" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "FOLIOFACTURASAP", mapping: "FOLIOFACTURASAP" },
            { name: "REPORTEARMONTHLYINVOICE", mapping: "REPORTEARMONTHLYINVOICE" },
            { name: "FACTURADOSINIMPUESTOS", mapping: "FACTURADOSINIMPUESTOS" },
            { name: "POREMITIR", mapping: "POREMITIR" },
            { name: "GRUPO", mapping: "GRUPO" },
            { name: "TC", mapping: "TC" },
            { name: "MXN", mapping: "MXN" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "FECHATRAFICO", dataIndex: "FECHATRAFICO", text: "FECHATRAFICO", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "FOLIOFACTURASAP", dataIndex: "FOLIOFACTURASAP", text: "FOLIOFACTURASAP", width: "8%" },
            { id: "REPORTEARMONTHLYINVOICE", dataIndex: "REPORTEARMONTHLYINVOICE", text: "REPORTEARMONTHLYINVOICE", width: "8%" },
            { id: "FACTURADOSINIMPUESTOS", dataIndex: "FACTURADOSINIMPUESTOS", text: "FACTURADOSINIMPUESTOS", width: "8%" },
            { id: "POREMITIR", dataIndex: "POREMITIR", text: "POREMITIR", width: "8%" },
            { id: "GRUPO", dataIndex: "GRUPO", text: "GRUPO", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "MXN", dataIndex: "MXN", text: "MXN", width: "8%" }
        ]
    });

    //Factura Tarifa

    var configFacturaTarifaROM = Utils.defineModelStore({
        name: 'FacturaTarifaROM',
        paginadorText: "FacturaTarifaROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarFacturaTarifaROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "FECHA_INICIO", mapping: "FECHA_INICIO" },
            { name: "FECHA_FIN", mapping: "FECHA_FIN" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "FOLIOFACTURA_SAP", mapping: "FOLIOFACTURA_SAP" },
            { name: "FACTURADO_SIN_IMPUESTOS", mapping: "FACTURADO_SIN_IMPUESTOS" },
            { name: "GRUPO", mapping: "GRUPO" },
            { name: "TC", mapping: "TC" },
            { name: "MXN", mapping: "MXN" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "FECHA_INICIO", dataIndex: "FECHA_INICIO", text: "FECHA_INICIO", width: "8%" },
            { id: "FECHA_FIN", dataIndex: "FECHA_FIN", text: "FECHA_FIN", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "FOLIOFACTURA_SAP", dataIndex: "FOLIOFACTURA_SAP", text: "FOLIOFACTURA_SAP", width: "8%" },
            { id: "FACTURADO_SIN_IMPUESTOS", dataIndex: "FACTURADO_SIN_IMPUESTOS", text: "FACTURADO_SIN_IMPUESTOS", width: "8%" },
            { id: "GRUPO", dataIndex: "GRUPO", text: "GRUPO", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "MXN", dataIndex: "MXN", text: "MXN", width: "8%" }
        ]
    });

    //NC Trafico

    var configNCTraficoROM = Utils.defineModelStore({
        name: 'NCTraficoROM',
        paginadorText: "NCTraficoROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarNCTraficoROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "FECHA_TRAFICO", mapping: "FECHA_TRAFICO" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "FOLIOFACTURA_SAP", mapping: "FOLIOFACTURA_SAP" },
            { name: "FACTURADO_SIN_IMPUESTOS", mapping: "FACTURADO_SIN_IMPUESTOS" },
            { name: "GRUPO", mapping: "GRUPO" },
            { name: "TC", mapping: "TC" },
            { name: "MXN", mapping: "MXN" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "FECHA_TRAFICO", dataIndex: "FECHA_TRAFICO", text: "FECHA_TRAFICO", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "FOLIOFACTURA_SAP", dataIndex: "FOLIOFACTURA_SAP", text: "FOLIOFACTURA_SAP", width: "8%" },
            { id: "FACTURADO_SIN_IMPUESTOS", dataIndex: "FACTURADO_SIN_IMPUESTOS", text: "FACTURADO_SIN_IMPUESTOS", width: "8%" },
            { id: "GRUPO", dataIndex: "GRUPO", text: "GRUPO", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "MXN", dataIndex: "MXN", text: "MXN", width: "8%" }
        ]
    });

    //NC Tarifa

    var configNCTarifaROM = Utils.defineModelStore({
        name: 'NCTarifaROM',
        paginadorText: "NCTarifaROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarNCTarifaROM',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "FECHA_INICIO", mapping: "FECHA_INICIO" },
            { name: "FECHA_FIN", mapping: "FECHA_FIN" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "DEUDOR", mapping: "DEUDOR" },
            { name: "OPERADOR", mapping: "OPERADOR" },
            { name: "FOLIOFACTURA_SAP", mapping: "FOLIOFACTURA_SAP" },
            { name: "FACTURADO_SIN_IMPUESTOS", mapping: "FACTURADO_SIN_IMPUESTOS" },
            { name: "GRUPO", mapping: "GRUPO" },
            { name: "TC", mapping: "TC" },
            { name: "MXN", mapping: "MXN" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "FECHA_INICIO", dataIndex: "FECHA_INICIO", text: "FECHA_INICIO", width: "8%" },
            { id: "FECHA_FIN", dataIndex: "FECHA_FIN", text: "FECHA_FIN", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "DEUDOR", dataIndex: "DEUDOR", text: "DEUDOR", width: "8%" },
            { id: "OPERADOR", dataIndex: "OPERADOR", text: "OPERADOR", width: "8%" },
            { id: "FOLIOFACTURA_SAP", dataIndex: "FOLIOFACTURA_SAP", text: "FOLIOFACTURA_SAP", width: "8%" },
            { id: "FACTURADO_SIN_IMPUESTOS", dataIndex: "FACTURADO_SIN_IMPUESTOS", text: "FACTURADO_SIN_IMPUESTOS", width: "8%" },
            { id: "GRUPO", dataIndex: "GRUPO", text: "GRUPO", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "MXN", dataIndex: "MXN", text: "MXN", width: "8%" }
        ]
    });

    //SabanaROM

        var configSabana = Utils.defineModelStore({
        name: 'Sabana',
        paginadorText: "Sabana",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarSabana',
        modelFields: [
            { name: "Id", mapping: "Id" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "PLMN_GPO", mapping: "PLMN_GPO" },
            { name: "NOMBRE", mapping: "NOMBRE" },
            { name: "Acreedor", mapping: "Acreedor" },
            { name: "Sociedad_GL", mapping: "Sociedad_GL" },
            { name: "PROV_TARIFA", mapping: "PROV_TARIFA" },
            { name: "PROV_REAL_REG", mapping: "PROV_REAL_REG" },
            { name: "NUEVA_PROV_ACUM", mapping: "NUEVA_PROV_ACUM" },
            { name: "SUMA_TOTAL", mapping: "SUMA_TOTAL" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "PLMN_GPO", dataIndex: "PLMN_GPO", text: "PLMN_GPO", width: "8%" },
            { id: "NOMBRE", dataIndex: "NOMBRE", text: "NOMBRE", width: "8%" },
            { id: "Acreedor", dataIndex: "Acreedor", text: "Acreedor", width: "8%" },
            { id: "Sociedad_GL", dataIndex: "Sociedad_GL", text: "Sociedad_GL", width: "8%" },
            { id: "PROV_TARIFA", dataIndex: "PROV_TARIFA", text: "PROV_TARIFA", width: "8%" },
            { id: "PROV_REAL_REG", dataIndex: "PROV_REAL_REG", text: "PROV_REAL_REG", width: "8%" },
            { id: "NUEVA_PROV_ACUM", dataIndex: "NUEVA_PROV_ACUM", text: "NUEVA_PROV_ACUM", width: "8%" },
            { id: "SUMA_TOTAL", dataIndex: "SUMA_TOTAL", text: "SUMA_TOTAL", width: "8%" }
        ]
    });

    //DataIngresosROM

    var configDataIngresosROM = Utils.defineModelStore({
        name: 'DataIngresosROM',
        paginadorText: "DataIngresosROM",
        urlStore: '../' + VIRTUAL_DIRECTORY + 'CierreIngresosROM/ConsultarDataIngresosROM',
        modelFields: [
            { name: "Id", mapping: "Id"  },
            { name: "No_Provision" , mapping: "No_Provision" },
            { name: "PLMN", mapping: "PLMN" },
            { name: "Razon_Social", mapping: "Razon_Social" },
            { name: "No_Deudor_SAP", mapping: "No_Deudor_SAP" },
            { name: "Periodo", mapping: "Periodo" },
            { name: "Tipo_de_Registro", mapping: "Tipo_de_Registro" },
            { name: "Operacion", mapping: "Operacion" },
            { name: "Moneda", mapping: "Moneda" },
            { name: "TC", mapping: "TC" },
            { name: "Importe_MD", mapping: "Importe_MD" },
            { name: "Importe_MXN", mapping: "Importe_MXN" },
            { name: "Sociedad_GL", mapping: "Sociedad_GL" },
            { name: "real_confirmado", mapping: "real_confirmado" },
            { name: "cancelacion", mapping: "cancelacion" },
            { name: "Remanente_MD", mapping: "Remanente_MD" },
            { name: "Remanente_MXN", mapping: "Remanente_MXN" },
            { name: "Remanente_USD_revaluadotccierre" , mapping: "Remanente_USD_revaluadotccierre" },
            { name: "Dias", mapping: "Dias" },
            { name: "Cajon", mapping: "Cajon" },
            { name: "Plazo", mapping: "Plazo" },
            { name: "FECHA_DE_CIERRE", mapping: "FECHA_DE_CIERRE" },
            { name: "TC_CIERRE", mapping: "TC_CIERRE" }
        ],
        gridColumns: [
            { id: "Id", dataIndex: "Id", text: "Id", width: "8%" },
            { id: "No_Provision", dataIndex: "No_Provision", text: "No_Provision", width: "8%" },
            { id: "PLMN", dataIndex: "PLMN", text: "PLMN", width: "8%" },
            { id: "Razon_Social", dataIndex: "Razon_Social", text: "Razon_Social", width: "8%" },
            { id: "No_Deudor_SAP", dataIndex: "No_Deudor_SAP", text: "No_Deudor_SAP", width: "8%" },
            { id: "Periodo", dataIndex: "Periodo", text: "Periodo", width: "8%" },
            { id: "Tipo_de_Registro", dataIndex: "Tipo_de_Registro", text: "Tipo_de_Registro", width: "8%" },
            { id: "Operacion", dataIndex: "Operacion", text: "Operacion", width: "8%" },
            { id: "Moneda", dataIndex: "Moneda", text: "Moneda", width: "8%" },
            { id: "TC", dataIndex: "TC", text: "TC", width: "8%" },
            { id: "Importe_MD", dataIndex: "Importe_MD", text: "Importe_MD", width: "8%" },
            { id: "Importe_MXN", dataIndex: "Importe_MXN", text: "Importe_MXN", width: "8%" },
            { id: "Sociedad_GL", dataIndex: "Sociedad_GL", text: "Sociedad_GL", width: "8%" },
            { id: "real_confirmado", dataIndex: "real_confirmado", text: "real_confirmado", width: "8%" },
            { id: "cancelacion", dataIndex: "cancelacion", text: "cancelacion", width: "8%" },
            { id: "Remanente_MD", dataIndex: "Remanente_MD", text: "Remanente_MD", width: "8%" },
            { id: "Remanente_MXN", dataIndex: "Remanente_MXN", text: "Remanente_MXN", width: "8%" },
            { id: "Remanente_USD_revaluadotccierre", dataIndex: "Remanente_USD_revaluadotccierre", text: "Remanente_USD_revaluadotccierre", width: "8%" },
            { id: "Dias", dataIndex: "Dias", text: "Dias", width: "8%" },
            { id: "Cajon", dataIndex: "Cajon", text: "Cajon", width: "8%" },
            { id: "Plazo", dataIndex: "Plazo", text: "Plazo", width: "8%" },
            { id: "FECHA_DE_CIERRE", dataIndex: "FECHA_DE_CIERRE", text: "FECHA_DE_CIERRE", width: "8%" },
            { id: "TC_CIERRE", dataIndex: "TC_CIERRE", text: "TC_CIERRE", width: "8%" }
        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px;'>Cierre Ingresos Roaming</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            //Aqui Van Los Botones 
            {
                xtype: 'button',
                html: "<button class='btn btn-primary' style='outline:none;'>Buscar</button>",
                id: 'btnResultados3',
                margin: '0 30 -38 160',
                border: false,
                handler: function () {
                    var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;
                    if (periodo == null) {
                        Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                        return;
                    }

                    store_BuscarIngreso.getProxy().extraParams.Periodo = periodo;
                    store_BuscarIngreso.load();

                    store_BuscarCPI.getProxy().extraParams.Periodo = periodo;
                    store_BuscarCPI.load();

                    store_BuscarCPT.getProxy().extraParams.Periodo = periodo;
                    store_BuscarCPT.load();

                    store_BuscarIngresoRoadming.getProxy().extraParams.Periodo = periodo;
                    store_BuscarIngresoRoadming.load();

                    store_BuscarCancelProvicion.getProxy().extraParams.Periodo = periodo;
                    store_BuscarCancelProvicion.load();

                },
            },
            {
                xtype: 'button',
                html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                id: 'btnExportarFluctuacion',
                margin: '0 30 -40 250',
                border: false,
                handler: function () {
                    var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                    if (periodo == null) {
                        Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                        return;
                    }

                    Ext.Ajax.request({
                        timeout: 3600000,
                        url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/ExportarFluctuacion',
                        params:
                        {
                            Periodo: periodo
                        },
                        success: function (response) {
                            var result = Ext.decode(response.responseText);
                            if (result.Success) {
                                var disposition = response.getResponseHeader('Content-Disposition');
                                var bytes = new Uint8Array(result.bytes);
                                var blob = new Blob([bytes], { type: 'application/xls' });
                                var URL = window.URL || window.webkitURL;
                                var downloadUrl = URL.createObjectURL(blob);
                                var a = document.createElement("a");
                                a.href = downloadUrl;
                                a.download = result.responseText;
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                            }
                            else {
                                Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                            }
                        },
                        failure: function (response, opts) {
                            mask.hide();
                            var result = Ext.decode(response.responseText);
                            Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                        }
                    });
                },
            },
            {
                columnWidth: 0.15,
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                items: [
                    {
                        html: 'Buscar Periodo',
                        margin: '0 0 0 5',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false
                    },
                    {
                        xtype: 'combobox',
                        name: 'cmbPeriodoMDocumento',
                        id: 'cmbPeriodoMDocumento',
                        anchor: '100%',
                        margin: '5 5 5 5',
                        queryMode: 'local',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        editable: false,
                        msgTarget: 'under',
                        store: storeLlenaPeriodo,
                        tpl: Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<div class="x-boundlist-item">{Fecha}</div>',
                            '</tpl>'
                        ),
                        displayTpl: Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '{Fecha}',
                            '</tpl>'
                        ),
                        valueField: 'Periodo'
                    }
                ]
            },
            //Inicia El Container
            {
                xtype: 'tabpanel',
                id:'tabpanel1',
                width: '100%',
                margin: '3 0 0 0', 
                height: 320,
                renderTo: Ext.getBody(),
                items:
                    [
                        {
                            xtype: 'panelcustom',
                            title: 'Ingreso',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'ingresoGrid',
                                    store: configIngresos.store.source,
                                    bbar: configIngresos.paginador.paginadorHandler,
                                    columns: configIngresos.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'DevAcumTraficoIngresoROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'DevAcumTraficoIngresoROMGrid',
                                    store: configDevAcumTraficoIngresoROM.store.source,
                                    bbar: configDevAcumTraficoIngresoROM.paginador.paginadorHandler,
                                    columns: configDevAcumTraficoIngresoROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'CancelacionProvTraficoIngresoROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'provTarAcumMesesAnteROM',
                                    store: configProvTarAcumMesesAnteROM.store.source,
                                    bbar: configProvTarAcumMesesAnteROM.paginador.paginadorHandler,
                                    columns: configProvTarAcumMesesAnteROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'PROVTARIFA_MesAnteriorROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'PROVTARIFA_MesAnteriorROM',
                                    store: configPROVTARIFA_MesAnteriorROM.store.source,
                                    bbar: configPROVTARIFA_MesAnteriorROM.paginador.paginadorHandler,
                                    columns: configPROVTARIFA_MesAnteriorROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'AjusNcRealVsDevROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'AjusNcRealVsDevROM',
                                    store: configAjusNcRealVsDevROM.store.source,
                                    bbar: configAjusNcRealVsDevROM.paginador.paginadorHandler,
                                    columns: configAjusNcRealVsDevROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'CancProvTarPerAnteROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'CancProvTarPerAnteROM',
                                    store: configCancProvTarPerAnteROM.store.source,
                                    bbar: configCancProvTarPerAnteROM.paginador.paginadorHandler,
                                    columns: configCancProvTarPerAnteROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'ProvTarAcumMesesAnteROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'ProvTarAcumMesesAnteROM',
                                    store: configProvTarAcumMesesAnteROM.store.source,
                                    bbar: configProvTarAcumMesesAnteROM.paginador.paginadorHandler,
                                    columns: configProvTarAcumMesesAnteROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'FacturaTraficoROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'FacturaTraficoROM',
                                    store: configFacturaTraficoROM.store.source,
                                    bbar: configFacturaTraficoROM.paginador.paginadorHandler,
                                    columns: configFacturaTraficoROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'FacturaTarifaROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'FacturaTarifaROM',
                                    store: configFacturaTarifaROM.store.source,
                                    bbar: configFacturaTarifaROM.paginador.paginadorHandler,
                                    columns: configFacturaTarifaROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'NCTraficoROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'NCTraficoROM',
                                    store: configNCTraficoROM.store.source,
                                    bbar: configNCTraficoROM.paginador.paginadorHandler,
                                    columns: configNCTraficoROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'NCTarifaROM',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'NCTarifaROM',
                                    store: configNCTarifaROM.store.source,
                                    bbar: configNCTarifaROM.paginador.paginadorHandler,
                                    columns: configNCTarifaROM.view.columns
                                }
                            ]
                        },
                        {
                            xtype: 'panelcustom',
                            title: 'Sabana',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'sabanaGrid',
                                    store: configSabana.store.source,
                                    bbar: configSabana.paginador.paginadorHandler,
                                    columns: configSabana.view.columns
                                }
                            ]
                        },
                        //{
                        //    xtype: 'panelcustom',
                        //    title: 'CancelacionProvROM',
                        //    items: [
                        //        {
                        //            xtype: 'gridpanelcustom',
                        //            id: 'CancelacionProvROM',
                        //            store: configCancelacionProvROM.store.source,
                        //            bbar: configCancelacionProvROM.paginador.paginadorHandler,
                        //            columns: configCancelacionProvROM.view.columns
                        //        }
                        //    ]
                        //},
                        {
                            xtype: 'panelcustom',
                            title: 'Base Datos Ingreso',
                            items: [
                                {
                                    xtype: 'gridpanelcustom',
                                    id: 'DataIngresosROM',
                                    store: configDataIngresosROM.store.source,
                                    bbar: configDataIngresosROM.paginador.paginadorHandler,
                                    columns: configDataIngresosROM.view.columns
                                }
                            ]
                        }
                    ]
            }
        ],
        bodyStyle: { "background-color": "#E6E6E6" },
        renderTo: Body
    });

    //var tabPanelInner = panel.query("#tabpanel1")[0];
    //var idNumber = 1;
    //configList.forEach(config => {
    //    config.title = "panel1";
    //    config.idNumber = idNumber;
    //    idNumber += 1;
    //    tabPanelInner.items.add(Utils.createPanel(config));
    //});

    //tabPanelInner.doLayout();
    
    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });
}) //Termina funcion inicial
