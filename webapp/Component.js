sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zsap/com/r3/cobi/s4/accmass/model/models",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function(UIComponent, Device , models, JSONModel, Filter, FilterOperator,MessageBox) {
	"use strict";

	return UIComponent.extend("zsap.com.r3.cobi.s4.accmass.Component", {

		metadata: {
			manifest: "json",
			config: {
				fullWidth: true
			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			var that = this;
			that.showBusyIndicator();
			that.initApplication().then(result => {
				that.hideBusyIndicator();
				// enable routing
				that.getRouter().initialize();
			}).catch(err => {
				console.log("app error")
				that.hideBusyIndicator();
				that.getRouter().getTargets().display("PageFail", err);
			}); 
			
		},
		/* * hide busy indicator
		 * 
		 * */
		hideBusyIndicator: function () {
			sap.ui.core.BusyIndicator.hide();
		},
		/* * show busy indicator
		 * 
		 * */
		showBusyIndicator: function () {
			sap.ui.core.BusyIndicator.show(0);
		},

		initApplication: async function () {
			var that = this;

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.setModel(models.createIframeModel(), "iframe");
			this.setModel(new JSONModel({}),"shModel");
			this.initUserModel();
			
			return new Promise(async(resolve, reject) => {
				Promise.all([
							this.__getAnnoFase(),
							//this.initSH(),
							this.initAccantonamenti()
						])
					.then(function(res){
						this.setModel(new JSONModel({Esercizio: res[0]}),"modelFilterHome");
						resolve()
					}.bind(this))
					.catch(err => {
						reject(err)
					})
			});
    	 }, 
		

		initUserModel: function (){
			//var utente = new sap.ushell.Container.getService("UserInfo").getUser();
			var utente = new sap.ushell.Container.getService("UserInfo").getUser().getId();
			var nomeUtente = utente !== "DEFAULT_USER" ? utente : 'L.TARTAGGIA';
			this.setModel(new JSONModel({"user": nomeUtente}),"userModel");

			this.setModel(new JSONModel({faseRicerca: true, infoSottoStrumento: {}}),"modelHome");
			this.setModel(new JSONModel({Esercizio: 2023}),"modelFilterHome");
			this.getModel("modelHome").setProperty("/form",{})
			//lt setto un modello per gestire la visualizzazione dei vari 
			this.setModel(new JSONModel({}),"sessionModel");
			this.setModel(models.createModelModel(), "modelHome");
			
			
		},

		loadJSONTest: function (sPath) {
			return new Promise(async function (resolve, reject) {
			  let oJsonModel = new sap.ui.model.json.JSONModel();
			  await oJsonModel.loadData(sPath, false);
			  resolve(oJsonModel.getData());
			});
		},
		//lt recupero tutti i sh in da visualizzare in ricerca
		initSH: function () {
			this.setModel(new JSONModel({}),"shModel");
			//sap.ui.core.BusyIndicator.show();		
			var odataSh = this.getModel("odataSH");

			var scpDeferredGroups = odataSh.getDeferredGroups();
			scpDeferredGroups = scpDeferredGroups.concat(["scpGroup"]);
			odataSh.setDeferredGroups(scpDeferredGroups);
			var that = this;
			var entityArray = [
				"/ZES_CAL_FIN_SET" // anno fase 
			];
			
			for (var i=0; i<entityArray.length; i++) {
				var entity = entityArray[i];
				var urlParam = {};
				var aFilters = []; 
				if(entity === "/ZES_CAL_FIN_SET") {
					var year = new Date().getFullYear() + 1;
					aFilters.push(new Filter({path: "ANNO" ,operator: FilterOperator.EQ,	value1: year.toString()}));
				}		
					odataSh.read(entity,	  {groupId: "scpGroup", urlParameters: urlParam, filters: aFilters });
		
        	}
        	return new Promise( (resolve, reject) => {
			//console.log("provo la chiamata")

			odataSh.submitChanges({
				success: function (batchCallRel) {
					var errore = false;
					var entitiesInError = "";
					for (var j = 0; batchCallRel.__batchResponses && j < batchCallRel.__batchResponses.length; j++) {
						var propertyToSave = this[j];	
						if (batchCallRel.__batchResponses[j].statusCode === "200") {
								
							//console.log("propertyToSave")		
							//console.log(batchCallRel.__batchResponses[j].data.results.length)	
							that.getModel("shModel").setProperty(propertyToSave, batchCallRel.__batchResponses[j].data.results);						
							
						}else{

							var entity = propertyToSave.split('_')[1]; 
							entitiesInError = entitiesInError + "\n" + entity;
							errore = true;
						}
						resolve()
					}
					if(errore){
							sap.ui.core.BusyIndicator.hide();
							MessageBox.error("Errore recupero di alcune entities: \n" + entitiesInError);
							//return;
							reject()
					}
					sap.ui.core.BusyIndicator.hide();
				}.bind(entityArray),
				error: function (oError) {
					reject()
					//console.log("errore")
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("errorChiamataBatchInit"));
					return;
				}.bind(entityArray)
			});

		})

		},
		initAccantonamenti: function () {
			this.setModel(new JSONModel({}),"accantonamentiModel");
			//sap.ui.core.BusyIndicator.show();		
			var accantonamenti = this.getModel("accantonamenti");

			var scpDeferredGroups = accantonamenti.getDeferredGroups();
			scpDeferredGroups = scpDeferredGroups.concat(["scpGroup"]);
			accantonamenti.setDeferredGroups(scpDeferredGroups);
			var that = this;
			var entityArray = [
			//	"/SessioneLavoroSet",
				"/StatoSessioneSet",
				"/TipoStatiSet",
				"/ElementoSessioneSet"						
			];
			
			for (var i=0; i<entityArray.length; i++) {
				var entity = entityArray[i];
				var urlParam = {};
				if(entity === "/SessioneLavoroSet"){
					urlParam = { "$expand" : "SessioneLav_StatiSessioni,SessioneLav_ElementoSessione"};
				}
				accantonamenti.read(entity,	  {groupId: "scpGroup", urlParameters: urlParam });
        	}
        	
		

			accantonamenti.submitChanges({
				success: function (batchCallRel) {
					var errore = false;
					var entitiesInError = "";
					for (var j = 0; batchCallRel.__batchResponses && j < batchCallRel.__batchResponses.length; j++) {
						var propertyToSave = this[j];	
						if (batchCallRel.__batchResponses[j].statusCode === "200") {
							
							if("/TipoStatiSet") batchCallRel.__batchResponses[j].data.results.unshift({"Descrizione" : "", "Stato" : ""});
							//console.log("propertyToSave")		
							//console.log(batchCallRel.__batchResponses[j].data.results.length)	
							that.getModel("accantonamentiModel").setProperty(propertyToSave, batchCallRel.__batchResponses[j].data.results);						
							
						}else{

							var entity = propertyToSave.split('_')[1]; 
							entitiesInError = entitiesInError + "\n" + entity;
							errore = true;
						}
					}
					if(errore){
							sap.ui.core.BusyIndicator.hide();
							MessageBox.error("Errore recupero di alcune entities: \n" + entitiesInError);
							//return;
					}
					sap.ui.core.BusyIndicator.hide();
				}.bind(entityArray),
				error: function (oError) {
					//console.log("errore")
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(that.getView().getModel("i18n").getResourceBundle().getText("errorChiamataBatchInit"));
					return;
				}.bind(entityArray)
			});

		},

		__getAnnoFase: function () {
			var that = this;
			let modelTopologiche = this.getModel("odataSH")  
			return new Promise((resolve, reject) => {
			  modelTopologiche.read("/ZES_CAL_FIN_SET",{
				  filters: [new Filter("FASE", FilterOperator.EQ, "F")],
				  success: (oData) => {
					  that.getModel("accantonamentiModel").setProperty("/Anno", oData.results[0].ANNO);
					  resolve(oData.results[0].ANNO)
				  },
				  error: (oData) => {
					  console.log("errore recupero")
					  resolve("2023")
				  }
  
			  })
			})
		  },
	});
});