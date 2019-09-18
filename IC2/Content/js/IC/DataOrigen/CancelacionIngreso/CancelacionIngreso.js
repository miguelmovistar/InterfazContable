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

    Ext.define('model_BuscarCancelacionIngreso',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'operador', mapping: 'operador' },
                { name: 'concepto', mapping: 'concepto' },
                { name: 'grupo', mapping: 'grupo' },
                { name: 'deudor', mapping: 'grupo' },
                { name: 'montoProvision', mapping: 'montoProvision' },
                { name: 'moneda', mapping: 'moneda' },
                { name: 'Periodo', mapping: 'Periodo' },
                { name: 'tipo', mapping: 'tipo' },
                { name: 'noDocumento', mapping: 'noDocumento' },
                { name: 'folioDocumento', mapping: 'folioDocumento' },
                { name: 'tcProvision', mapping: 'tcProvision' },
                { name: 'importeMXN', mapping: 'importeMXN' },
            ]
        });

    var storeLlenaPeriodo = Ext.create('Ext.data.Store', {
        model: 'model_LlenaPeriodo',
        storeId: 'idstore_LlenaPeriodo',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CancelacionIngreso/LlenaPeriodo?lineaNegocio=' + 2,
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

    var store_BuscarCancelacionIngreso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCancelacionIngreso',
        storeId: 'idstore_buscarCancelacionIngreso',
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CancelacionIngreso/LlenaGrid',
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

    var store_seleccionarCancelacionIngreso = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCancelacionIngreso',
        storeId: 'idstore_seleccionarCancelacionIngreso',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CancelacionIngreso/BuscarCancelacionIngreso',
            reader: {
                type: 'json',
                root: 'results'
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

    var ptb_CancelacionIngreso = new Ext.PagingToolbar({
        id: 'ptb_CierreIngresosLDI',
        store: store_BuscarCancelacionIngreso,
        displayInfo: true,
        displayMsg: 'Cancelacion Ingreso {0} - {1} of {2}',
        afterPageText: "Siguiente",
        beforePageText: "Anterior",
        emptyMsg: "Vacío",
        enabled: true,
        displayInfo: true,
        items: [
            {
                xtype: 'combobox',
                fieldLabel: "Size",
                width: 80,
                editable: false,
                margin: '25 5 5 5',
                labelWidth: 30,
                store: pagSize,
                displayField: 'size',
                valueField: 'id',
                listeners:
                {
                    change: function (field, newValue, oldValue, eOpts) {
                        var cuenta = field.rawValue;
                        store_BuscarCancelacionIngreso.pageSize = cuenta;
                        store_BuscarCancelacionIngreso.load();
                    }
                }
            }
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
                html: "<div style='font-size:25px';>Cancelación Ingreso</div><br/>",
                border: false,
                bodyStyle: { "background-color": "#E6E6E6" },
                width: '50%',
            },
            {
                xtype: 'tabpanel',
                width: '100%',
                margin: '3 0 0 0',
                height: 500,
                renderTo: document.body,
                frame: false,
                items: [
                    {
                        title: 'Criterios de búsqueda',
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
                                        columnWidth: 0.15,
                                        bodyStyle: { "background-color": "#E6E6E6" },
                                        border: false,
                                        items: [
                                            {
                                                html: 'Periodo',
                                                margin: '0 0 0 5',
                                                bodyStyle: { "background-color": "#E6E6E6" },
                                                border: false
                                            },
                                            {
                                                xtype: 'combobox',
                                                name: 'cmbPeriodoC',
                                                id: 'cmbPeriodoC',
                                                anchor: '100%',
                                                margin: '5 5 5 5',
                                                queryMode: 'local',
                                                bodyStyle: { "background-color": "#E6E6E6" },
                                                border: false,
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
                                    //Buscar
                                    {
                                        xtype: 'button',
                                        id: 'btnBuscar',
                                        html: "<button class='btn btn-primary' style='outline:none'>Buscar</button>",
                                        margin: '10 0 0 0',
                                        border:false,
                                        handler: function () {
                                            var periodo = Ext.getCmp('cmbPeriodoC').value;

                                            if (periodo == null) {
                                                Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                                return;
                                            }

                                            var store = Ext.StoreManager.lookup('idstore_buscarCancelacionIngreso');
                                            store.getProxy().extraParams.Periodo = Ext.getCmp('cmbPeriodoC').value;

                                            store.load({
                                                callback: function (records) {
                                                    if (records.length == 0) {
                                                        Ext.getCmp('btnExportar').setDisabled(true);
                                                    } else {
                                                        Ext.getCmp('btnExportar').setDisabled(false);
                                                    }
                                                }
                                            });
                                        },
                                    },
                                    //Exportar
                                    //{
                                    //    xtype: 'button',
                                    //    id: 'btnExportar',
                                    //    html: "<button class='btn btn-primary'  style='outline:none'>Exportar</button>",
                                    //    border: false,
                                    //    disabled: true,
                                    //    margin: '10 0 0 0',
                                    //    handler: function () {
                                    //        var periodo = Ext.getCmp('cmbPeriodoC').value;

                                    //        if (periodo == null) {
                                    //            Ext.Msg.alert('Validaciones del Sistema', 'Debe seleccionar un Periodo', Ext.emptyFn);
                                    //            return;
                                    //        }
                                    //        Ext.Ajax.request({
                                    //            timeout: 3600000,
                                    //            url: '../' + VIRTUAL_DIRECTORY + 'CierreCostosLDI/ExportarReporte',
                                    //            params: {
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
                                    //    }
                                    //},
                                    //{
                                    //    html: '<div id="container"></div>'
                                    //}
                                ]
                            },
                            {
                                xtype: 'gridpanel',
                                id: 'grp_CancelacionIngreso',
                                flex: 1,
                                store: store_BuscarCancelacionIngreso,
                                width: '100%',
                                height: 275,
                                columnLines: true,
                                scrollable: true,
                                bbar: ptb_CancelacionIngreso,
                                renderTo: Ext.getBody(),
                                selectable: {
                                    columns: false,
                                    extensible: true
                                },
                                columns: [
                                    {
                                        xtype: "gridcolumn", sortable: true, id: "operador", dataIndex: 'operador', text: "Operador", width: "8%",

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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'operador',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'concepto', text: "Concepto", width: "10%",

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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'concepto',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'grupo', text: "Grupo", width: "14%",

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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'grupo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "gridcolumn", sortable: true, dataIndex: 'deudor', text: "Deudor", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'deudor',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', align: 'left', sortable: true, dataIndex: 'montoProvision', text: "Monto Provision", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'montoProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00000', align: 'left', sortable: true, dataIndex: 'moneda', text: "Moneda", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'moneda',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', align: 'left', sortable: true, dataIndex: 'fechaPeriodo', text: "Fecha Periodo", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'fechaPeriodo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.00', align: 'left', sortable: true, dataIndex: 'tipo', text: "Tipo", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'tipo',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', align: 'left', sortable: true, dataIndex: 'noDocumento', text: "No. Documento", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'noDocumento',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', align: 'left', sortable: true, dataIndex: 'folioDocumento', text: "Folio Documento", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'folioDocumento',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', align: 'left', sortable: true, dataIndex: 'tcProvision', text: "TC. Provision", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'tcProvision',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: "numbercolumn", format: '0,000.0000', align: 'left', sortable: true, dataIndex: 'importeMXN', text: "Importe MXN", width: "14%",
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
                                                    store_BuscarCancelacionIngreso.clearFilter();
                                                    var cadena = this.value;
                                                    if (this.value && cadena.length > 1) {
                                                        store_BuscarCancelacionIngreso.load({ params: { start: 0, limit: 100000 } });
                                                        store_BuscarCancelacionIngreso.filter({
                                                            property: 'importeMXN',
                                                            value: this.value,
                                                            anyMatch: true,
                                                            caseSensitive: false
                                                        });
                                                    } else {
                                                        store_BuscarCancelacionIngreso.clearFilter();
                                                    }
                                                }
                                            }
                                        }
                                    }
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
