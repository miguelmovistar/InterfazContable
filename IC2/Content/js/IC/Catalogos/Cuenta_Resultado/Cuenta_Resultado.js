﻿
Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', '../ux');

var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

Ext.require([
    'Ext.form.*',
    'Ext.data.*',
    'Ext.grid.Panel',
    'Ext.selection.CheckboxModel',
    'Ext.layout.container.Column',
    'Ext.form.field.ComboBox',
    'Ext.window.MessageBox',
    'Ext.form.FieldSet',
    'Ext.tip.QuickTipManager',
    'Ext.toolbar.Paging',
    'Ext.ux.*'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var lineaNegocio = document.getElementById('idLinea').value;
    var id;
    var sentido;
    var idTrafico;
    var cuenta;
    var codigo;
    var material;
    var store;

    Ext.define('modelo',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Sentido', mapping: 'Sentido' },
                { name: 'Trafico_Id', mapping: 'Trafico_Id' },
                { name: 'TraficoDescripcion', mapping: 'TraficoDescripcion' },
                { name: 'Cuenta', mapping: 'Cuenta' },
                { name: 'Codigo_Material', mapping: 'Codigo_Material' },
                { name: 'Material', mapping: 'Material' }
            ]
        });

    var storeSentido = Ext.create('Ext.data.Store', {
        fields: ['id', 'sentido'],
        data: [
            { "id": "1", "sentido": "Costo" },
            { "id": "2", "sentido": "Ingreso" }
        ]
    });

    Ext.define('modeloTrafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'Id_TraficoTR', mapping: 'Id_TraficoTR' },
                { name: 'Trafico_Id', mapping: 'Trafico_Id' },
                { name: 'Descripcion', mapping: 'Descripcion' }]
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

    var store_Buscar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_buscar',
        autoLoad: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CuentaResultado/llenaGrid?lineaNegocio=' + lineaNegocio,
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

    var store_Borrar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Borrar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CuentaResultado/borrar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grid');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + elements.length + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_Buscar.load();
                }
                else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.results.length != 4) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO8
                    });
                }
                else if (!request.proxy.reader.jsonData.success) {

                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: resultado,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
                else if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: "Se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                } else {
                    Ext.MessageBox.show({
                        title: "Aviso",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }
    });

    var store_Modificar = Ext.create('Ext.data.Store', {
        model: 'modelo',
        storeId: 'idstore_Modificar',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CuentaResultado/modificar',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                if (request.proxy.reader.jsonData.success) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se modificó exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    Ext.getCmp('idWin').destroy();
                    store_Buscar.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: 'Aviso',
                    msg: request.proxy.reader.jsonData.results,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarAcreedor',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CuentaResultado/validaModif',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grid');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == false) {
                    var strMensaje = request.proxy.reader.jsonData.results;
                    if (strMensaje != "") {
                        Ext.Msg.confirm("Confirmación", strMensaje, function (btnVal) {
                            if (btnVal === "yes") {
                                Modificar();
                            }
                        }, this);
                    }
                    else {
                        Modificar();
                    }
                }
                else {
                    Modificar();
                }
            },
            readCallback: function (request) {
                if (request.proxy.reader.jsonData.results == "ok") {

                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                }
                else if (request.proxy.reader.jsonData.results == "not") {
                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Ocurrió un error",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }

            }
        }
    });


    var storeLlenaTrafico = Ext.create('Ext.data.Store', {
        model: 'modeloTrafico',
        storeId: 'idstore_llenaTrafico',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CuentaResultado/llenaTrafico?lineaNegocio=' + lineaNegocio,
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
        id: 'ptb_empresa',
        store: store_Buscar,
        displayInfo: true,
        displayMsg: 'Cuentas de Resultado {0} - {1} of {2}',
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
                        store_Buscar.pageSize = cuenta;
                        store_Buscar.load();
                    }
                }
            }


        ]
    });

    var panel = Ext.create('Ext.form.Panel', {
        frame: false,
        border: false,
        margin: '0 0 0 6',
        height: "70%",
        width: "100%",
        layout: { type: 'vbox' },
        flex: 1,
        items: [
            {
                html: "<div style='font-size:25px';>Cuentas de Resultado</div><br/>",
                border: false,
                margin: '0 0 0 10'
            },
            {
                xtype: 'panel',
                layout: { type: 'hbox' },
                width: '50%',
                border: false,
                items: [
                    {
                        xtype: 'button',
                        html: "<div class='btn-group'>" +
                            "<button id='refresh' style='border:none'   class=btn btn-default btn-sm><span class='glyphicon glyphicon-refresh aria-hidden='true'></span><span class='sr-only'></span></button></div>",
                        handler: function () {
                            var storeBuscar = Ext.StoreManager.lookup('idstore_buscar');
                            storeBuscar.load();
                            limpiarFiltros();
                            iBusca = 0;
                            store.clearFilter();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnGuardar',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary' style='outline:none'>Nuevo</button>",
                        handler: function () {
                            Agregar();
                            var store = Ext.StoreManager.lookup('idstore_buscar');
                            store.load();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary' style='outline:none'>Editar</button>",
                        border: false,
                        margin: '0 0 0 -5',
                        disabled: true,
                        handler: function () {
                            ValidaModificar();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEliminar',
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary' style='outline:none'>Eliminar</button>",
                        border: false,
                        disabled: true,
                        handler: function () {
                            var strID = "";
                            var grp = Ext.getCmp('grid');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++)
                                strID = strID + rec[i].data.Id + ",";

                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s)? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_Borrar');
                                    store.getProxy().extraParams.strID = strID;
                                    store.load();
                                }
                            });
                        }
                    }
                ]
            },
            {
                html: "<br/>"
            },
            {
                xtype: 'gridpanel',
                id: 'grid',
                flex: 1,
                store: store_Buscar,
                width: '100%',
                height: '100%',
                bbar: paginador,
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                id = eOpts[0].data.Id;
                                sentido = eOpts[0].data.Sentido;
                                idTrafico = eOpts[0].data.Trafico_Id;
                                trafico = eOpts[0].data.TraficoDescripcion;
                                cuenta = eOpts[0].data.Cuenta;
                                codigo = eOpts[0].data.Codigo_Material;
                                material = eOpts[0].data.Material;
                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    {
                        xtype: 'gridcolumn', text: "Sentido", dataIndex: 'Sentido', flex: 1, sortable: true, locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Sentido');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txSentido',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Sentido',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'TraficoDescripcion', flex: 1, locked: false, text: "Tráfico",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('TraficoDescripcion');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txTrafico',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'TraficoDescripcion',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Cuenta', flex: 1, locked: false, text: "Cuenta",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Cuenta');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCuenta',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Cuenta',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Codigo_Material', flex: 1, locked: false, text: "Código de Material",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Codigo_Material');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txCodigo_Material',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Codigo_Material',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Material', flex: 1, locked: false, text: "Material",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Material');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            id: 'txMaterial',
                            flex: 1,
                            margin: 2,
                            enableKeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_Buscar.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 0) {
                                        store_Buscar.load({ params: { start: 0, limit: 100000 } });
                                        store_Buscar.filter({
                                            property: 'Material',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_Buscar.clearFilter();
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        ],
        renderTo: Body
    });

    Ext.EventManager.onWindowResize(function (w, h) {
        panel.setSize(w - 15, h - 255);
        panel.doComponentLayout();
    });

    Ext.EventManager.onDocumentReady(function (w, h) {
        panel.setSize(Ext.getBody().getViewSize().width - 15, Ext.getBody().getViewSize().height - 255);
        panel.doComponentLayout();
    });

    function Agregar() {
        var frm_agregar = Ext.create('Ext.form.Panel', {
            dockedItems: [
                {
                    xtype: 'panel',
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            border: false,
                            handler: function () {
                                var form = this.up('form').getForm();
                                if (form.wasValid) {
                                    form.submit({
                                        url: '../' + VIRTUAL_DIRECTORY + 'CuentaResultado/agregar',
                                        waitMsg: "Nuevo",
                                        params:
                                        {
                                            //Operador: Ext.getCmp('cmbOperador').value,
                                            Sentido: Ext.getCmp('cmbSentido').value,
                                            Trafico: Ext.getCmp('cmbTrafico').value,
                                            Cuenta: Ext.getCmp('txtCuenta').value,
                                            Codigo_Material: Ext.getCmp('txtCodigo_Material').value,
                                            Material: Ext.getCmp('txtMaterial').value,
                                            lineaNegocio: lineaNegocio
                                        },
                                        success: function (form, action) {
                                            var data = Ext.JSON.decode(action.response.responseText);
                                            store_Buscar.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                            store_Borrar.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                            store_Buscar.getProxy().extraParams.Cuenta = Ext.getCmp('txtCuenta').value;
                                            store_Buscar.getProxy().extraParams.Codigo_Material = Ext.getCmp('txtCodigo_Material').value;
                                            store_Buscar.getProxy().extraParams.Material = Ext.getCmp('txtMaterial').value;
                                            store_Buscar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                            store_Buscar.load();

                                            Ext.Msg.show({
                                                title: "Confirmación",
                                                msg: "El registro se agregó exitosamente",
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                            win.destroy();
                                        },
                                        failure: function (forms, action) {
                                            Ext.Msg.show({
                                                title: "Aviso",
                                                msg: action.result.results,
                                                buttons: Ext.Msg.OK,
                                                icon: Ext.MessageBox.INFO
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'flsTarifa',
                    border: 0,
                    frame: false,
                    items:
                        [
                            {
                                xtype: 'combobox',
                                fieldLabel: "Sentido",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeSentido,
                                displayField: 'sentido',
                                valueField: 'sentido',
                                id: "cmbSentido",
                                editable: false
                            },
                            {
                                xtype: 'combobox',
                                name: 'cmbTrafico',
                                id: 'cmbTrafico',
                                fieldLabel: "Tráfico",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                store: storeLlenaTrafico,
                                tpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="x-boundlist-item">{Id_TraficoTR} - {Descripcion}</div>',
                                    '</tpl>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{Id_TraficoTR} - {Descripcion}',
                                    '</tpl>'
                                ),
                                valueField: 'Id',
                                renderTo: Ext.getBody(),
                                allowBlank: false,
                                blankText: "El campo Tráfico es requerido",
                                msgTarget: 'under',
                                editable: false
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtCuenta',
                                id: 'txtCuenta',
                                fieldLabel: "Cuenta",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Cuenta es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtCodigo_Material',
                                id: 'txtCodigo_Material',
                                fieldLabel: "Codigo de Material",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Codigo de Material es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            },
                            {
                                xtype: 'textfield',
                                name: 'txtMaterial',
                                id: 'txtMaterial',
                                fieldLabel: "Material",
                                anchor: '100%',
                                margin: '5 5 5 5',
                                allowBlank: false,
                                decimalSeparator: ".",
                                hideTrigger: true,
                                blankText: "El campo Material es requerido",
                                decimalPrecision: 2,
                                msgTarget: 'under'
                            }
                        ]
                }
            ]
        });
        win = Ext.widget('window', {
            id: 'idWin',
            title: "Nuevo",
            closeAction: 'destroy',
            layout: 'fit',
            width: '30%',
            resizable: false,
            modal: true,
            items: frm_agregar
        });
        win.show();
    }

    //inicia funcion modificar
    function Modificar() {
        var frm_modificar = Ext.widget('form', {
            dockedItems: [
                {
                    xtype: 'panel',
                    id: 'tbBarra',
                    border: false,
                    items: [
                        {
                            xtype: 'button',
                            id: 'btn_Guardar',
                            border: false,
                            html: "<button class='btn btn-primary' style='outline:none; font-size: 11px' accesskey='g'>Guardar</button>",
                            handler: function () {
                                store_Modificar.getProxy().extraParams.Id = id;
                                store_Modificar.getProxy().extraParams.Sentido = Ext.getCmp('cmbSentido').value;
                                store_Modificar.getProxy().extraParams.Trafico = Ext.getCmp('cmbTrafico').value;
                                store_Modificar.getProxy().extraParams.Cuenta = Ext.getCmp('txtCuenta').value;
                                store_Modificar.getProxy().extraParams.Codigo_Material = Ext.getCmp('txtCodigo_Material').value;
                                store_Modificar.getProxy().extraParams.Material = Ext.getCmp('txtMaterial').value;
                                store_Modificar.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store_Modificar.load();
                            }
                        }
                    ]
                }
            ],
            items: [
                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'fls_empresa',
                    width: '100%',
                    border: 0,
                    frame: false,
                    items: [
                        {
                            xtype: 'combobox',
                            fieldLabel: "Sentido",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeSentido,
                            displayField: 'sentido',
                            valueField: 'sentido',
                            value: sentido,
                            id: "cmbSentido",
                            editable: true
                        },
                        {
                            xtype: 'combobox',
                            name: 'cmbTrafico',
                            id: 'cmbTrafico',
                            fieldLabel: "Tráfico",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: storeLlenaTrafico,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Id_TraficoTR} - {Descripcion}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Id_TraficoTR} - {Descripcion}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            allowBlank: false,
                            blankText: "El campo Tráfico es requerido",
                            msgTarget: 'under',
                            editable: false,
                            value: idTrafico
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCuenta',
                            id: 'txtCuenta',
                            fieldLabel: "Cuenta",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Cuenta es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: cuenta
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtCodigo_Material',
                            id: 'txtCodigo_Material',
                            fieldLabel: "Codigo de Material",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Codigo de Material es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: codigo
                        },
                        {
                            xtype: 'textfield',
                            name: 'txtMaterial',
                            id: 'txtMaterial',
                            fieldLabel: "Material",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            decimalSeparator: ".",
                            hideTrigger: true,
                            blankText: "El campo Material es requerido",
                            decimalPrecision: 2,
                            msgTarget: 'under',
                            value: material
                        }
                    ]
                }
            ]
        });
        win = Ext.widget('window', {
            id: 'idWin',
            title: "Editar",
            closeAction: 'destroy',
            layout: 'fit',
            width: '30%',
            resizable: false,
            modal: true,
            items: frm_modificar
        });
        win.show();
    }

    function habilitarDeshabilitar() {
        var grp = Ext.getCmp('grid');
        var rec = grp.getSelectionModel().getSelection();

        if (rec.length == 0) {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(true);
            Ext.getCmp('btnGuardar').setDisabled(false);
        } else if (rec.length == 1) {
            Ext.getCmp('btnEditar').setDisabled(false);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnGuardar').setDisabled(true);
        } else {
            Ext.getCmp('btnEditar').setDisabled(true);
            Ext.getCmp('btnEliminar').setDisabled(false);
            Ext.getCmp('btnGuardar').setDisabled(true);
        }
    }

    function ValidaModificar() {
        var store = Ext.StoreManager.lookup('idstore_ValidaModifica');
        store.getProxy().extraParams.Id = id;
        store.load();
    }
}) //Termina funcion inicial
