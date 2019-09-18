/* Nombre: DevengoIngresosROM.js  
* Creado por: Pedro Santiago
* Fecha de Creación: 15/Agosto/2019
* Descripcion: JS de Reportes Devengo Ingreso ROM
*/

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;
    var store;

    Ext.define('model_LlenaPeriodo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'Fecha', mapping: 'Fecha' }
            ]
        });

    Ext.define('model_BuscarDevengoIngreso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Fecha', mapping: 'Fecha' },
                { name: 'PPTO', mapping: 'PPTO' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'DevengoTrafico', mapping: 'DevengoTrafico' },
                { name: 'CostosRecurrentes', mapping: 'CostosRecurrentes' },
                { name: 'DevengoTotal', mapping: 'DevengoTotal' },
                { name: 'ProvisionTarifa', mapping: 'ProvisionTarifa' },
                { name: 'AjusteRealDevengoFac', mapping: 'AjusteRealDevengoFac' },
                { name: 'AjusteRealDevengoTarifa', mapping: 'AjusteRealDevengoTarifa' },
                { name: 'AjustesExtraordinarios', mapping: 'AjustesExtraordinarios' },
                { name: 'ImporteNeto', mapping: 'ImporteNeto' },
                { name: 'DevengoPPTO', mapping: 'DevengoPPTO' }
            ]
        });

    Ext.define('model_BuscarFluctuacionCambiariaLDI',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'cuentaContable', mapping: 'cuentaContable' },
                { name: 'nombreGrupo', mapping: 'nombreGrupo' },
                { name: 'nombreDeudorSAP', mapping: 'nombreDeudorSAP' },
                { name: 'codigoDeudor', mapping: 'codigoDeudor' },
                { name: 'sociedadGL', mapping: 'sociedadGL' },
                { name: 'fecha_contable', mapping: 'fecha_contable' },
                { name: 'claseDocumento', mapping: 'claseDocumento' },
                { name: 'sentido', mapping: 'sentido' },
                { name: 'factura', mapping: 'factura' },
                { name: 'num_Documento_PF', mapping: 'num_Documento_PF' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'TC_Provision', mapping: 'TC_Provision' },
                { name: 'TC_Cierre', mapping: 'TC_Cierre' },
                { name: 'TC_Facturado', mapping: 'TC_Facturado' },
                { name: 'importe_Provision', mapping: 'importe_Provision' },
                { name: 'importe_Provision_MXN', mapping: 'importe_Provision_MXN' },
                { name: 'importe_Revaluado', mapping: 'importe_Revaluado' },
                { name: 'importe_Facturado', mapping: 'importe_Facturado' },
                { name: 'imp_Fac_Sop_Provision', mapping: 'imp_Fac_Sop_Provision' },
                { name: 'facturado_MXN', mapping: 'facturado_MXN' },
                { name: 'variacion_MXN', mapping: 'variacion_MXN' },
                { name: 'efecto_Operativo', mapping: 'efecto_Operativo' },
                { name: 'fluctuacion_Cambiaria', mapping: 'fluctuacion_Cambiaria' },
                { name: 'estatus', mapping: 'estatus' },
                { name: 'cuenta_Fluctuacion', mapping: 'cuenta_Fluctuacion' },
                { name: 'totalImporteProvision', mapping: 'totalImporteProvision' },
                { name: 'totalImporteProvisionMXN', mapping: 'totalImporteProvisionMXN' },
                { name: 'totalImporteRevaluado', mapping: 'totalImporteRevaluado' },
                { name: 'totalImporteFacturado', mapping: 'totalImporteFacturado' },
                { name: 'totalImpFacSopProvision', mapping: 'totalImpFacSopProvision' },
                { name: 'totalFacturadoMXN', mapping: 'totalFacturadoMXN' },
                { name: 'totalVariacionMXN', mapping: 'totalVariacionMXN' },
                { name: 'totalEfectoOperativo', mapping: 'totalEfectoOperativo' },
                { name: 'totalFluctuacionCambiaria', mapping: 'totalFluctuacionCambiaria' }
            ]
        });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenaPeriodo?lineaNegocio=' + 1,
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
    var store_BuscarDevengoIngresoUSD = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDevengoIngreso',
        storeId: 'idstore_buscarDevengoIngreso',
        groupField: 'Moneda',
        pageSize: 20,
        
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenaGridDevengoIngreso',
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
    var store_Ajustes = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDevengoIngreso',
        storeId: 'idstore_buscarAjustes',
        groupField: 'Moneda',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenaGridDevengoIngreso',
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
    var store_Fluctuacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarDevengoIngreso',
        storeId: 'idstore_buscarFluctuacion',
        groupField: 'Moneda',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/LlenaGridDevengoIngreso',
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

    var pagSize = Ext.create('Ext.data.Store', {
        fields: ['id', 'size'],
        data: [
            { "id": "1", "size": "5" },
            { "id": "2", "size": "10" },
            { "id": "3", "size": "20" },
            { "id": "4", "size": "30" },
            { "id": "5", "size": "40" }
        ]
    });

    var store_BuscarFluctuacionCambiariaLDI = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacionCambiariaLDI',
        storeId: 'idstore_buscarFluctuacionCambiariaLDI',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQDevengoLDI/LlenarGridFluctuacion',
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

    var paginadorDevengoIngreso = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarDevengoIngresoUSD,
        displayInfo: true,
        displayMsg: "Devengo Ingresos ROM",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 20 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarDevengoIngresoUSD.pageSize = cuenta;
                        store_BuscarDevengoIngresoUSD.load();
                    }

                }
            },
            {
                xtype: 'textareafield',
                name: 'totales',
                fieldLabel: 'Totales'
            }
        ]
    });
    var paginadorAjustes = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarDevengoIngresoUSD,
        displayInfo: true,
        displayMsg: "Devengo Ingresos ROM",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 20 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarDevengoIngresoUSD.pageSize = cuenta;
                        store_BuscarDevengoIngresoUSD.load();
                    }

                }
            },
            {
                xtype: 'textareafield',
                name: 'totales',
                fieldLabel: 'Totales'
            }
        ]
    });
    var paginadorFluctuacion = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarDevengoIngresoUSD,
        displayInfo: true,
        displayMsg: "Devengo Ingresos ROM",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 20 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarDevengoIngresoUSD.pageSize = cuenta;
                        store_BuscarDevengoIngresoUSD.load();
                    }

                }
            },
            {
                xtype: 'textareafield',
                name: 'totales',
                fieldLabel: 'Totales'
            }
        ]
    });

    var store_BuscarTotalesFluctuacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacionCambiariaLDI',
        storeId: 'idstore_buscarFluctuacionCambiariaLDI',
        autoLoad: true,
        pageSize: 1,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'PXQDevengoLDI/LlenarGridFluctuacion',
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

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 0',
        width: "100%",
        height: '100%',
        layout: { type: 'vbox', align: 'stretch' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Devengo ROM</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '100%',
            },
            {
                bodyStyle: { "background-color": "#E6E6E6" },
                border: false,
                items: [
                    {
                        xtype: 'panel',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        width: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'combobox',
                                name: 'cmbPeriodo',
                                id: 'cmbPeriodo',
                                fieldLabel: 'Mes Devengo',
                                margin: '5 5 5 5',
                                queryMode: 'local',
                                bodyStyle: { "background-color": "#E6E6E6" },
                                border: false,
                                editable: false,
                                msgTarget: 'under',
                                store: storeLlenaPeriodo,
                                listeners: {
                                    select: function () {
                                        var periodo = Ext.getCmp('cmbPeriodo').value;
                                        
                                        Ext.Ajax.request({
                                            timeout: 3600000,
                                            url: '../' + VIRTUAL_DIRECTORY + 'DevengoIngresosROM/TipoCambio',
                                            params: {
                                                Periodo: periodo
                                            },
                                            success: function (response) {

                                                var result = Ext.decode(response.responseText);
                                                if (result.Success) {
                                                    var disposition = response.getResponseHeader('Content-Disposition');
                                                    var a = Ext.getCmp('txtTC');
                                                    a.setValue(result.results);
                                                }
                                                else {
                                                    Ext.Msg.alert('Tipo de Cambio', 'Error Internal Server', Ext.emptyFn);
                                                }
                                            },
                                            failure: function (response, opts) {
                                                mask.hide();
                                                var result = Ext.decode(response.responseText);
                                                Ext.Msg.alert('Tipo de Cambio', 'Error Internal Server', Ext.emptyFn);
                                            }
                                        });
                                    }
                                },
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
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtTC',
                                id: 'txtTC',
                                margin: '5 5 5 5',
                                fieldLabel: 'TC Devengo',
                                disabled: true
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        width: "100%",
                        height: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'txtPPTOI',
                                id: 'txtPPTOI',
                                margin: '5 5 5 5',
                                fieldLabel: 'PPTO Ingreso MXN',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtPPTOC',
                                id: 'txtPPTOC',
                                margin: '5 5 5 5',
                                fieldLabel: 'PPTO Costo MXN',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        width: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'txtPPTOIUSD',
                                id: 'txtPPTOIUSD',
                                margin: '5 5 5 5',
                                fieldLabel: 'PPTO Ingreso USD',
                                allowBlank: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtPPTOCUSD',
                                id: 'txtPPTOCUSD',
                                margin: '5 5 5 5',
                                fieldLabel: 'PPTO Costo USD',
                                allowBlank: false
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        bodyStyle: { "background-color": "#E6E6E6" },
                        border: false,
                        width: '100%',
                        layout: 'column',
                        items: [
                            {
                                xtype: 'button',
                                html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                                id: 'btnResultados',
                                margin: '10 0 0 0',
                                handler: function () {
                                    //var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                                    //if (periodo == null) {
                                    //    Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                    //    return;
                                    //}
                                    var pptoI = Ext.getCmp("txtPPTOI").value;
                                    var pptoC = Ext.getCmp('txtPPTOC').value;
                                    var tipCambio = Ext.getCmp('txtTC').value;
                                    if (pptoI == null) {
                                        Ext.Msg.alert('Validaciones del Sistema', 'Debe ingresar un valor para PPTO Ingreso', Ext.emptyFn);
                                        return;
                                    } else if (pptoC == null)
                                    {
                                        Ext.Msg.alert('Validaciones del Sistema', 'Debe ingresar un valor para PPTO Costo', Ext.emptyFn);
                                        return;
                                    }
                                    var strpptoI = Ext.util.Format.number(pptoI);
                                    var strpptoC = Ext.util.Format.number(pptoC);
                                    if (strpptoC > strpptoI)
                                    {
                                        Ext.getCmp("txtPPTOI").setValue('');
                                        Ext.getCmp("txtPPTOC").setValue('');
                                        Ext.Msg.alert('Validaciones del Sistema', 'El PPPTO Ingreso debe ser mayor al PPTO Costo', Ext.emptyFn);
                                        return;
                                    }
                                    var store = Ext.StoreManager.lookup('idstore_buscarDevengoIngreso');
                                    store.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodo').value;
                                    store.getProxy().extraParams.PPTOI = pptoI;
                                    store.getProxy().extraParams.PPTOC = pptoC;
                                    store.getProxy().extraParams.tipoCambio = tipCambio;
                                    store.load();
                                },
                            },
                            {
                                xtype: 'button',
                                html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                id: 'btnExportar',
                                margin: '10 0 0 0',
                                handler: function () {
                                    var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                                    if (periodo == null) {
                                        Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                        return;
                                    }
                                    Ext.Ajax.request({
                                        timeout: 3600000,
                                        url: '../' + VIRTUAL_DIRECTORY + 'PXQDevengoLDI/ExportMD',
                                        params: {
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
                                                Ext.Msg.alert('Exportar Excel', 'Se ha exportado correctamente el reporte', Ext.emptyMsg);
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
                                html: '<div id="container"></div>'
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 500,
                renderTo: Ext.getBody(),
                items: [
                    {
                        title: 'Devengo',
                        border: false,
                        closable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                id: 'grp_DevengoIngresoUSD',
                                flex: 1,
                                store: store_BuscarDevengoIngresoUSD,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginadorDevengoIngreso,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: '{name}',
                                    startCollapsed: true,
                                    
                                }],
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', text: "Sentido", width: "14%",
                                        summaryRenderer: function () {
                                            return '<span style="font-weight:bold;">OIBDA </span>';
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'Sentido',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'PPTO', text: "PPTO", width: "14%",
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'Sentido',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'DevengoTrafico', text: "Devengo Trafico", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'DevengoTrafico',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'CostosRecurrentes', text: "Costos Recurrentes", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'CostosRecurrentes',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'DevengoTotal', text: "Devengo Total", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'DevengoTotal',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ProvisionTarifa', text: "Provision Tarifa", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'ProvisionTarifa',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteRealDevengoFac', text: "Ajuste Real Vs Devengo Factura", width: "15%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'AjusteRealDevengoFac',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteRealDevengoTarifa', text: "Ajuste Real Vs Devengo Tarifa", width: "15%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'AjusteRealDevengoTarifa',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjustesExtraordinarios', text: "Ajustes Extraordinarios", width: "15%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'AjustesExtraordinarios',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'ImporteNeto', text: "Importe Neto", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'ImporteNeto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'DevengoPPTO', text: "Devengo PPTO", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    store_BuscarDevengoIngresoUSD.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarDevengoIngresoUSD.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarDevengoIngresoUSD.filter({
                                                            property: 'DevengoPPTO',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarDevengoIngresoUSD.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Ajustes',
                        border: false,
                        closable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                id: 'grp_Ajustes',
                                flex: 1,
                                store: store_Ajustes,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginadorAjustes,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: 'Devengo Ingreso({name})',
                                    startCollapsed: true
                                }],
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'Sentido', text: "Sentido", width: "14%",

                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'Sentido',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'ImporteDevengoCierreMD', text: "Importe devengo cierre mes anterior MD", width: "14%",

                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'ImporteDevengoCierreMD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'TCCierre', text: "T.C (cierre)", width: "14%",

                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'TCCierre',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'ImporteDevengoCierreMXN', text: "Importe devengo cierre MXN", width: "14%",

                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'ImporteDevengoCierreMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'RealFactUSD', text: "Real Fact (USD)", width: "14%",

                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'RealFactUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'TCSAP', text: "T.C (SAP)", width: "14%",

                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'TCSAP',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'RealFactMXN', text: "Real Fact (MXN)", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'RealFactMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteUSD', text: "Ajuste (USD)", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'AjusteUSD',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', sortable: true, dataIndex: 'AjusteMXN', text: "Ajuste (MXN)", width: "13%", align: 'center',
                                        summaryType: 'sum', renderer: Ext.util.Format.usMoney,
                                        summaryRenderer: function (value, summaryData, dataIndex) {
                                            var pct = Ext.util.Format.number(value, "0,000.00");
                                            return '<span style="font-weight:bold;">$ ' + pct + "</span>";
                                        },
                                        editor: {
                                            xtype: 'textfield'
                                        },
                                        items:
                                        {
                                            xtype: 'textfield',
                                            flex: 1,
                                            margin: 2,
                                            enableKeyEvents: true,
                                            listeners:
                                            {
                                                keyup: function () {
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_Ajustes.load({ params: { start: 0, limit: 100000 } });
                                                        store_Ajustes.filter({
                                                            property: 'AjusteMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_Ajustes.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: 'Fluctuacion',
                        border: false,
                        closable: true,
                        items: [
                            {
                                xtype: 'gridpanel',
                                id: 'grp_Fluctuacion',
                                flex: 1,
                                store: store_Fluctuacion,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: paginadorFluctuacion,
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                features: [{
                                    ftype: 'groupingsummary',
                                    groupHeaderTpl: 'Devengo Ingreso({name})',
                                    startCollapsed: true
                                }],
                                columns: [
                                    
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        bodyStyle: { "background-color": "#E6E6E6" },
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 290);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 250);
        panel.doComponentLayout();
    });

}) //Termina funcion inicial
