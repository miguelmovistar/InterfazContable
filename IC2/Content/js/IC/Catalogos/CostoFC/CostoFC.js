//fecha: 30-08-2019
//descripcion: fmodificacion al JS de CostoFC

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
    'Ext.tip.QuickTipManager'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();
    var Body = Ext.getBody();
    var id;//
    var tipoOperador;
    var idtrafico;
    var idAcreedor;
    var idoperador;
    var idmoneda;
    var importe;
    var fechainicio;
    var fechafin;
    var registroSeleccionado;
    var idcr;
    var sociedadGL;
    var tc_Cierre;

    var lineaNegocio = document.getElementById('idLinea').value;

    Ext.define('model_BuscarCostoFC',
        {
            extend: 'Ext.data.Model',

            fields: [
                { name: 'Id', mapping: 'Id' },
                { name: 'TipoOperador', mapping: 'TipoOperador' },
                { name: 'Operador', mapping: 'Operador' },
                { name: 'AcreedorSap', mapping: 'AcreedorSap' },
                { name: 'NombreProveedor', mapping: 'NombreProveedor' },
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Importe', mapping: 'Importe' },
                { name: 'Fecha_Inicio', mapping: 'Fecha_Inicio' },
                { name: 'Fecha_Fin', mapping: 'Fecha_Fin' },
                { name: 'CuentaR', mapping: 'CuentaR' },
                { name: 'SociedadGL', mapping: 'SociedadGL' },
                { name: 'TC', mapping: 'TC' }
            ]
        });

    Ext.define('model_Operador',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Operador', mapping: 'Operador' },
                { name: 'Id', mapping: 'Id' },
                { name: 'Nombre', mapping: 'Nombre' }
            ]
        });

    Ext.define('model_Trafico',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Trafico', mapping: 'Trafico' },
                { name: 'Id', mapping: 'Id' }
            ]
        });
    Ext.define('model_Acreedor',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Acreedor', mapping: 'Acreedor' },
                { name: 'NombreAcreedor', mapping: 'NombreAcreedor' },
                { name: 'Id', mapping: 'Id' }
            ]
        });

    Ext.define('model_Sociedad',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'NombreSociedad', mapping: 'NombreSociedad' },
                { name: 'Sociedad', mapping: 'Sociedad' },
                { name: 'Id', mapping: 'Id' }
            ]
        });

    Ext.define('model_Moneda',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Moneda', mapping: 'Moneda' },
                { name: 'Id', mapping: 'Id' }
            ]
        });

    Ext.define('model_Cuenta',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'Cuenta', mapping: 'Cuenta' },
                { name: 'Id', mapping: 'Id' }
            ]
        });


    //Operador
    var store_Operador = Ext.create('Ext.data.Store', {
        model: 'model_Operador',
        storeId: 'idstore_Operador',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaOperador?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });


    //Moneda
    var store_Moneda = Ext.create('Ext.data.Store', {
        model: 'model_Moneda',
        storeId: 'idstore_Moneda',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaMoneda?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    //Acreerdor
    var store_Acreedor = Ext.create('Ext.data.Store', {
        model: 'model_Acreedor',
        storeId: 'idstore_Acreedor',
        autoLoad: true,
        pageSize: 10,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenarAcreedor?lineaNegocio=' + lineaNegocio,
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

    //Trafico
    var store_Trafico = Ext.create('Ext.data.Store', {
        model: 'model_Trafico',
        storeId: 'idstore_Trafico',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaTrafico?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    //CUENTA
    var store_Cuenta = Ext.create('Ext.data.Store', {
        model: 'model_Cuenta',
        storeId: 'idstore_Cuenta',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenarCuenta?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    //Sociedad_GL
    var store_Sociedad = Ext.create('Ext.data.Store', {
        model: 'model_Sociedad',
        storeId: 'idstore_Sociedad',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaSociedad?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });


    var store_BuscarCostoFC = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCostoFC',
        storeId: 'idstore_BuscarCostoFC',
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaGrid?lineaNegocio=' + lineaNegocio,
            reader: {
                type: 'json',
                root: 'results',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var store_BorrarCostoFC = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCostoFC',
        storeId: 'idstore_BorrarCostoFC',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/borrarCostoFC',
            reader: {
                type: 'json',
                root: 'results'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {

                if (request.proxy.reader.jsonData.success == true) {
                    Ext.MessageBox.show({
                        title: "Confirmación",
                        msg: "Se eliminaron " + registroSeleccionado + " registro(s) exitosamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                    store_BuscarTrafico.load();
                }
                else {
                    this.readCallback(request);
                }
                //if (request.action == 'ok') {
                //    this.readCallback(request);
                //}
            },
            readCallback: function (request) {
                if (!request.proxy.reader.jsonData.results.length != 4) {
                    Ext.MessageBox.show({
                        title: "Notificación",
                        msg: request.proxy.reader.jsonData.results,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
                else {
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

    var store_ModificarCostoFC = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCostoFC',
        storeId: 'idstore_ModificarCostoFC',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/ModificarCostoFC',
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
                    store_BuscarCostoFC.load();
                } else {
                    this.readCallback(request);
                }
            },
            readCallback: function (request) {
                Ext.MessageBox.show({
                    title: "Aviso",
                    msg: "Ocurrió un error",
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.INFO
                });
            }
        }
    });

    //store para hacer una consulta
    Ext.define('model_CuentaResultado',
        {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'cuenta', mapping: 'cuenta' },
                { name: 'id', mapping: 'id' }
            ]
        });
    var store_LlenaCuenta = Ext.create('Ext.data.Store', {
        model: 'model_CuentaResultado',
        storeId: 'idstore_LlenaCuenta',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/llenaTraficoCuenta',
            reader: {
                type: 'json',
                root: 'result',
                successProperty: 'success'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });
    var store_ValidaModifica = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCostoFC',
        storeId: 'idstore_ValidaModifica',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/validaModif',
            reader: {
                type: 'json',
                root: 'result'
            },
            actionMethods: {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            },
            afterRequest: function (request, success) {
                var grp = Ext.getCmp('grid');
                var elements = grp.getSelectionModel().getSelection();

                if (request.proxy.reader.jsonData.success == false) {
                    var strMensaje = request.proxy.reader.jsonData.result;
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
                    //this.readCallback(request);
                }
            },
            readCallback: function (request) {
                if (request.proxy.reader.jsonData.result == "ok") {

                    Ext.MessageBox.show({
                        title: "tInformacionSistema",
                        msg: "Se eliminó correctamente",
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });

                }
                else if (request.proxy.reader.jsonData.result == "not") {
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

    var store_seleccionarCostoFC = Ext.create('Ext.data.Store', {
        model: 'model_BuscarCostoFC',
        storeId: 'idstore_seleccionarCostoFC',
        pageSize: 20,
        autoLoad: false,
        proxy:
        {
            type: 'ajax',
            url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/buscarCostoFC',
            reader: {
                type: 'json',
                root: 'result'
            },
            actionMethods:
            {
                create: 'POST', read: 'GET', update: 'POST', destroy: 'POST'
            }
        }
    });

    var obj_EventoSeleccionarFila = Ext.create('Ext.selection.RowModel',
        {
            listeners: {
                select: function (sm, record) {
                    var grpDeudor = Ext.getCmp('grp_Deudor');
                    var obj_FilaSeleccionada = grpDeudor.getSelectionModel().getSelection()[0];

                    TipoOperador = obj_FilaSeleccionada.data.TipoOperador;

                    var storeSDeudor = Ext.StoreManager.lookup('idstore_seleccionarDeudor');
                    storeSDeudor.getProxy().extraParams.Id = id;
                    storeSDeudor.load();
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
        store: store_BuscarCostoFC,
        displayInfo: true,
        displayMsg: 'Acreedores {0} - {1} of {2}',
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
                        store_BuscarCostoFC.pageSize = cuenta;
                        store_BuscarCostoFC.load();
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
                html: "<div style='font-size:25px';>Costo Fijo Recurrente</div><br/>",
                width: '50%',
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
                            var store = Ext.StoreManager.lookup('idstore_BuscarCostoFC');
                            store.load();
                        },
                        border: false
                    },
                    {
                        xtype: 'button',
                        id: 'btnGuardar',
                        border: false,
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary'  style='outline:none'>Nuevo</button>",
                        handler: function () {
                            accion = "agregar";
                            var rec = null;
                            Agregar();
                            var store = Ext.StoreManager.lookup('idstore_BuscarCostoFC');
                            store.load();

                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEditar',
                        html: "<button class='btn btn-primary' style='outline:none'>Editar</button>",
                        border: false,
                        disabled: true,
                        margin: '0 0 0 -5',
                        handler: function () {

                            Modificar();
                        }
                    },
                    {
                        xtype: 'button',
                        id: 'btnEliminar',
                        margin: '0 0 0 -5',
                        html: "<button class='btn btn-primary'  style='outline:none'>Eliminar</button>",
                        border: false,
                        disabled: true,
                        handler: function () {
                            var strID = "";
                            var grp = Ext.getCmp('grid');
                            var rec = grp.getSelectionModel().getSelection();
                            for (var i = 0; i < rec.length; i++) {
                                strID = strID + rec[i].data.Id + ",";
                            }
                            registroSeleccionado = rec.length;
                            Ext.MessageBox.confirm('Confirmación', "¿Desea eliminar " + rec.length + " registro(s) ? ", function (btn, text) {
                                if (btn == 'yes') {
                                    var store = Ext.StoreManager.lookup('idstore_BorrarCostoFC');
                                    store.getProxy().extraParams.strID = strID;
                                    store.load();

                                }
                            });
                            store_BuscarCostoFC.load();
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
                width: '100%',
                height: '100%',
                store: store_BuscarCostoFC,
                bbar: paginador,
                selModel:
                {
                    selType: 'checkboxmodel',
                    listeners:
                    {
                        selectionchange: function (selected, eOpts) {
                            if (eOpts.length == 1) {
                                
                                id = eOpts[0].data.Id;
                                idoperador = eOpts[0].data.Operador;
                                idmoneda = eOpts[0].data.Moneda;
                                idAcreedor = eOpts[0].data.AcreedorSap;
                                //idtrafico = eOpts[0].data.Id_TraficoTR;
                                tipoOperador = eOpts[0].data.TipoOperador;
                                importe = eOpts[0].data.Importe;
                                fechainicio = eOpts[0].data.Fecha_Inicio;
                                fechafin = eOpts[0].data.Fecha_Fin;
                                idcr = eOpts[0].data.CuentaR;
                                sociedadGL = eOpts[0].data.SociedadGL;
                                tc_Cierre = eOpts[0].data.TC;


                            }
                            habilitarDeshabilitar();
                        }
                    }
                },
                columns: [
                    { xtype: "gridcolumn", hidden: true, text: "Id", dataIndex: "Id" },
                    //tipo Operador
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'TipoOperador', flex: 1, locked: true, text: 'Tipo de Operador', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('TipoOperador');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'TipoOperador',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Operador
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Operador', flex: 1, text: "Operador",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Operador');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'Operador',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //acreedor
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'AcreedorSap', flex: 1, locked: true, text: 'Acreedor', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('AcreedorSap');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'AcreedorSap',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //acreedor
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'NombreProveedor', flex: 1, locked: true, text: 'Nombre Proveedor', locked: false,
                        renderer: function (v, cellValues, rec) {
                            return rec.get('NombreProveedor');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'NombreProveedor',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Moneda
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Moneda', flex: 1, text: "Moneda",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Moneda');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'Moneda',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Importe
                    {

                        xtype: "gridcolumn", sortable: true, dataIndex: 'Importe', flex: 1, text: "Importe",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('Importe');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'Importe',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Fecha Inicio
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Fecha_Inicio', flex: 1, text: "Fecha Inicio",

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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'Fecha_Inicio',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Fecha Fin
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'Fecha_Fin', flex: 1, text: "Fecha Fin",

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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'Fecha_Fin',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Cuenta
                    {
                        xtype: "gridcolumn", sortable: true, dataIndex: 'CuentaR', flex: 1, text: "Cuenta",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('CuentaR');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'CuentaR',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },
                    //Sociedad GL
                    {
                        xtype: 'gridcolumn', sortable: true, dataIndex: 'SociedadGL', flex: 1, text: 'Sociedad GL',
                        renderer: function (v, cellValue, rec) {
                            return rec.get('SociedadGL');
                        },
                        editor: {
                            xtype: 'textfield'
                        },
                        items:
                        {
                            xtype: 'textfield',
                            flex: 1,
                            margin: 2,
                            enablekeyEvents: true,
                            listeners:
                            {
                                keyup: function () {
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cade.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'SociedadGL',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });

                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    },

                    //Importe
                    {

                        xtype: "gridcolumn", sortable: true, dataIndex: 'TC', flex: 1, text: "T.C",
                        renderer: function (v, cellValues, rec) {
                            return rec.get('TC');
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
                                    store_BuscarCostoFC.clearFilter();
                                    var cadena = this.value;
                                    if (this.value && cadena.length > 1) {
                                        store_BuscarCostoFC.load({ params: { start: 0, limit: 100000 } });
                                        store_BuscarCostoFC.filter({
                                            property: 'TC',
                                            value: this.value,
                                            anyMatch: true,
                                            caseSensitive: false
                                        });
                                    } else {
                                        store_BuscarCostoFC.clearFilter();
                                    }
                                }
                            }
                        }
                    }
                ],
            },



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

    //AGREGAR
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
                                        url: '../' + VIRTUAL_DIRECTORY + 'CostoFC/agregarCostoFC',
                                        waitMsg: "Nuevo",
                                        params:
                                        {

                                            //Tipo_Operador: Ext.getCmp('dplTipoOperador').value,
                                            //Id_TraficoTR: Ext.getCmp('txtIdTrafico').value,
                                            Id_Acreedor: Ext.getCmp("cmbAcreedor").value,
                                            Id_Operador: Ext.getCmp('txtIdOperador').value,
                                            Id_Moneda: Ext.getCmp('txtIdMoneda').value,
                                            Importe: Ext.getCmp('txtImporte').value,
                                            Fecha_Inicio: Ext.getCmp('txtFecha_Inicio').value,
                                            Fecha_Fin: Ext.getCmp('txtFecha_Fin').value,
                                            Id_Cuenta: Ext.getCmp('txtId_CR').value,
                                            Id_Sociedad: Ext.getCmp('txtSociedad_GL').value,

                                            Linea_Negocio: lineaNegocio
                                        },
                                        success: function (form, action) {

                                            var data = Ext.JSON.decode(action.response.responseText);
                                            var store = Ext.StoreManager.lookup('idstore_BuscarCostoFC');

                                            store.getProxy().extraParams.Id_Acreedor = Ext.getCmp("cmbAcreedor").value;

                                            store.load();


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
                                                msg: action.result.result,
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
                    id: 'fls_movimiento',
                    items: [

                        //Operador Nuevo
                        {
                            xtype: 'combobox',
                            name: 'txtIdOperador',
                            id: 'txtIdOperador',

                            fieldLabel: 'Operador',
                            queryMode: 'remote',
                            valueField: 'Id',
                            displayField: 'Operador',
                            store: store_Operador,

                            anchor: '100%',
                            margin: '5 5 5 5',
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Operador} - {Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Operador} - {Nombre}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },
                        //Acreedor Nuevo
                        {
                            xtype: 'combobox',
                            name: 'cmbAcreedor',
                            id: 'cmbAcreedor',
                            fieldLabel: "Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            store: store_Acreedor,
                            msgTarget: 'under',
                            blankText: "El campo Acreedor es requerido",
                            editable: false,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Acreedor} - {NombreAcreedor}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Acreedor} - {NombreAcreedor}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            displayField: 'Acreedor'
                        },
                        ///

                        //Moneda Nuevo
                        {
                            xtype: 'combobox',
                            name: 'txtIdMoneda',
                            id: 'txtIdMoneda',
                            fieldLabel: 'Moneda',
                            queryMode: 'remote',
                            valueField: 'Id',
                            displayField: 'Moneda',
                            store: store_Moneda,

                            anchor: '100%',
                            margin: '5 5 5 5',
                        },
                        //tipo operador Nuevo



                        //Importe Nuevo
                        {
                            xtype: 'textfield',
                            name: 'txtImporte',
                            id: 'txtImporte',
                            fieldLabel: "Importe",
                            minValue: 0.01,
                            minText: "El valor mínimo para este campo es {0}",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        //Fecha Inicio
                        {
                            xtype: 'datefield',
                            name: 'txtFecha_Inicio',
                            id: 'txtFecha_Inicio',
                            fieldLabel: "Fecha inicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        //Fecha Fin
                        {
                            xtype: 'datefield',
                            name: 'txtFecha_Fin',
                            id: 'txtFecha_Fin',
                            fieldLabel: "Fecha Fin",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            msgTarget: 'under',
                            format: 'd-m-Y',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        //Cuenta Nuevo
                        {

                            xtype: 'combobox',
                            name: 'txtId_CR',
                            id: 'txtId_CR',
                            fieldLabel: "Cuenta",
                            queryMode: 'remote',
                            valueField: 'Id',
                            displayField: 'Cuenta',
                            store: store_Cuenta,
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        //Sociedad Nuevo
                        {
                            xtype: 'combobox',
                            name: 'txtSociedad_GL',
                            id: 'txtSociedad_GL',
                            fieldLabel: 'Sociedad GL',
                            queryMode: 'remote',
                            valueField: 'Id',
                            displayField: 'Sociedad',
                            anchor: '100%',
                            margin: '5 5 5 5',
                            store: store_Sociedad,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Sociedad} - {NombreSociedad}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Sociedad} - {NombreSociedad}',
                                '</tpl>'
                            ),
                            valueField: 'Id',
                            renderTo: Ext.getBody(),
                            msgTarget: 'under',
                            editable: false,
                            allowBlank: true
                        },

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
        var frm_Modificar = Ext.widget('form', {
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
                                var store = Ext.StoreManager.lookup('idstore_ModificarCostoFC');
                                
                                //int Id, string Id_TraficoTR, int? Id_Acreedor, string Id_Operador, string Id_Moneda, decimal Importe
                                //, DateTime Fecha_Inicio, DateTime Fecha_fin, int Cuenta, int Id_Sociedad, int lineaNegocio
                                store.getProxy().extraParams.Id = id;
                                store.getProxy().extraParams.Id_Acreedor = Ext.getCmp('cmbAcreedor').value;
                                store.getProxy().extraParams.Nombre = Ext.getCmp('ccmbOperador').value;
                                store.getProxy().extraParams.Id_Moneda = Ext.getCmp('ccmbMoneda').value;
                                store.getProxy().extraParams.Importe = Ext.getCmp('ttxtImporte').value;
                                store.getProxy().extraParams.Fecha_Inicio = Ext.getCmp('ttxtFecha_Inicio').value;
                                store.getProxy().extraParams.Fecha_Fin = Ext.getCmp('ttxtFecha_Fin').value;
                                store.getProxy().extraParams.Cuenta = Ext.getCmp('ttxtId_CR').value;
                                store.getProxy().extraParams.Id_Sociedad = Ext.getCmp('txtSociedad_GL').value;
                                store.getProxy().extraParams.lineaNegocio = lineaNegocio;
                                store.load();
                                //this.up('window').destroy();
                            }
                        }
                    ]
                }
            ],
            items: [

                {
                    xtype: 'fieldset',
                    margin: '5 5 5 5',
                    id: 'fls_deudor',
                    width: '100%',
                    frame: false,
                    items: [

                        //Operador
                        {
                            xtype: 'combobox',
                            name: 'ccmbOperador',
                            id: 'ccmbOperador',
                            fieldLabel: "Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Servicio es requerido",
                            editable: false,
                            store: store_Operador,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Operador} - {Nombre}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Operador} - {Nombre}',
                                '</tpl>'
                            ),
                            renderTo: Ext.getBody(),
                            valueField: 'Operador',
                            displayField: 'Nombre',
                            value: idoperador
                        },

                        {
                            xtype: 'displayfield',
                            id: 'dplTipoOperador',
                            fieldLabel: "Tipo de Operador",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            value: tipoOperador
                        },
                        //Modena
                        {
                            xtype: 'combobox',
                            name: 'ccmbMoneda',
                            id: 'ccmbMoneda',
                            value: idmoneda,
                            fieldLabel: 'Moneda',
                            queryMode: 'remote',
                            valueField: 'Moneda',
                            displayField: 'Moneda',
                            store: store_Moneda,
                            anchor: '100%',
                            margin: '5 5 5 5'
                        },
                        //acreedor
                        {
                            xtype: 'combobox',
                            name: 'cmbAcreedor',
                            id: 'cmbAcreedor',
                            fieldLabel: "Acreedor",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            msgTarget: 'under',
                            allowBlank: false,
                            blankText: "El campo Acreedor es requerido",
                            editable: false,
                            store: store_Acreedor,
                            tpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '<div class="x-boundlist-item">{Acreedor} - {NombreAcreedor}</div>',
                                '</tpl>'
                            ),
                            displayTpl: Ext.create('Ext.XTemplate',
                                '<tpl for=".">',
                                '{Acreedor} - {NombreAcreedor}',
                                '</tpl>'
                            ),
                            renderTo: Ext.getBody(),
                            valueField: 'Acreedor',
                            displayField: 'NombreAcreedor',
                            value: idAcreedor
                        },
                        //Sociedad
                        {
                            xtype: 'combobox',
                            name: 'txtSociedad_GL',
                            id: 'txtSociedad_GL',
                            fieldLabel: 'Sociedad GL',
                            value: sociedadGL,
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            minValue: 0,
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        //Importe
                        {
                            xtype: 'textfield',
                            name: 'ttxtImporte',
                            id: 'ttxtImporte',
                            value: importe,
                            fieldLabel: "Importe",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            minText: "El valor mínimo para este campo es {0}",
                            msgTarget: 'under',
                            maxLength: 100,
                            enforceMaxLength: true
                        },
                        //Fecha Inicio
                        {
                            xtype: 'datefield',
                            name: 'ttxtFecha_Inicio',
                            id: 'ttxtFecha_Inicio',
                            value: fechainicio,
                            editable: false,
                            fieldLabel: "Fecha Inicio",
                            anchor: '100%',
                            margin: '5 5 5 5',
                            allowBlank: false,
                            blankText: "El campo Vigencia Fecha Inicio es requerido",
                            msgTarget: 'under',
                            format: 'd-m-Y'
                        },
                        //Fecha Fin
                        {
                            xtype: 'datefield',//
                            name: 'ttxtFecha_Fin',//
                            id: 'ttxtFecha_Fin',//
                            value: fechafin,
                            editable: false,//
                            fieldLabel: "Fecha Fin",//
                            anchor: '100%',//
                            margin: '5 5 5 5',//
                            allowBlank: false,//
                            blankText: "El campo Vigencia Fecha Fin es requerido",
                            msgTarget: 'under',//
                            format: 'd-m-Y'//
                        },
                        //Tipo Operador
                        {
                            keyup: function () {
                                var valor = this.value;

                                if (valor == '9999' || valor == null || valor == '') {
                                    Ext.getCmp('dplTipoOperador').setValue('TERCERO');
                                } else {
                                    Ext.getCmp('dplTipoOperador').setValue('INTERCO');
                                }
                            }
                        },
                        //Cuenta
                        {
                            xtype: 'combobox',
                            name: 'ttxtId_CR',
                            id: 'ttxtId_CR',
                            value: idcr,
                            fieldLabel: 'Cuenta',
                            queryMode: 'remote',
                            valueField: 'Cuenta',
                            displayField: 'Cuenta',
                            store: store_Cuenta,
                            anchor: '100%',
                            margin: '5 5 5 5'
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
            items: frm_Modificar
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
