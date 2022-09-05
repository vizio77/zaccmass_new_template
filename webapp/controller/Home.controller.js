sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function(Controller, JSONModel, formatter, Filter, FilterOperator, Fragment,MessageBox) {
	"use strict";

	return Controller.extend("zsap.com.r3.cobi.s4.accmass.controller.Home", {
		formatter: formatter,
		onInit: async function() {

			this.getOwnerComponent().getRouter().getRoute("Home").attachPatternMatched(function () {
				
				this.onPressAvvio();

			}.bind(this), this);
			
		},

		onNavTo: function () {		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Detail");
					
		},

		onNavToPath: function (item) {		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DetailFromPath", {
				NomeSessione: item.NomeSessione,
				Esercizio: item.Esercizio
			});					
		},

		onReset: function () {
			this.getOwnerComponent().setModel(new JSONModel({Esercizio: 2023}),"modelFilterHome");
		},

		handleAddAccantonamenti: function (oEvent) {

			/* this.getOwnerComponent().getModel("generalModel").setProperty("/ValueNpshNew", {}); */
			this.getOwnerComponent().getModel("modelHome").setProperty("/form",{
				NomeSessione 		: "",
				Esercizio 	: "",
				Descrizione : "",
				statoWf		: "Iniziato",
				Stato: "1"
			});
			if (!this._handleAddAccantonamenti) {
				this._handleAddAccantonamenti = sap.ui.xmlfragment("zsap.com.r3.cobi.s4.accmass.view.fragment.AddAccantonamenti", this);
				this.getView().addDependent(this._handleAddAccantonamenti);
			}
			this._handleAddAccantonamenti.open();
		},

		handlecloseAccantonamenti: function () {
			if (this._handleAddAccantonamenti) {
				this._handleAddAccantonamenti.destroy();
				this._handleAddAccantonamenti = null;
			}
		},

		handlecAddAccantonamentoSelected: function(oEvent){
			var form = this.getOwnerComponent().getModel("modelHome").getProperty("/form");
			var accantonamenti = this.getOwnerComponent().getModel("modelHome").getProperty("/ListaAccantonamenti");
			//lt controllare che la creazione della sessione

			//this.checkSessione(form);

			this.addSessione(form);

			//accantonamenti.push(form);
			//this.getOwnerComponent().getModel("modelHome").setProperty("/ListaAccantonamenti", accantonamenti);
			//this.handlecloseAccantonamenti();
		},

		addSessione: function(form){			
			var oModel = this.getOwnerComponent().getModel("accantonamenti");
			//recupero gli stati della sessione per impostare il primo stato (che sarà stato iniziato)
			var stati = this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/TipoStatiSet");

			//setto la chiamata batch per creare lo stato (si potrebbe spostare su back-end)
			var scpDeferredGroups = oModel.getDeferredGroups();
			scpDeferredGroups = scpDeferredGroups.concat(["scpGroup"]);
			oModel.setDeferredGroups(scpDeferredGroups);				
			
			var formExt = jQuery.extend(true, {}, form);

			formExt.Stato = parseInt(formExt.Stato);
			delete formExt.statoWf;
			delete formExt.STAC;

			var today = new Date();
			var stato = {
				"NomeSessione" : formExt.NomeSessione,
				"Esercizio" : formExt.Esercizio,
				"Descrizione": stati[0].Descrizione,
				"Utente": "L.TARTAGGIA",
				"DataStato": today,
				"OraStato" : today.toTimeString().substr(0, 8),
				"Stato": parseInt(stati[0].Stato)
			};

			var that = this;
			oModel.create("/SessioneLavoroSet",	formExt, {groupId: "scpGroup"});
			oModel.create("/StatoSessioneSet",	stato, {groupId: "scpGroup"});

			var entities = ["Sessione","Stato"];

			oModel.submitChanges({
				success: function (batchCallRel) {
					var errore = false;
					var entitiesInError = "";
					if (batchCallRel.__batchResponses && batchCallRel.__batchResponses.length === 1){
						var responseBatch = batchCallRel.__batchResponses[0].__changeResponses;
						for (let i = 0;responseBatch && i < responseBatch.length; i++) {
							const element = responseBatch[i];
							if (element.statusCode !== "200" && element.statusCode !== "201") {
								errore = true;
								entitiesInError = entitiesInError + this[i] +"\n";
							}							
						}
						if(errore){
							sap.ui.core.BusyIndicator.hide();
							MessageBox.error("Errore Creazione");
							//return;
						}else{
							var sessioniPresenti = that.getOwnerComponent().getModel("accantonamentiModel").getProperty("/SessioneLavoroSet");
							sessioniPresenti.push(this);
							that.getOwnerComponent().getModel("accantonamentiModel").setProperty("/SessioneLavoroSet", sessioniPresenti);
							console.log("creato con successo l'elemento della sessione");
							MessageBox.success("Accantonamento Creato con successo.");
							that.handlecloseAccantonamenti();
						}
					}else{
						sap.ui.core.BusyIndicator.hide();
						MessageBox.error("Errore Creazione");
					}				
					sap.ui.core.BusyIndicator.hide();
				}.bind(entities),
				error: function (oError) {
					//console.log("errore")
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("erroreAggiornamentoStato"));
					return;
				}.bind(entities)
			}); 
			

			/* oModel.create("/SessioneLavoroSet" , formExt, {				
				success: function(oData, response) {
					var sessioniPresenti = that.getOwnerComponent().getModel("accantonamentiModel").getProperty("/SessioneLavoroSet");
					sessioniPresenti.push(this);
					that.getOwnerComponent().getModel("accantonamentiModel").setProperty("/SessioneLavoroSet", sessioniPresenti);
					console.log("creato con successo l'elemento della sessione");
					MessageBox.success("Accantonamento Creato con successo.");
					that.handlecloseAccantonamenti();	
				}.bind(form),
				error: function(error) {
					console.log(error);	
				}
			}); */


		},

		navToDetail: function(oEvent){
			var table = this.getView().byId("TableAccantonamenti");
			var context = table.getSelectedContexts();

			if(context.length === 0){	
				MessageBox.warning("Seleziona prima una sessione di lavoro");		
				return;
			}

			var accantonamento = context[0].getObject();
			//lt codice per recuperare gli item degli accantonamenti...
			// a regime o lo recupero dall'expand oppure da chiamata puntuale. da capire

			/* var itemsAccantonamento = $.grep(this.getOwnerComponent().getModel("modelHome").getProperty("/Items"), function (n, i) {
				return n.nome === accantonamento.NomeSessione && n.anno === accantonamento.Esercizio;
			});
			accantonamento.items = itemsAccantonamento; */

			/* var arr = accantonamento.SessioneLav_ElementoSessione.results;
			arr = arr.concat(arr);
			accantonamento.items = arr;
			//accantonamento.items = accantonamento.SessioneLav_ElementoSessione.results;

			//recupero la descrizione degli stati
			var listaStati = $.grep(this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/TipoStatiSet"), function (n, i) {
				return n.Stato.toString() === accantonamento.Stato.toString();
			});
			accantonamento.statoWf = listaStati[0].Descrizione;


			accantonamento.SessioneLav_StatiSessioni = accantonamento.SessioneLav_StatiSessioni.results


			
			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected", accantonamento);
			//controllo se è un numero... in caso lo passo converto a stringa per la visibilità...
			!isNaN(accantonamento.Stato) ? accantonamento.Stato = accantonamento.Stato.toString() : accantonamento.Stato;

			var visibility = {
					stato : accantonamento.Stato
			};
			//se è diverso da null allora lo faccio  vedere
			accantonamento.STAC !== "" && accantonamento.STAC !== undefined ? visibility.STAC = true : visibility.STAC = false;
			
			this.getOwnerComponent().setModel(new JSONModel(visibility),"visibilityModel"); */

			table.removeSelections(true);
			this.onNavToPath(accantonamento);
			//this.onNavTo();

		},
		onSalva: function(oEvent){
			var table = this.getView().byId("TableAccantonamenti");

			console.log("test");
		},

		onPressAvvio: function (oEvent) {
			var oTable = this.getView().byId("TableAccantonamenti");
			//var mParams = oEvent.getParameters();
			//var oBinding = oTable.getBinding("items");
			var aFilters = [];

			var modelFilterHome = this.getOwnerComponent().getModel("modelFilterHome").getData();

			if(modelFilterHome.Nome){
				aFilters.push(new Filter("NomeSessione", "Contains", modelFilterHome.Nome))
			}

			if(modelFilterHome.Descrizione){
				aFilters.push(new Filter("Descrizione", "Contains", modelFilterHome.Descrizione))
			}
			

			if(modelFilterHome.Stato){
				aFilters.push(new Filter("Stato", "EQ", modelFilterHome.Stato))
			}else{
				aFilters.push(new Filter("Stato", "NE", "7"))
			}

			var oModel = this.getOwnerComponent().getModel("accantonamenti");
			
			var urlParam = { "$expand" : "SessioneLav_StatiSessioni,SessioneLav_ElementoSessione"};
			
			var that = this;
			oModel.read("/SessioneLavoroSet", {
				filters: aFilters,
				urlParameters: urlParam,
				success: function(oData, response) {
					that.getOwnerComponent().getModel("accantonamentiModel").setProperty("/SessioneLavoroSet" ,oData.results);
				},
				error: function(error) {
					console.log(error);	
				}
			});


			//filtro multiplo
			/* if (mParams.filterItems.length > 0) {
				for (var i=0; i<mParams.filterItems.length; i++) {
				var sPath = "Familyid";
				var sOperator = "EQ";
				var sValue1 = mParams.filterItems[i].getKey();
				var oFilter = new Filter(sPath, sOperator, sValue1);
				aFilters.push(oFilter);
				}
			} */

		
			// apply filter settings
			//oBinding.filter(aFilters);
			//oTable.removeSelections(true);
			
		},
	});
});