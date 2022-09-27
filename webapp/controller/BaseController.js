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

		writeAndRetrive: async function(item){

			var accantonamentoSelected = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");
			var payload = {
				"SchedaSac" : "GESTIONE",
				"Zuser": "L.TARTAGGIA",
				"Esercizio": item.Esercizio,
				"Stato": parseInt(accantonamentoSelected.Stato),
				"ProgSessLavoro" : parseInt(item.ProgSessLavoro),
				"NomeSessione" : item.NomeSessione,
				"SemObj" : "ACCMASS"
				};

			return new Promise((resolve, reject) => {
			//lt creo il payload
				var oModel = this.getOwnerComponent().getModel("accantonamenti");
				var that = this;
				oModel.create("/UrlSacSet", payload, {
					success: function(oData, response) {

						//salvo il link che mi ritorna dalla funzione
						that.creaModelloLinkSAC(oData.Url);
						resolve();
					},
					error: function(error) {
						console.log(error);	
						reject(error);
					}
				});
			});
		},

		

		onPressSend: async function(titolo, destinatario, messaggio ) {

			/* var oTupla = {
				Titolo: this.getView().byId("idTitoloNotifica").getValue(),
				Destinatario: this.getView().byId("idUtenza").getValue().toUpperCase(),
				Messaggio: this.getView().byId("idTextArea").getValue(),
				TypeKey: "TESTMESS",
				TypeVersion: "1.0",
				Oggetto: this.getView().byId("idTitoloNotifica").getValue(),
				Semobj: "DASSWF"				
			}; 
			var oTupla = {
				Titolo: "Avanzamento Aprovazione Accantonamenti",
				Destinatario: "L.TARTAGGIA", //this.getView().byId("idUtenza").getValue().toUpperCase()
				Messaggio: "La sezione lavoro xxx dell'accantonamento è passata dallo stato 1 allo stato 2",
				TypeKey: "TESTMESS",
				TypeVersion: "1.0",
				Oggetto: "Avanzamento Aprovazione Accantonamenti",
				Semobj: "DASSWF"				
			};*/
			var oTupla = {
				Titolo:  titolo,
				Destinatario: destinatario, //this.getView().byId("idUtenza").getValue().toUpperCase()
				Messaggio: messaggio,
				TypeKey: "TESTMESS",
				TypeVersion: "1.0",
				Oggetto: titolo,
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
		},

		__setPropertyFiltriMissioneDomSStr: function (oData) {
			let modelHome = this.getView().getModel("modelHome")

			let resultMissioni = oData.results.filter((s => a => !(s.has(a.Missione)) && (s.add(a.Missione)))(new Set))
								.filter(tit => tit.Missione !== "");
			modelHome.setProperty("/formSottostrumento/missione_set", resultMissioni)

			let resultProgramma = oData.results.filter((s => a => !(s.has(a.Programma)) && (s.add(a.Programma)))(new Set))
								.filter(tit => tit.Programma !== "");
			modelHome.setProperty("/formSottostrumento/programma_set", resultProgramma)

			let resultAzione= oData.results.filter((s => a => !(s.has(a.Azione)) && (s.add(a.Azione)))(new Set))
								.filter(tit => tit.Azione !== "");
			modelHome.setProperty("/formSottostrumento/azione_set", resultAzione)
		},

		__setPropertyFiltriTitoloDomSStr: function (oData) {
			let modelHome = this.getView().getModel("modelHome")
			// let resultAmm = oData.results.filter((s => a => !(s.has(a.Prctr)) && (s.add(a.Prctr)))(new Set))
			//                         .filter(amm => amm.Prctr !== "");
			// modelHome.setProperty("/formSottostrumento/dominio_sstrSet", resultAmm)

			let resultTitoli = oData.results.filter((s => a => !(s.has(a.Titolo)) && (s.add(a.Titolo)))(new Set))
								.filter(tit => tit.Titolo !== "");
			modelHome.setProperty("/formSottostrumento/titolo_set", resultTitoli)

			let resultCategoria = this.__removeDuplicate(oData.results, "categoria")
										.filter(cat => cat.Titolo !== "");
			modelHome.setProperty("/formSottostrumento/categoria_set", resultCategoria)

			let resultCE2= this.__removeDuplicate(oData.results, "ce2")
										.filter(ce2 => ce2.Ce2 !== "");
			modelHome.setProperty("/formSottostrumento/economica2_set", resultCE2)

			let resultCE3= this.__removeDuplicate(oData.results, "ce3")
										.filter(ce3 => ce3.Ce3 !== "");
			modelHome.setProperty("/formSottostrumento/economica3_set", resultCE3)
		},

		__removeDuplicate(arr, property){
			let results = []
			switch (property) {
				case "categoria":
					for(let i = 0; i <  arr.length; i++){
						if(results.filter(item => (item.Categoria === arr[i].Categoria && item.Titolo === arr[i].Titolo)).length === 0)
							results.push(arr[i])
					}
					break;
				case "ce2":
					for(let i = 0; i <  arr.length; i++){
						if(results.filter(item => item.Categoria === arr[i].Categoria && item.Titolo === arr[i].Titolo
										&& item.Ce2 === arr[i].Ce2).length === 0)
							results.push(arr[i])
					}
					break; 
				case "ce3":
					for(let i = 0; i <  arr.length; i++){
						if(results.filter(item => item.Categoria === arr[i].Categoria && item.Titolo === arr[i].Titolo
										&& item.Ce2 === arr[i].Ce2 && item.Ce3 === arr[i].Ce3).length === 0)
							results.push(arr[i])
					}
					break; 
				case "missioni":
					for(let i = 0; i <  arr.length; i++){
						if(results.filter(item => item.Missione === arr[i].Missione).length === 0)
							results.push(arr[i])
					}
					break; 
				case "programma":
					for(let i = 0; i <  arr.length; i++){
						if(results.filter(item => item.Missione === arr[i].Missione && item.Programma === arr[i].Programma).length === 0)
							results.push(arr[i])
					}
					break; 
				case "azioni":
					for(let i = 0; i <  arr.length; i++){
						if(results.filter(item => item.Missione === arr[i].Missione && item.Programma === arr[i].Programma
											&& item.Azione === arr[i].Azione).length === 0)
							results.push(arr[i])
					}
					break; 
				case "esposizione":
					for (let i = 0; i < arr.length; i++) {
						if(results.filter(item => item.Esposizione === arr[i].Esposizione).length === 0)
								results.push(arr[i])  
					}
					break;
				case "tipologia":
					for (let i = 0; i < arr.length; i++) {
						if(results.filter(item => item.Tipologia === arr[i].Tipologia).length === 0)
								results.push(arr[i])  
					}
					break;
				case "visibilita":
					for (let i = 0; i < arr.length; i++) {
						if(results.filter(item => item.Reale === arr[i].Reale).length === 0)
								results.push(arr[i])  
					}
					break;
				default:
					break;
			}
			return results
		},

	});
});