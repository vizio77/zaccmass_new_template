/* global nv:true */
sap.ui.define([
	//"sap/ui/core/mvc/Controller",
	"zsap/com/r3/cobi/s4/accmass/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",	
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"../model/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/MaskInput",
	"sap/m/TextArea",
	"sap/m/Label",
	"sap/m/Button",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment"
], function (BaseController ,JSONModel, History,  Filter, FilterOperator, formatter, MessageBox, MessageToast, Dialog, Text, MaskInput,
	TextArea, Label, Button, DateFormat, Fragment) {
	"use strict";

	return BaseController.extend("zsap.com.r3.cobi.s4.accmass.controller.Detail", {
		formatter: formatter,

		onInit: function () {
			//lt recupero le info dall'oData quando navigo così se per caso si arriva da altre app ho sempre info aggiornate
			this.getOwnerComponent().getRouter().getRoute("DetailFromPath").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent, toRefresh) {
			var nomeSessione,
			esercizio;
			if(!toRefresh){
			  nomeSessione = oEvent.getParameters().arguments.NomeSessione;
			  esercizio = oEvent.getParameters().arguments.Esercizio;
			}else{
				nomeSessione = this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/nomeSessione");
				esercizio = this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/esercizio");
			}	
			
			this.getOwnerComponent().getModel("accantonamentiModel").setProperty("/nomeSessione", nomeSessione);
			this.getOwnerComponent().getModel("accantonamentiModel").setProperty("/esercizio", esercizio);

			this.getOwnerComponent().getModel("accantonamenti").metadataLoaded().then(function () {
				var sObjectPath = this.getOwnerComponent().getModel("accantonamenti").createKey("SessioneLavoroSet", {
					NomeSessione: nomeSessione,
					Esercizio: esercizio
				});
				/* var oggettoRecuperato = this.getOwnerComponent().getModel("accantonamenti").getProperty("/" + sObjectPath);

				var oggettoRecuperatoExt = {};
				var oggettoRecuperatoClonato = jQuery.extend(true, oggettoRecuperatoExt, oggettoRecuperato); */
				var that = this;
				this.getOwnerComponent().getModel("accantonamenti").read("/" + sObjectPath, {
					/* filters: aFilters,*/
					urlParameters: {$expand: "SessioneLav_StatiSessioni,SessioneLav_ElementoSessione" }, 
					success: function(oData, response) {
						that.initView(response.data);						
					},
					error: function(error) {
						console.log(error);	
						that.go2PageFail(error.statusText);
					}
				});
				//var sessione = this.getOwnerComponent().getModel("accantonamenti").getObject("/" + sObjectPath);
			}.bind(this));
        
        },
		

		initView: function(sessione){
			var accantonamento = sessione;
			var arr = accantonamento.SessioneLav_ElementoSessione.results;
			//lt per aggiungere un po' di record all'array
			/* arr = arr.concat(arr);
			arr = arr.concat(arr);
			arr = arr.concat(arr);
			arr = arr.concat(arr);
			arr = arr.concat(arr); */
			accantonamento.items = arr;
			var appModelStringify      = JSON.stringify(arr);
			this.getOwnerComponent().getModel("accantonamentiModel").setProperty("/Stringify", appModelStringify);
			var listaStati = $.grep(this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/TipoStatiSet"), function (n, i) {
				return n.Stato.toString() === accantonamento.Stato.toString();
			});
			accantonamento.statoWf = listaStati[0].Descrizione;
			accantonamento.SessioneLav_StatiSessioni = accantonamento.SessioneLav_StatiSessioni.results
			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected", accantonamento);
			//controllo se è un numero... in caso lo passo converto a stringa per la visibilità...
			!isNaN(accantonamento.Stato) ? accantonamento.Stato = accantonamento.Stato.toString() : accantonamento.Stato;

			var visibility = {
					stato : accantonamento.Stato,
					weEntry : accantonamento.SessioneLav_StatiSessioni.length
			};
			//se è diverso da null allora lo faccio  vedere
			accantonamento.STAC !== "" && accantonamento.STAC !== undefined ? visibility.STAC = true : visibility.STAC = false;
			
			this.getOwnerComponent().setModel(new JSONModel(visibility),"visibilityModel");
		},

		onCambiaStato: async function(oEvent, sottoStrumento){

			var statoDiPartenza = oEvent.getSource().data().Stato;
			!isNaN(statoDiPartenza) ? statoDiPartenza = statoDiPartenza.toString() : statoDiPartenza;
			var arrayStati = ["1","2","3","4","5","6"];
			
			if(arrayStati.indexOf(statoDiPartenza) !== -1){
				this.cambiaStato((parseInt(statoDiPartenza) + 1).toString(), sottoStrumento, );
			}else{
				//inserire dettaglio errore
				MessageBox.warning(this.getText("cambioStatoKo"));
				return;
			}

		},

		cambiaStato: async function(Stato, sottoStrumento){
			//lt effettuo a regime la chiamata alla tabella e a BW per cambiare lo stato.

			var accantonamento = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");

			var stati = this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/TipoStatiSet");

			var statoNuovo = $.grep(stati, function (n, i) {
				return n.Stato.toString() === Stato;
			});

			accantonamento.Stato = Stato;
			accantonamento.statoWf = statoNuovo[0].Descrizione;


			var titolo = "Avanzamento Aprovazione Accantonamenti";
			var destinatario = "L.TARTAGGIA";
			var messaggio = "La sessione lavoro " + accantonamento.NomeSessione + " dell'accantonamento è passata in stato: " + statoNuovo[0].Descrizione
			//var messaggio = this.getText("textNotif", [accantonamento.NomeSessione,statoNuovo[0].Descrizione]);

			//lt commento l'invio delle notifiche 
			//await this.onPressSend(titolo, destinatario, messaggio);

			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected", accantonamento);
			

			await this.setEntryWorkFlow(statoNuovo[0]);
			

			if(sottoStrumento){
				var accantonamentoSelected = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");
				accantonamentoSelected.STAC = this.getView().getModel("associaSottostrumento").getProperty("/sottostrumento");

				accantonamentoSelected.AnnoSstr   = this.getView().getModel("associaSottostrumento").getProperty("/AnnoSstr");
				accantonamentoSelected.TipoSstr   = this.getView().getModel("associaSottostrumento").getProperty("/TipoSstr");
				accantonamentoSelected.NumeroSstr = this.getView().getModel("associaSottostrumento").getProperty("/NumeroSstr");

				this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected",accantonamentoSelected);
				this.getOwnerComponent().getModel("visibilityModel").setProperty("/STAC", true);


			}
			
			MessageBox.success(this.getText("cambioStatoOk") + "" +  statoNuovo[0].Descrizione);

			
		},

		setEntryWorkFlow: async function(statoNuovo){
			var accantonamento = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");
			//var workFlowSession = this.getOwnerComponent().getModel("modelHome").getProperty("/WorkFlow");
			var workFlowSession = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected/SessioneLav_StatiSessioni");

			const dt = DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy HH.mm" });
			const dateFormatted = dt.format(new Date()); // returns: "01/08/2020"

			/* var entry = {
				"TITLE": statoNuovo.Descrizione,
				"TEXT": "L.TARTAGGIA",
				"DATETIME": dateFormatted,
				"FASE": parseInt(statoNuovo.Stato),
				"ICON": "person-placeholder"
			  } */
			var today = new Date();
			  var entry = {
				"NomeSessione" : accantonamento.NomeSessione,
				"Esercizio" : accantonamento.Esercizio,
				"Descrizione": statoNuovo.Descrizione,
				"Utente": "L.TARTAGGIA",
				"DataStato": today,
				"OraStato" : today.toTimeString().substr(0, 8),
				"Stato": parseInt(statoNuovo.Stato)
			  };

			this.getOwnerComponent().getModel("visibilityModel").setProperty("/stato", statoNuovo.Stato.toString());

			workFlowSession.push(entry);
			this.getOwnerComponent().getModel("visibilityModel").setProperty("/weEntry", workFlowSession.length);
			//this.getOwnerComponent().getModel("modelHome").setProperty("/WorkFlow", workFlowSession);
			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/SessioneLav_StatiSessioni" , workFlowSession);

			  // decommentare per portare le modifiche a livello oData
			/* var oModel = this.getOwnerComponent().getModel("accantonamenti");
			
			var scpDeferredGroups = oModel.getDeferredGroups();
			scpDeferredGroups = scpDeferredGroups.concat(["scpGroup"]);
			oModel.setDeferredGroups(scpDeferredGroups);
			
			var that = this;		
			//creo riga stato WF
			oModel.create("/StatoSessioneSet",	entry, {groupId: "scpGroup"});
			//aggiorno la sessione lavoro
			var path = "/SessioneLavoroSet(NomeSessione='" + accantonamento.NomeSessione + "',Esercizio='"+ accantonamento.Esercizio +"')";
			var modificaAccantonamento = {Stato: parseInt(statoNuovo.Stato)};
			oModel.update(path,	 modificaAccantonamento, {groupId: "scpGroup"})	

			var entityArray = ["StatoSessione" , "UpdateSessione"];

			oModel.submitChanges({
				success: function (batchCallRel) {
					var errore = false;
					var entitiesInError = "";
					for (var j = 0; batchCallRel.__batchResponses && j < batchCallRel.__batchResponses.length; j++) {
						var propertyToSave = this[j];	
						if (batchCallRel.__batchResponses[j].statusCode === "200") {
							var log="test";									
							
						}else{

							var log="test";
						}
					}
					if(errore){
							sap.ui.core.BusyIndicator.hide();
							MessageBox.error("Errore Aggiornamento");
							//return;
					}
					sap.ui.core.BusyIndicator.hide();
				}.bind(entityArray),
				error: function (oError) {
					//console.log("errore")
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("erroreAggiornamentoStato"));
					return;
				}.bind(entityArray)
			}); */

			/* oModel.create("/StatoSessioneSet" , entry, {				
				success: function(oData, response) {
					that.getOwnerComponent().getModel("visibilityModel").setProperty("/stato", statoNuovo.Stato.toString());
					workFlowSession.push(entry);
					that.getOwnerComponent().getModel("modelHome").setProperty("/WorkFlow", workFlowSession);					
				}.bind(entry),
				error: function(error) {
					console.log(error);	
				}
			}); */

		},

		onSelectIconTab: function(oEvent){
			var selectedKey = oEvent.getSource().getSelectedKey();
			var table = this.getView().byId("TableDetail");
			if (selectedKey === "2"){
				table.setVisible(false) 
			} else {
				table.setVisible(true);
			}

		},

		handleAddRowAccantonamento: function (oEvent) {

			var accantonamentoSelected = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");

			/* this.getOwnerComponent().getModel("generalModel").setProperty("/ValueNpshNew", {}); */
			this.getOwnerComponent().getModel("modelHome").setProperty("/formRow", {
				"NomeSessione": accantonamentoSelected.NomeSessione,
				"Esercizio": accantonamentoSelected.Esercizio,
                "Amministrazione": "",
                "CodiceCategoria": "",
                "CodiceClaeco2": "",  
                "CodiceClaeco3": "",
                "CodiceMissione": "",
                "CodiceProgramma": "",
                "CodiceAzione" : "",
                "ClassAut": "FB",
                "CpCs": "CP",
                "Taglio": "OBC",
                "AnnoDa": "0000", 
                "AnnoA": "0000",
                "PercPrimoAnno" : "0.00",
                "PercSecondoAnno" : "0.00",
                "PercTerzoAnno" : "0.00",
                "PrimoAnno" : "0.00",
                "SecondoAnno" : "0.00",
                "TerzoAnno" : "0.00",
                "ADecorrere": false,
                "AllaCassa": false
			})
			if (!this._handleAddRow) {
				this._handleAddRow = sap.ui.xmlfragment("zsap.com.r3.cobi.s4.accmass.view.fragment.AddRowAccantonamento", this);
				this.getView().addDependent(this._handleAddRow);
			}
			this._handleAddRow.open();
		},

		handlecloseRowAccantonamento: function () {
			if (this._handleAddRow) {
				this._handleAddRow.destroy();
				this._handleAddRow = null;
			}
		},

		handlecAddRowAccantonamento: function(oEvent){

			var object = this.getOwnerComponent().getModel("modelHome").getProperty("/formRow");
			var itemsTable = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected/items");
			//lt inserire controlli per i duplicati

			//inserire chiamata di creazione
			
			this.addRowToDb(object);
			//metto l'oggetto dentro l'array
			/* itemsTable.push(object);
			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/items",itemsTable);
			this.handlecloseRowAccantonamento(); */
		},

		adaptRow: function(row){
			row.Obiettivo 	= this.adaptNumber(row.Obiettivo);

			row.PrimoAnno 	= this.adaptNumber(row.PrimoAnno);
			row.SecondoAnno = this.adaptNumber(row.SecondoAnno);
			row.TerzoAnno 	= this.adaptNumber(row.TerzoAnno);

			row.PercPrimoAnno 	= this.adaptNumber(row.PercPrimoAnno);
			row.PercSecondoAnno = this.adaptNumber(row.PercSecondoAnno);
			row.PercTerzoAnno 	= this.adaptNumber(row.PercTerzoAnno);
			return row;
		},
		adaptNumber: function(number, isPercent){
			if(number.indexOf(".") !== -1 && parseFloat(number) > 0){
			//salvo i numeri inseriti come vuole SAP
				number = number.replace(".","");
				number = number.replace(",",".");
			}else if(number.indexOf(",") !== -1 && parseFloat(number) > 0){
				number = number.replace(",",".");
			}

			return number;
		},

		modifyRowToDb: function(arrayRows){
			var oModel = this.getOwnerComponent().getModel("accantonamenti");	
			
			var scpDeferredGroups = oModel.getDeferredGroups();
			scpDeferredGroups = scpDeferredGroups.concat(["modifyRows"]);
			oModel.setDeferredGroups(scpDeferredGroups);				
			
			var that = this;

			for (let i = 0; i < arrayRows.length; i++) {
				const rowExt = arrayRows[i];				
				oModel.update("/ElementoSessioneSet(NomeSessione='" + rowExt.NomeSessione + "',Esercizio='" + rowExt.Esercizio + "',ProgSessLavoro=" + rowExt.ProgSessLavoro + ")" , rowExt, {				
					groupId: "modifyRows"
				});
			}

			this.executeBatchCall();
			
		},

		validateRow:function(row){

			var error = false;
			if(parseFloat(row.PercPrimoAnno) > 100 || !row.PercPrimoAnno){
				error = true;
			}	
			if(parseFloat(row.PercSecondoAnno) > 100 || !row.PercSecondoAnno){
				error = true;
			}
			if(parseFloat(row.PercTerzoAnno) > 100 || !row.PercTerzoAnno){
				error = true;
			}	
			
			return error;

		},
		
		addRowToDb: function(row){
			var oModel = this.getOwnerComponent().getModel("accantonamenti");			

			var that = this;
			var rowExt = jQuery.extend(true, {}, row);	
			
			//imposto i valori di default

			oModel.create("/ElementoSessioneSet" , rowExt, {				
				success: function(oData, response) {
					var itemsTable = that.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected/items");
					itemsTable.push(this);
					that.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/items", itemsTable);
					console.log("creato con successo l'elemento della sessione");
					MessageBox.success("Riga Creata Con successo.");
					that.handlecloseRowAccantonamento();
				}.bind(rowExt),
				error: function(error) {
					console.log(error);	
				}
			});


		},
		onMenuAction: function(oEvent){
			console.log("ciaoRenzo");
		},

		onPressMatchCodeFragment: function (oEvent) {

			var data = oEvent.getSource().data();	
			var pathObject;
			if(data.From === "Row"){
				//lt salvo l'oggetto su un modello
				pathObject = oEvent.getSource().getParent().getBindingContext("modelHome").sPath;
			}else{
				pathObject = data.Path;
			}		

			if(data.Eliminare){
				data.Eliminare = data.Eliminare.split(',');
			}

			var filtri = [];
			if(data.Filtro){
				data.Filtro = data.Filtro.split(',');
				
				for (let i = 0; i < data.Filtro.length; i++) {
					const element = data.Filtro[i];

					var value = this.getOwnerComponent().getModel("modelHome").getProperty(pathObject + "/"+ element);
					//lt controllo che ci siano i valori per tutti 
					if(!value || value === '' || value === undefined){
						MessageBox.warning("Inserire prima il campo " + element );
						return;
					}

					if(data[element]){
						filtri.push(new Filter({path: data[element] ,operator: FilterOperator.EQ,	value1: value}));				
					}					
				}
			}
			//lt filtri mandatory
			filtri.push(new Filter({path: "FASE"  		, operator: FilterOperator.EQ,	 value1: "DLB"}));
			filtri.push(new Filter({path: "ANNO"  		, operator: FilterOperator.EQ,	 value1: "2023"}));
			filtri.push(new Filter({path: "ATTIVO"		, operator: FilterOperator.EQ, 	 value1: "X"}));
			filtri.push(new Filter({path: "REALE" 		, operator: FilterOperator.EQ,	 value1: "R"}));
			filtri.push(new Filter({path: "VERSIONE" 	, operator: FilterOperator.EQ,	 value1: "D"}));

			this.onSearchTipologiche(filtri, data.EntitySet);
			this.getOwnerComponent().setModel(new JSONModel({
				pathObject : pathObject,
				from : data.From,
				nameSh : data.NameSH,
				property: data.Property,
				eliminare: data.Eliminare
			}),"modelSH");

			var value = data.NameSH;
			if(!this[value]) {
				Fragment.load({
					name:"zsap.com.r3.cobi.s4.accmass.view.fragment." + value,
					controller: this
				}).then(oDialog => {
					this[value] = oDialog;
					this.getView().addDependent(oDialog);
					this[value].open();
				})
			} else {
				this[value].open();
			}
		},

		onSearchTipologiche: function (filters, entitySet) {
			
			var oModel = this.getOwnerComponent().getModel("odataSH");
			var Dateto = new Date(new Date().getFullYear(), 11, 31);
			Dateto.setHours(2);
			var sottostrumentiModel = new JSONModel();
			var oView = this.getView();
			var _filters = filters;
			
			
			var that = this;
			oModel.read("/" + entitySet, {
				filters: _filters,
				success: function(oData, response) {
					that.getOwnerComponent().getModel("shModel").setProperty("/" + this, oData.results);
				}.bind(entitySet),
				error: function(error) {
					console.log(error);	
				}
			});
			
		},

		onPressChoiceStandardlist: function (oEvent) {
			
			var data = oEvent.getSource().data();
			var modelShData = this.getOwnerComponent().getModel("modelSH").getData();

			var itemSelected = oEvent.getParameter("selectedItem").getBindingContext("shModel").getObject();

			var path = modelShData.pathObject + "/" + modelShData.property;
			this.getOwnerComponent().getModel("modelHome").setProperty( path , itemSelected[data.Property]);


			for (let i = 0;modelShData.eliminare && i < modelShData.eliminare.length; i++) {
				const element = modelShData.eliminare[i];
				this.getOwnerComponent().getModel("modelHome").setProperty(  modelShData.pathObject + "/" + element , null);
			}			

		},

		handlecDeleteRow: function(oEvent){
			var table = this.getView().byId("TableDetail");
			var context = table.getSelectedContexts();

			if(context.length === 0){			
				return;
			}

			var item = context[0].getObject();	
			var accantonamentoSelected = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");
			for (let i = 0;accantonamentoSelected.items && i < accantonamentoSelected.items.length; i++) {
				const element = accantonamentoSelected.items[i];
				//if(element.nome === accantonamentoSelected.nome){
				 if(element === item){
					//accantonamentoSelected.items.splice(i, 1);
					accantonamentoSelected.items[i].Cancellato = true;					
					break;
				} 				
			}

			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/items", accantonamentoSelected.items);
			this.getOwnerComponent().getModel("modelHome").refresh(true);
			//table.getModel().refresh(true)
			table.removeSelections(true);
		},

		onSave: function(){
			var that = this;
			var rows = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected/items");
			var rowsStringify = JSON.stringify(rows);
			var bk = this.getOwnerComponent().getModel("accantonamentiModel").getProperty("/Stringify");
			var bkNoStringify = JSON.parse(bk);
			if(rowsStringify !== bk){
					MessageBox.warning(this.getText("messageDetailSave"), {
						actions: [MessageBox.Action.YES, MessageBox.Action.NO],
						onClose: function (oAction) { / * do something * / 
						if(oAction === "YES"){
							//valido prima le righe
							//se sono tutte ok allora posso scrivere quelle cambiate


							//ripristino l'odata da string
							var submitChanges = false;
							var arrayRowToModify = [];
							for (let i = 0;rows && i < rows.length; i++) {
								const element = rows[i];
								//lt controllo se la riga è stata modificata
								var rigaOriginale = $.grep(bkNoStringify, function (n) {
									return n.ProgSessLavoro === element.ProgSessLavoro;
								});
								//confronto le due righe in stringa se sono =
								if(JSON.stringify(element) !== JSON.stringify(rigaOriginale[0])){
									arrayRowToModify.push(element);											
								}
							}
							if(arrayRowToModify.length> 0){
								//dentro le funzioni creo le righe adattate alle chiamate
								var righeValidate = this.validateArrayRow(arrayRowToModify);
								if(righeValidate && righeValidate.length > 0){
									this.modifyRowToDb(righeValidate);
								}else{
									MessageBox.warning("Ci sono delle righe incomplete o con errori. Controllare");
								}
							}

						}
					}.bind(this)
				});						
					
			} else{
				MessageBox.information("Non sono state fatte modifiche");
			}
			
		},

		validateArrayRow: function (array){
			var righeValidate = [];
			for (let i = 0; i < array.length; i++) {
				const element = array[i];										
				var rowExt = jQuery.extend(true, {}, element);
				//imposto i valori di default
				rowExt = this.adaptRow(rowExt);
				var validation = this.validateRow(rowExt);
				if(validation){
					//non effettuo la chiamata
					return false;
				}else{
					righeValidate.push(rowExt)
				}			
			}

			return righeValidate;
		},

		executeBatchCall: function (){

			var oModel = this.getOwnerComponent().getModel("accantonamenti");	
			oModel.submitChanges({
				success: function (batchCallRel) {
					var err = false;
					var response = batchCallRel.__batchResponses

					
					for (let i = 0; i < response.length; i++) {
						const res = response[i];
						if(res.__changeResponses){
							for (let z = 0; z < res.__changeResponses.length; z++) {
								const changeResponse = res.__changeResponses[z];
								if(changeResponse.statusCode !== "204"){
									err = true;
								}								
							}
							
						}else{
							if(res.response && res.response.statusCode !== "201" || res.response.statusCode !== "204"){
								err = true;
							}
						}						
					}

					err !== true ? console.log("errore batch") : console.log("No errori");				
					var stringa = err !== true ? this.getText("successoBatch") : this.getText("erroreBatch");
					err !== true ? MessageBox.information(stringa) : MessageBox.error(stringa);
					
					if(!err) this._onObjectMatched(null, true);

				}.bind(this),
				error: function (oError) {
					console.log(oError);
				}.bind(this)
			});
		},

		changeSelectTaglio: function(oEvent){
			
			var object;
			var from = oEvent.getSource().data().From;
			var selection = oEvent.getSource().getSelectedItem().getBindingContext("modelHome").getObject().VALORE;
			
			if(from === "table"){
				var path = oEvent.getSource().getParent().getBindingContext("modelHome").getPath();
				object = this.getOwnerComponent().getModel("modelHome").getProperty(path);
			}		

			object = this.getOwnerComponent().getModel("modelHome").getProperty("/formRow");

			var valDefPercent = "0.0";
			var valDefAnno = "0000";
			var valDefImporti = "0.00";


			switch (selection) {
				case "LIN":
					object.PrimoAnno = valDefImporti;
					object.SecondoAnno = valDefImporti;
					object.TerzoAnno = valDefImporti;
					object.Obiettivo = valDefImporti;
					object.AnnoDa = valDefAnno;
					object.AnnoA = valDefAnno;
					break;
				case "OBC":
					object.PercPrimoAnno = valDefPercent;
					object.PercSecondoAnno = valDefPercent;
					object.PercTerzoAnno = valDefPercent;
					object.Obiettivo = valDefImporti;
					object.AnnoDa = valDefAnno;
					object.AnnoA = valDefAnno;
					
					break;
				case "PLUR":
					object.PrimoAnno = valDefImporti;
					object.SecondoAnno = valDefImporti;
					object.TerzoAnno = valDefImporti;
					object.PercPrimoAnno = valDefPercent;
					object.PercSecondoAnno = valDefPercent;
					object.PercTerzoAnno = valDefPercent;
					
					break;
			
				default:
					break;
			}

			if(from === "table")this.getOwnerComponent().getModel("modelHome").setProperty("/formRow", object);
			// recuerp l'oggetto this.getOwnerComponent().getModel("modelHome")
		},

		onNavToRoot: function () {		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home");
					
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

		creaModelloLinkSAC: function (url) {
            var oModel = new JSONModel({
                gestioneSac : url
            });
            this.getOwnerComponent().setModel(oModel, "iframe");
            
        },

		onNavToGestione: async function  () {	
			var table = this.getView().byId("TableDetail");
			var context = table.getSelectedContexts();

			if(context.length === 0){	
				MessageBox.warning("Seleziona prima una riga di dettaglio");		
				return;
			}

			var itemSelected = context[0].getObject();

			
			var scrittura = await this.writeAndRetrive(itemSelected);

			
			
			this.getOwnerComponent().getModel("modelHome").setProperty("/ItemHeader", itemSelected);
			var arr = [itemSelected] 
			arr =  arr.concat(arr);
			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/Item", arr);

			var titolo;
			var intro;
			if(itemSelected.Taglio === "OBC"){
				titolo = this.getText("headerTitleObb");
				intro = this.getText("headerIntroObb");
			}else if(itemSelected.Taglio === "LIN"){
				titolo = this.getText("headerTitleLin");
				intro = this.getText("headerTitleLin");
			}else{
				titolo = this.getText("headerTitlePluri");
				intro = this.getText("headerTitlePluri");
			}

			var status= this.getText("statoDefBaseAggredibile");
			var accantonamentoSelected = this.getOwnerComponent().getModel("modelHome").getProperty("/AccantonamentoSelected");
			
			
			var data = {
				"intro": intro,
				"title": titolo,
				"icon" : "sap-icon://target-group",
				"iconAlt" : "sap-icon://target-group",
				"annoI" : "70000.00",
				"annoII" : "0.00",
				"annoIII" : "0.00",
				"annoIV" : "0.00",
				"status" : accantonamentoSelected.statoWf,
				"statusNumber": accantonamentoSelected.Stato, 
				"tipoAccantonamento" : itemSelected.Taglio
			};

			//setto nei dettagli l'header in base all'item selezionato...
			this.getOwnerComponent().getModel("modelHome").setProperty("/HeaderDetail"	, data);
			//lt setto lo stato sul modello che utilizzerò dopo il prototipo
			this.getOwnerComponent().getModel("sessionModel").setProperty("/Status"	, status);
			this.getOwnerComponent().setModel(new JSONModel({}),"modelAccantonamento")

			table.removeSelections(true);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Gestione");
					
		},

		getText: function(label, array) {
			if(array && array.length > 0){
				return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(label, array);
			}
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(label);
		},

		onHelpValueSottoStrumento: function () {
			this.getOwnerComponent().setModel(new JSONModel({esercizio : 2023, tipologia: "STAC"}), "associaSottostrumento");
			if(!this.oDialogHVSottoStrumento) {
				
				Fragment.load({
					name:"zsap.com.r3.cobi.s4.accmass.view.fragment.HelpValueSottostrumento",
					controller: this
				}).then(oDialog => {
					this.oDialogHVSottoStrumento = oDialog;
					this.getView().addDependent(oDialog);
					this.oDialogHVSottoStrumento.open();
				})
			} else {
				this.oDialogHVSottoStrumento.open();
			}
		},
		
		onSottostrumento: function () {
			var oModel = this.getOwnerComponent().getModel("sapHanaS2");
			var Dateto = new Date(new Date().getFullYear(), 11, 31);
			Dateto.setHours(2);
			var sottostrumentiModel = new JSONModel();
			var oView = this.getView();
			//filtri standard
			var _filters = [
				new Filter({
					path: "Dateto",
					operator: FilterOperator.EQ,
					value1: Dateto
				}),
				new Filter({
					path: "Fase",
					operator: FilterOperator.EQ,
					value1: "DLB"
				}),
				new Filter({
					path: "TestoTipo",
					operator: FilterOperator.EQ,
					value1: "VLV"
				})
			];
			//filtri in da form di sottostrumento
			let modelHome = this.getOwnerComponent().getModel("modelHome") //.getProperty("/formSottostrumento")
			if(modelHome.getProperty("/formSottostrumento/esposizione_contabile")){
				_filters.push(new Filter({
					path: "StatEsposizione",
					operator: FilterOperator.EQ,
					value1: modelHome.getProperty("/formSottostrumento/esposizione_contabile")
				}),)
			}
			if(modelHome.getProperty("/formSottostrumento/sottostrumento")){
				_filters.push(new Filter({
					path: "IdSstr",
					operator: FilterOperator.EQ,
					value1: modelHome.getProperty("/formSottostrumento/sottostrumento")
				}),)
			}
			if(modelHome.getProperty("/formSottostrumento/descrizione")){
				_filters.push(new Filter({
					path: "DescrEstesa",
					operator: FilterOperator.EQ,
					value1: modelHome.getProperty("/formSottostrumento/descrizione")
				}),)
			}
			//
			oModel.read("/Gest_PosFin_SottostrumentoSet", {
				filters: _filters,
				success: function(oData, response) {
					oData.results = oData.results.map((item) => {
						item.FkEseStrAnnoEse = Number(item.FkEseStrAnnoEse) + 1
						item.EseAnnoEse = Number(item.EseAnnoEse) + 1
						item.Stato = "Aperto"
						return item
					})
					sottostrumentiModel.setData(oData.results);
					sottostrumentiModel.setSizeLimit(2000);
					oView.setModel(sottostrumentiModel, "sottostrumentiModel");
				},
				error: function(e) {

				}
			});
			if(!this._oDialog){
				this._oDialog = sap.ui.xmlfragment(
					"zsap.com.r3.cobi.s4.accmass.view.fragment.Sottostrumento",
					this);
				this._oDialog.setModel("sottostrumentiModel");
				this.getView().addDependent(this._oDialog);
				this._oDialog.open();
			} else {
				this._oDialog.open();
			}
		},

		
		onPressConfermaSottostrumento: function (oEvent) {
			let modelSottoStrumenti = this.getView().getModel("sottostrumentiModel")
			let sottostrumentoModel = this.getView().getModel("associaSottostrumento")
			let idTableStr = sap.ui.getCore().byId("idTableSottostrumento2")
			let selectedPath = sap.ui.getCore().byId("idTableSottostrumento2").getSelectedContextPaths()[0]
			let selectedItem = modelSottoStrumenti.getProperty(selectedPath)

			if(!selectedItem){
				return;
			}

			sottostrumentoModel.setProperty("/sottostrumento", `${selectedItem.TestoTipo} - ${selectedItem.IdSstr} - ${selectedItem.EseAnnoEse}`);

			sottostrumentoModel.setProperty("/AnnoSstr", `${selectedItem.EseAnnoEse}`);
			sottostrumentoModel.setProperty("/TipoSstr", `${selectedItem.TestoTipo}`);
			sottostrumentoModel.setProperty("/NumeroSstr", `${selectedItem.TestoTipo}`);

			//LT CAMBIO REGISTRO
			var that = this;
	
			sap.m.MessageBox.show(
				"Vuoi Associare?", {
					icon: sap.m.MessageBox.Icon.QUESTION,
					title: "Associa Sottostrumento a Sessione di Lavoro",
					actions: ["Ok","Annulla"],
					onClose: function (sButton) {
						if (sButton === "Ok") {
							//lt forzo il cambio stato e gli mando anche il sottostrumento
							that.cambiaStato("5", true);
							that.oDialogHVSottoStrumento.close();
							that._oDialog.close();
						} else {
							return;
						}
					},
					styleClass: "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer"
				}
			);
			
		},
		
		onClose: function (oEvent) {
			oEvent.getSource().getParent().close()
		},

		onChangeNumberFormat: function(oEvent, model) {
			var sField = oEvent.getSource().getBindingInfo("value").binding.getPath();
			//var sPath = this._findPathNumeric(oEvent.getSource().getBindingInfo("value").binding.getContext().getPath());
			var sPath = oEvent.getSource().getBindingInfo("value").binding.getContext().getPath();
			var sModel = this.getOwnerComponent().getModel("modelHome");
			var num = oEvent.getParameter("value");
			this._onChangeNumberFormat_(sField, num, sPath, sModel);
		},

		_findPathNumeric: function(StringPath) {
			return parseInt(StringPath.split("/")[1], 10);
		},

		_onChangeNumberFormat_: function(sField, num, sPath, sModel) {
			var sValue = formatter.formatterNumber(num);
			//sModel.setProperty("/" + sPath + "/" + sField, sValue);
			sModel.setProperty(sPath + "/" + sField, sValue);
		//	var aVal = sModel.getData();
		//	var sTot = this._calculateTot(aVal, sField);
		//	sModel.setProperty("/1/" + sField, formatter.formatterNumber(sTot));
		}

	});

});