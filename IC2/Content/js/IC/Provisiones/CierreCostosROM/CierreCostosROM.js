
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

    Ext.define('model_BuscarReportesDevengo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'CuentaPiv', mapping: 'CuentaPiv' },
                { name: 'CuentaResultados', mapping: 'CuentaResultados' },
                { name: 'CentroCostos', mapping: 'CentroCostos' },
                { name: 'AreaFuncional', mapping: 'AreaFuncional' },
                { name: 'Servicio', mapping: 'Servicio' },
                { name: 'Acreedor', mapping: 'Acreedor' },
                { name: 'SoGL', mapping: 'SoGL' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'NombreCorto', mapping: 'NombreCorto' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'FechaConsumo', mapping: 'FechaConsumo' },
                { name: 'FechaSolicitud', mapping: 'FechaSolicitud' },
                { name: 'TipoCambio', mapping: 'TipoCambio' },
                { name: 'CancelacionProvision', mapping: 'CancelacionProvision' },
                { name: 'CancelacionprovisionNCR', mapping: 'CancelacionprovisionNCR' },
                { name: 'Facturacion', mapping: 'Facturacion' },
                { name: 'NCREmitidas', mapping: 'NCREmitidas' },
                { name: 'Provision', mapping: 'Provision' },
                { name: 'ProvisionNCR', mapping: 'ProvisionNCR' },
                { name: 'Exceso', mapping: 'Exceso' },
                { name: 'TotalDevengo', mapping: 'TotalDevengo' }
            ]
        });

    Ext.define('model_BuscarFluctuacionCambiariaLDI',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'cuentaContable', mapping: 'cuentaContable' },
                { name: 'grupo', mapping: 'grupo' },
                { name: 'nombreAcreedor', mapping: 'nombreAcreedor' },
                { name: 'acreedor', mapping: 'acreedor' },
                { name: 'servicio', mapping: 'servicio' },
                { name: 'sociedadGL', mapping: 'sociedadGL' },
                { name: 'periodo', mapping: 'periodo' },
                { name: 'claseDocumento', mapping: 'claseDocumento' },
                { name: 'sentido', mapping: 'sentido' },
                { name: 'factura', mapping: 'factura' },
                { name: 'numDocumentoPF', mapping: 'numDocumentoPF' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'tcProvision', mapping: 'tcProvision' },
                { name: 'tcCierre', mapping: 'tcCierre' },
                { name: 'tcFacturado', mapping: 'tcFacturado' },
                { name: 'importeProvision', mapping: 'importeProvision' },
                { name: 'importeProvisionMXN', mapping: 'importeProvisionMXN' },
                { name: 'importeRevaluado', mapping: 'importeRevaluado' },
                { name: 'importeFacturado', mapping: 'importeFacturado' },
                { name: 'impFacSopProvision', mapping: 'impFacSopProvision' },
                { name: 'facturadoMXN', mapping: 'facturadoMXN' },
                { name: 'variacionMXN', mapping: 'variacionMXN' },
                { name: 'efectoOperativo', mapping: 'efectoOperativo' },
                { name: 'fluctuacionCambiaria', mapping: 'fluctuacionCambiaria' },
                { name: 'estatus', mapping: 'estatus' },
                { name: 'cuentaFluctuacion', mapping: 'cuentaFluctuacion' },
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

    var store_BuscarReportesDevengoDocumento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarReportesDevengo',
        storeId: 'idstore_buscarReportesDevengoDocumento',
        groupField: 'CuentaPiv',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/LlenaGridDocumento',
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
    var store_BuscarReportesDevengoLocal = Ext.create('Ext.data.Store', {
        model: 'model_BuscarReportesDevengo',
        storeId: 'idstore_buscarReportesDevengo',
        groupField: 'CuentaPiv',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/LlenaGridLocal',
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

    var store_seleccionarReportesDevengo = Ext.create('Ext.data.Store', {
        model: 'model_BuscarReportesDevengo',
        storeId: 'idstore_seleccionarReportesDevengo',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/BuscarReportesDevengo',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var store_ExportReportesDevengoDocumento = Ext.create('Ext.data.Store', {
        model: 'model_BuscarReportesDevengo',
        storeId: 'idstore_ExportReportesDevengoDocumento',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/ExportMD',
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
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/LlenarGridFluctuacion',
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

    var store_BuscarTotalesFluctuacion = Ext.create('Ext.data.Store', {
        model: 'model_BuscarFluctuacionCambiariaLDI',
        storeId: 'idstore_buscarFluctuacionCambiariaLDI',
        pageSize: 1,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/LlenarGridFluctuacion',
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

    var paginador = new Ext.PagingToolbar({
        id: 'paginador',
        store: store_BuscarFluctuacionCambiariaLDI,
        displayInfo: true,
        displayMsg: "Flucctuación Cambiaria Costos",
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: '15%',
                margin: '0 0 30 0',
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarFluctuacionCambiariaLDI.pageSize = cuenta;
                        store_BuscarFluctuacionCambiariaLDI.load();
                    }

                }
            },
            //{
            //    xtype: 'textareafield',
            //    name: 'totales',
            //    fieldLabel: 'Totales'
            //}
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
                html: "<div style='font-size:25px';>Cierre Costos Roaming</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            //Aqui Van Los Botones 
            {
                xtype: 'button',
                html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                id: 'btnResultados3',
                margin: '0 30 -38 160',
                border: false,
                handler: function () {
                    var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                    if (periodo == null) {
                        Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                        return;
                    }

                    var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;
                    store_BuscarFluctuacionCambiariaLDI.getProxy().extraParams.Periodo = periodo;
                    store_BuscarFluctuacionCambiariaLDI.load();

                    store_BuscarTotalesFluctuacion.getProxy().extraParams.Periodo = periodo;
                    store_BuscarTotalesFluctuacion.load();
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
                width: '100%',
                margin: '3 0 0 0',
                height: 320,
                renderTo: Ext.getBody(),
                items:
                    [

                        //Inicia una Pestaña
                        {
                            title: 'COSTOS',
                            border: false,
                            closable: true,
                            items: [
                                {
                                    xtype: 'panel',
                                    bodyStyle: { "background-color": "#E6E6E6" },
                                    border: false,
                                    width: '100%',
                                    layout: 'column'
                                    //items: [
                                    //{
                                    //   xtype: 'button',
                                    //    html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                                    //    id: 'btnResultados3',
                                    //    margin: '10 0 0 0',
                                    //    border: false,
                                    //    handler: function () {
                                    //        var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                                    //        if (periodo == null) {
                                    //            Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                    //            return;
                                    //        }

                                    //        var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;
                                    //        store_BuscarFluctuacionCambiariaLDI.getProxy().extraParams.Periodo = periodo;
                                    //        store_BuscarFluctuacionCambiariaLDI.load();

                                    //        store_BuscarTotalesFluctuacion.getProxy().extraParams.Periodo = periodo;
                                    //        store_BuscarTotalesFluctuacion.load();
                                    //    },
                                    //},
                                    //{
                                    //    xtype: 'button',
                                    //    html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                    //    id: 'btnExportarFluctuacion',
                                    //    margin: '10 50 0 0',
                                    //    border: false,
                                    //    handler: function () {
                                    //        var periodo = Ext.getCmp('cmbPeriodoMDocumento').value;

                                    //        if (periodo == null) {
                                    //            Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                    //            return;
                                    //        }

                                    //        Ext.Ajax.request({
                                    //            timeout: 3600000,
                                    //            url: '../' + VIRTUAL_DIRECTORY + 'ReportesDevengo/ExportarFluctuacion',
                                    //            params:
                                    //            {
                                    //                Periodo: periodo
                                    //            },
                                    //            success: function (response) {
                                    //                var result = Ext.decode(response.responseText);
                                    //                if (result.Success) {
                                    //                    var disposition = response.getResponseHeader('Content-Disposition');
                                    //                    var bytes = new Uint8Array(result.bytes);
                                    //                    var blob = new Blob([bytes], { type: 'application/xls' });
                                    //                    var URL = window.URL || window.webkitURL;
                                    //                    var downloadUrl = URL.createObjectURL(blob);
                                    //                    var a = document.createElement("a");
                                    //                    a.href = downloadUrl;
                                    //                    a.download = result.responseText;
                                    //                    document.body.appendChild(a);
                                    //                    a.click();
                                    //                    setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                                    //                }
                                    //                else {
                                    //                    Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                                    //                }
                                    //            },
                                    //            failure: function (response, opts) {
                                    //                mask.hide();
                                    //                var result = Ext.decode(response.responseText);
                                    //                Ext.Msg.alert('Exportar Excel', 'Error Internal Server', Ext.emptyFn);
                                    //            }
                                    //        });
                                    //    },
                                    //},
                                    //    {
                                    //        html: '<div id="container"></div>'
                                    //    }
                                    //]
                                },
                                {
                                    xtype: 'gridpanel',
                                    id: 'grdFluctuacionCambiariaLDI',
                                    flex: 1,
                                    width: '100%',
                                    height: 300,
                                    columnLines: true,
                                    store: store_BuscarFluctuacionCambiariaLDI,
                                    pagesize: 1,
                                    scrollable: true,
                                    bbar: paginador,
                                    selectable: {
                                        columns: false,
                                        extensible: true
                                    },
                                    columns: [
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "cuentaContable", dataIndex: 'cuentaContabe', text: "Cuenta Contable", width: "8%",
                                            renderer: function (v, cellValues, rec) {
                                                return rec.get('cuentaContable');
                                            },
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "grupo", dataIndex: 'grupo', text: "Grupo", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "nombreAcreedor", dataIndex: 'nombreAcreedor', text: "Nombre Acreedor", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "acreedor", dataIndex: 'acreedor', text: "Acreedor", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "servicio", dataIndex: 'servicio', text: "Servicio", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "sociedadGL", dataIndex: 'sociedadGL', text: "Sociedad GL", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "periodo", dataIndex: 'periodo', text: "Periodo", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "claseDocumento", dataIndex: 'claseDocumento', text: "Tipo Documento", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "sentido", dataIndex: 'sentido', text: "Tipo de Registro", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "factura", dataIndex: 'factura', text: "Documento", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "numDocumentoPF", dataIndex: 'numDocumentoPF', text: "No. Documento", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: "moneda", dataIndex: 'moneda', text: "Moneda", width: "8%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'tcProvision', dataIndex: 'tcProvision', text: "T.C Provisión", width: "10%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'tcCierre', dataIndex: 'tcCierre', text: "T.C. Cierre", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'tcFacturado', dataIndex: 'tcFacturado', text: "T.C. Facurado", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'importeProvision', dataIndex: 'importeProvision', text: "Importe Provisión", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", format: '0,000.00', sortable: true, id: 'importeProvisionMXN', dataIndex: 'importeProvisionMXN', text: "Importe Provisión en Pesos", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'importeRevaluado', dataIndex: 'importeRevaluado', text: "Importe Revaluado", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'importeFacturado', dataIndex: 'importeFacturado', text: "Importe Facturado", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'impFacSopProvision', dataIndex: 'impFacSopProvision', text: "Importe Facturado Soportado Por Provision", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'facturadoMXN', dataIndex: 'facturadoMXN', text: "Facturado MXN", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'variacionMXN', dataIndex: 'variacionMXN', text: "Variacion en MXN", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'efectoOperativo', dataIndex: 'efectoOperativo', text: "Efecto Operativo", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'fluctuacionCambiaria', dataIndex: 'fluctuacionCambiaria', text: "Fluctuación Cambiaria", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'estatus', dataIndex: 'estatus', text: "Estatus", width: "14%",
                                        },
                                        {
                                            xtype: "gridcolumn", sortable: true, id: 'cuentaFluctuacion', dataIndex: 'cuentaFluctuacion', text: "Cuenta Fluctuación", width: "14%",
                                        }
                                    ]

                                }

                            ]
                        }
                        //Inicia una Pestaña

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