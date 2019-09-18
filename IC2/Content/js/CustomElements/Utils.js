"use strict";

var Utils = {

    createPanel: function (config) {

        var panelDef = Ext.create('custom.panelcustom');
        panelDef.setTitle(config.title + config.idNumber);
        var grid = Ext.create('custom.gridpanel', {
            bbar: config.paginador.paginadorHandler
        });
        grid.reconfigure(config.store.source, config.view.columns);
        panelDef.items.add(grid);
        return panelDef;
    },

    //name - url - fields(para el Modelo) - columns (para el grid)
    defineModelStore: function (config) {

        var configStore = {};
        configStore.model = {};
        configStore.model.name = "model_" + config.name;

        Ext.define(configStore.model.name,
            {
                extend: 'Ext.data.Model',
                fields: config.modelFields
            });

        configStore.store = {};
        configStore.store.id = "idstore_" + config.name;
        configStore.store.source = Utils.defineStore(config.urlStore,
            configStore.store.id, configStore.model.name);

        configStore.paginador = {};
        configStore.paginador.id = "paginador" + config.name;
        configStore.paginador.paginadorHandler = Utils.definePager(
            configStore.paginador.id, config.paginadorText,
            configStore.store.source, pagSize);

        configStore.view = {};
        configStore.view.columns = Utils.defineColumns(config.gridColumns);

        return configStore;
    },

    defineStore: function (url, id, model, page) {
        if (!page)
            page = 20;

        return Ext.create('Ext.data.Store', {
            model: model,
            storeId: id,
            autoLoad: true,
            pageSize: 20,
            proxy: {
                type: 'ajax',
                url: url,
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
    },

    definePager: function (id, msjDisplay, store, pagSize) {
        return new Ext.PagingToolbar({
            id: id,
            store: store,
            displayInfo: true,
            displayMsg: msjDisplay,
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
                            store.getProxy().extraParams.pageSize = cuenta;
                            store.load();
                        }

                    }
                }
            ]
        });
    },

    defineColumns: function (cols) {
        var colsDef = [];
        for (var i = 0; i < cols.length; i++) {
            var col = cols[i];
            var colDef = Utils.defineColumn(col.id, col.dataIndex, col.text, col.width);
            colsDef.push(colDef);
        }
        return colsDef;
    },

    defineColumn: function (id, dataIndex, text, width, xtype) {
        if (!xtype)
            xtype = "gridcolumn";
        
        var columnDef = {
            xtype: xtype, sortable: true, dataIndex: dataIndex, text: text, width: width,
            renderer: function (v, cellValues, rec) {
                return rec.get(dataIndex);
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

                        var store = this.up('tablepanel').store;
                        store.clearFilter();
                        var cadena = this.value;
                        if (cadena.length >= 1) {
                            store.filter({
                                property: dataIndex,
                                value: this.value,
                                anyMatch: true,
                                caseSensitive: false
                            });
                        }
                    }
                }
            }
        }

        if (xtype === "numbercolumn") {
            columnDef.format = "0,000";
            columnDef.align = "right";
        }
        return columnDef;
    }
}