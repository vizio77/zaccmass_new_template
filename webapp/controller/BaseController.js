sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, Filter, JSONModel) {
	"use strict";
	//lt aggiungo il base controller per tutte le funzioni condivise dalle varie views
	return Controller.extend("zsap.com.r3.cobi.s4.accmass.controller.BaseController", {
		go2PageFail: function (message) {
            sap.ui.core.BusyIndicator.hide();
            message = message ? message : this.getResourceBundle().getText("error");
            this.getOwnerComponent().getRouter().getTargets().display("PageFail", message);
        },

		onPressSend: async function() {

			/* var oTupla = {
				Titolo: this.getView().byId("idTitoloNotifica").getValue(),
				Destinatario: this.getView().byId("idUtenza").getValue().toUpperCase(),
				Messaggio: this.getView().byId("idTextArea").getValue(),
				TypeKey: "TESTMESS",
				TypeVersion: "1.0",
				Oggetto: this.getView().byId("idTitoloNotifica").getValue(),
				Semobj: "DASSWF"				
			}; */
			var oTupla = {
				Titolo: "Avanzamento Aprovazione Accantonamenti",
				Destinatario: "L.TARTAGGIA", //this.getView().byId("idUtenza").getValue().toUpperCase()
				Messaggio: "La sezione lavoro xxx dell'accantonamento è passata dallo stato 1 allo stato 2",
				TypeKey: "TESTMESS",
				TypeVersion: "1.0",
				Oggetto: "Avanzamento Aprovazione Accantonamenti",
				Semobj: "DASSWF"				
			};

			/* 
				
			*/

			var sRecordInsert = await this._insertRecord("0", "/Send_MessageSet", oTupla);

		},

		// ----------------------------- Function to Read Data with oData v2: INIZIO
		_readFromDb: function(sDbSource, sEntitySet, aFilters, aSorters) {
			var aReturn = this._getDbOperationReturn();
			var oModel = this._getDbModel(sDbSource);
			return new Promise(function(resolve, reject) {
				oModel.read(sEntitySet, {
					filters: aFilters,
					sorters: aSorters,
					success: function(oData) {
						aReturn.returnStatus = true;
						aReturn.data = oData.results;
						resolve(oData);
						// return resolve(aReturn.data);
					},
					error: function(e) {
						aReturn.returnStatus = false;
						reject(e);
						// return reject(e);
					}
				});
			});
		},
		// // Writing to the DB with oData v2
		_insertRecord: function(sDbSource, sEntitySet, oRecord) {
			var aReturn = this._getDbOperationReturn();
			var oModel = this._getDbModel(sDbSource);
			return new Promise(function(resolve, reject) {
				oModel.create(sEntitySet, oRecord, {
					success: function(oData) {
						aReturn.returnStatus = true;
						return resolve(aReturn.returnStatus);
					},
					error: function(e) {
						aReturn.returnStatus = false;
						return reject(aReturn.returnStatus);
					}
				});
			});
		},
		_getDbOperationReturn: function() {
			return {
				returnStatus: false,
				data: []
			};
		},
		_getDbModel: function(sDbSource) {
			var sServiceURL;
			switch (sDbSource) {
				case "0":
					return this.getOwnerComponent().getModel("sapHanaS2Notif");
					break;
				case "1":
					return this.getOwnerComponent().getModel("sapHanaS2NotifMail");
					break;
			}
		}

	});
});