/* global nv:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
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
	"sap/m/Button"
], function (Controller, JSONModel, History,  Filter, FilterOperator, formatter, MessageBox, MessageToast, Dialog, Text, MaskInput,
	TextArea, Label, Button) {
	"use strict";

	return Controller.extend("zsap.com.r3.cobi.s4.accmass.controller.Gestione", {
		formatter: formatter,

		onInit: function () {
			//così parte ogni volta la preparazione dei modelli
			this.getOwnerComponent().getRouter().getRoute("Gestione").attachPatternMatched(function () {
				
				this.ricalcolaTotali();

			}.bind(this), this);
			this.preparaModello();
    	},

		onAfterRendering: function() {
			//this.functionTemp();			
		},

		functionTemp: function() {
			this.preparaModello();
		},

		preparaModello: function(){

			var start= 2023;
			var end = 2122;

			var nAnni = (end - start) + 1;
			var anni=[];
			var obj = {};
			var gestioneAccantonamento = this.getOwnerComponent().getModel("modelHome").getProperty("/GestioneAccantonamento");
			for (let i = 0; i < nAnni; i++) {
				const element = nAnni[i];
				var yearSelect= start + i;
				obj[yearSelect.toString()] = false;
				anni.push({
					anno : yearSelect,
					col1 : this.getText("disponibilitaAnno") + " " + yearSelect.toString(),
					col2 : this.getText("accantonamentoAnno") + " " + yearSelect.toString(), 
				});								
			
				for (let z = 0; z < gestioneAccantonamento.length; z++) {
					const rowAccantonamento = gestioneAccantonamento[z];

					
					var randomNumber = Math.floor(Math.random() * (60000 - 20000)) + 20000;
					randomNumber = randomNumber.toFixed(2);

				if(yearSelect.toString() !== "2023" && yearSelect.toString() !== "2024" && yearSelect.toString() !== "2025" && yearSelect.toString() !== "2026"){
					//rowAccantonamento["dispAnno" + yearSelect.toString()] = randomNumber;
					
				}
				//lt mokup obb. pluriennale
				if(yearSelect.toString() !== "2027" && yearSelect.toString() !== "2028" && yearSelect.toString() !== "2029" && yearSelect.toString() !== "2030"){
					//rowAccantonamento["dispAnno" + yearSelect.toString()] = randomNumber;
					
				}

				//lt decommentare per eliminare i dati
				//rowAccantonamento["dispAnno" + yearSelect.toString()] = "";
				//rowAccantonamento["totAccantonamentoAnno" + yearSelect.toString()] = "";
					
					
				}

			}

			this.getOwnerComponent().getModel("modelHome").getProperty("/GestioneAccantonamento", gestioneAccantonamento);

			var modello = {colonne : anni, start : start, end : end, nAnni : nAnni, arrows : {"Dx" : true,"Sx" : false, "Initial" : false}};

			var periodi = this.createSelectPeriod(modello);

			modello.periodi = periodi;
			modello.periodoSelected = modello.periodi[0].array;
			modello.periodoSelectedKey = "0";

			var objDataKeys = Object.keys(obj);
			for (let i = 0; i < objDataKeys.length; i++) {
				const element = objDataKeys[i];
				obj[element] =  modello.periodoSelected.indexOf(element) !== -1 ? true : false;		
			}
			this.getOwnerComponent().setModel(new JSONModel(obj), "visibilityColumnModel");
			this.getOwnerComponent().setModel(new JSONModel(modello), "colonneModel");
			this.ricalcolaTotali();

			
			this.addCol("TableGestioneDetail", "idColumnListItemsGestione", "colonneModel");

		},

		createSelectPeriod: function(modello){

			var numberOfPeriod = parseInt(modello.nAnni / 4);
			var resto = modello.nAnni%4;
			var restoPresente = resto === 0 ? false : true;

			var primoValore = modello.start;
		
			var periodi = [];
			
			if(numberOfPeriod !== 0){
				for (let i = 0; i < numberOfPeriod; i++) {			
					var arrayPeriod = [];
					for (let z = 0; z < 4; z++) {
						var stringa = primoValore + z;
						arrayPeriod.push(stringa.toString());						
					}
					primoValore = stringa + 1;
					periodi.push(arrayPeriod.toString());
					
					if(restoPresente && i === (numberOfPeriod - 1)){
						arrayPeriod = [];
						for (let j = 0; j < resto; j++) {
							var stringa = primoValore + j;						
							arrayPeriod.push(stringa.toString());						
						}
						periodi.push(arrayPeriod.toString());
						
					}
				}
			}else{
				var arrayPeriod = [];
				for (let j = 0; j < resto; j++) {
					var stringa = primoValore + j;						
					arrayPeriod.push(stringa.toString());						
				}
				periodi.push(arrayPeriod.toString());
				
			}

			var objectPeriodo = [];
			for (let i = 0; i < periodi.length; i++) {
				const periodo = periodi[i];				

				objectPeriodo.push({
					key : i,
					value : periodo.split(",").join("-"),
					array : periodo.split(",")
				});			
			}

			return objectPeriodo;
		},


		setPeriod: function(oEvent){
			var period = oEvent.getSource().getSelectedItem();
			var periodSelected = period.getBindingContext("colonneModel").getObject();
			this.changePeriod(periodSelected);
		},
		//setto visibilità periodo
		changePeriod: function(periodSelected){			

			var visibilityColumnModel = this.getOwnerComponent().getModel("visibilityColumnModel");
			var obj = visibilityColumnModel.getData();			

			var objDataKeys = Object.keys(obj);
			for (let i = 0; i < objDataKeys.length; i++) {
				const element = objDataKeys[i];
				obj[element] =  periodSelected.array.indexOf(element) !== -1 ? true : false;		
			}

			this.getOwnerComponent().setModel(new JSONModel(obj), "visibilityColumnModel");
			this.btnAttowVisibility(periodSelected);
			this.ricalcolaTotali();

		},

		btnAttowVisibility: function(periodSelected){
			var periodi = this.getOwnerComponent().getModel("colonneModel").getProperty("/periodi");
			var checkPulsanti = this.getOwnerComponent().getModel("colonneModel").getProperty("/arrows");


			if(periodSelected.key === (periodi.length -1)){
				checkPulsanti.Initial = true;
				checkPulsanti.Sx=true;
				checkPulsanti.Dx=false; 
			}else if(periodSelected.key === 0){
				checkPulsanti.Initial = false;
				checkPulsanti.Sx=false;
				checkPulsanti.Dx=true; 
			}else if(periodSelected.key !== 0 && periodi.length){
				checkPulsanti.Initial = true;
				checkPulsanti.Sx=true;
				checkPulsanti.Dx=true;
			}

			this.getOwnerComponent().getModel("colonneModel").setProperty("/arrows" , checkPulsanti);

		},

		onPressChangeArrow:function(oEvent){
			
			var colonneModelData =  this.getOwnerComponent().getModel("colonneModel").getData()
			var listPeriod = colonneModelData.periodi;
			var periodSelected = parseInt(colonneModelData.periodoSelectedKey);

			var tipoBottone = oEvent.getSource().data().Arrow
			var newPeriod;
			var setNewPeriod;
			switch (tipoBottone) {
				case "Dx":
						if((periodSelected + 1) > listPeriod.length )	return;
						setNewPeriod = periodSelected + 1;
						
					break;
				case "Sx":
						if((periodSelected - 1) < 0 )	return;
						setNewPeriod = periodSelected - 1;
						newPeriod = listPeriod[periodSelected - 1];
					break;
				case "Initial":
						if((periodSelected + 1) > listPeriod.length )	return;
						setNewPeriod = 0;						
					break;			
				default:
					break;
			}

			newPeriod = listPeriod[setNewPeriod];
			this.getOwnerComponent().getModel("colonneModel").setProperty("/periodoSelectedKey", setNewPeriod.toString());
			this.changePeriod(newPeriod);
		},

		addCol: function(sIdTable, sIdColumnListItem, sModel) {
			var that = this;
			var ownerComp = that.getOwnerComponent().getModel("colonneModel"),
			visibilityModel = that.getOwnerComponent().getModel("visibilityColumnModel");
			/* var sTable = this.getView().byId(sIdTable),
				sAnnoKey, sAnnoValue, intEsercizio = parseInt(ownerComp.getProperty("/modelTestata") === undefined ? ownerComp.getProperty(
					"/Esercizio") : ownerComp.getProperty("/modelTestata").getProperty("/Esercizio"), 10),
				sRecord = {},
				arrRelYear = []; */
				var sTable = this.getView().byId(sIdTable),
				sAnnoKey, sAnnoValue, intEsercizio ,
				sRecord = {},
				arrRelYear = [];

			var dataModel = ownerComp.getData();
			var visibilityData= visibilityModel.getData();
			var j = 1;

			//aggiungo le covlonne
			for (var i = 0; i <= dataModel.colonne.length ; i++) {
				var column = dataModel.colonne[i]
				if (i === dataModel.colonne.length) {
					var button = new sap.m.Button({
						icon: "sap-icon://navigation-right-arrow",
						press: function(oEvent) {
							that.onPressChangeArrow(oEvent);
						},
						type: sap.m.ButtonType.Emphasized,
						enabled: "{colonneModel>/arrows/Dx}"						
					});

					button.data("Arrow", "Dx");

					sTable.addColumn(new sap.m.Column({
						header: button,
						width: "1rem",						
						/* visible: "{= ${modelVisibleColumn>/FINAL_Range} === '' ? false : true }" */
						visible : true
					}));

					this.getView().byId(sIdColumnListItem).addCell(
						new sap.m.Input({
							value: "{modelHome>motivazione}",
							//value: "",
							textAlign: "Right",
							change: function(oEvent) {
								//that.onChangeNumberFormat(oEvent);
							},
							editable : false,
							visible : false
						})); 

					sTable.addColumn(new sap.m.Column({
						header: new sap.m.Text({
							text: "Motivazione",
							class:"boldCss"
								// text: "{modelForYear>/Anno" + j.toString() + "}"
						}),
						width: "10rem",
						//,
						//visible: "{modelVisibleColumn>/" + sAnnoKey + "}",
						visible: "{= ${visibilityModel>/stato} !== '1' && ${visibilityModel>/stato} !== '3' && ${visibilityModel>/stato} !== '2' && ${visibilityModel>/stato} !== '6' && ${visibilityModel>/stato} !== '7'}",
						hAlign: "Center"
					}));

					this.getView().byId(sIdColumnListItem).addCell(
						new sap.m.Input({
							value: "{modelHome>motivazione}",
							//value: "",
							textAlign: "Right",
							change: function(oEvent) {
								//that.onChangeNumberFormat(oEvent);
							},
							editable : "{= ${visibilityModel>/stato} === '4' && ${modelHome>comprimibile} === true}",
							visible : "{= ${visibilityModel>/stato} !== '1' && ${visibilityModel>/stato} !== '3' && ${visibilityModel>/stato} !== '2' && ${visibilityModel>/stato} !== '6' && ${visibilityModel>/stato} !== '7'}"
						})); 

						sTable.addColumn(new sap.m.Column({
							header: new sap.m.Text({
								text: "Motivazione Esito Negativo",
								class:"boldCss"
									// text: "{modelForYear>/Anno" + j.toString() + "}"
							}),
							width: "10rem",
							//,
							//visible: "{modelVisibleColumn>/" + sAnnoKey + "}",
							visible: "{= ${visibilityModel>/stato} === '7' || ${visibilityModel>/stato} === '6'}",
							hAlign: "Center"
						}));
	
						this.getView().byId(sIdColumnListItem).addCell(
							new sap.m.Input({
								value: "{modelHome>motivazioneCalata}",
								//value: "",
								textAlign: "Right",
								change: function(oEvent) {
									//that.onChangeNumberFormat(oEvent);
								},
								editable : false,
								visible : "{= ${visibilityModel>/stato} === '7' || ${visibilityModel>/stato} === '6'}"
							})); 
					
				} else {

					//array contenente il periodo...
					//dataModel.periodoSelected;

					//let columnVisible = dataModel.periodoSelected.indexOf(column.toString()) !== -1 ? true : false;

					sAnnoKey = "ANNO" + j.toString();
					sTable.addColumn(new sap.m.Column({
						header: new sap.m.Text({
							text: column.col1,
							class:"boldCss"
								// text: "{modelForYear>/Anno" + j.toString() + "}"
						}),
						width: "7rem",
						//,
						//visible: "{modelVisibleColumn>/" + sAnnoKey + "}",
						visible: "{visibilityColumnModel>/" + column.anno.toString() + "}",
						hAlign: "Center"
					}));

					this.getView().byId(sIdColumnListItem).addCell(
						new sap.m.Input({
							value: "{modelHome>dispAnno"  + column.anno.toString() + "}",
							//value: "",
							textAlign: "Right",
							change: function(oEvent) {
								//that.onChangeNumberFormat(oEvent);
							},
							editable : false,
							visible : true
							/* editable: "{= ${" + sModel + ">DispAmm} === 'Importo Assegnazione' || ${" + sModel +
								">DispAmm} === 'Disponibilità Amministrazione' ? false : true && ${modelInfoSelected>/StatoDecreto} === 'PR' ? true : false || ${modelInfoSelected>/StatoDecreto} === 'In Bozza' ? true : false }" */
						})); 

					sTable.addColumn(new sap.m.Column({
						header: new sap.m.Text({
							text: column.col2,
							class:"boldCss"
								// text: "{modelForYear>/Anno" + j.toString() + "}"
						}),
						width: "7rem",
						//visible: "{modelVisibleColumn>/" + sAnnoKey + "}",
						visible: "{visibilityColumnModel>/" + column.anno.toString() + "}",
						//class:"boldCss",
						hAlign: "Center"
					}));

					//sRecord[intEsercizio + i] = sAnnoKey;
					this.getView().byId(sIdColumnListItem).addCell(
						new sap.m.Input({
							value: "{modelHome>totAccantonamentoAnno"  + column.anno.toString() + "}",
							//value: "{" + sModel + ">Importo" + j.toString() + "}",
							//value: "",
							textAlign: "Right",
							change: function(oEvent) {
								//that.onChangeNumberFormat(oEvent);
							},
							editable : "{= ${visibilityModel>/stato} === '3' && ${modelHome>comprimibile} === true}",
							visible : true
							/* editable: "{= ${" + sModel + ">DispAmm} === 'Importo Assegnazione' || ${" + sModel +
								">DispAmm} === 'Disponibilità Amministrazione' ? false : true && ${modelInfoSelected>/StatoDecreto} === 'PR' ? true : false || ${modelInfoSelected>/StatoDecreto} === 'In Bozza' ? true : false }" */
						})); 
					 

					j++;
				}
			}

			ownerComp.refresh();
			//var log="tst";
			//this.getView().setModel(new JSONModel(sRecord), "modelYearsRel");
		},

        _onObjectMatched: function (oEvent) {

			this.preparaModello();
				
        
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
                "AnnoDa": "", 
                "AnnoA": "",
                "PercPrimoAnno" : "",
                "PercSecondoAnno" : "",
                "PercTerzoAnno" : "",
                "PrimoAnno" : "",
                "SecondoAnno" : "",
                "TerzoAnno" : "",
                "ADecorrere": "",
                "AllaCassa": ""
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
			this.handlecloseRowAccantonamento();
			/* var form = this.getOwnerComponent().getModel("modelHome").getProperty("/form");
			var accantonamenti = this.getOwnerComponent().getModel("modelHome").getProperty("/ListaAccantonamenti");

			accantonamenti.push(form);

			this.getOwnerComponent().getModel("modelHome").setProperty("/ListaAccantonamenti", accantonamenti);

			this.handlecloseRowAccantonamento(); */
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
				 if(element.nome === accantonamentoSelected.nome){
					accantonamentoSelected.items.splice(i, 1);
					break;
				} 				
			}

			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/items", accantonamentoSelected.items);
			table.removeSelections(true);
		},

		onNavToRoot: function () {		
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("RouteView");
					
		},

		onNavToDetail: function () {
			
			//this.resetTable();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getOwnerComponent().getModel("modelHome").setProperty("/AccantonamentoSelected/Item", []);
			oRouter.navTo("Detail");
					
		},
		//lt ricalcolo ogni volta che modifico il modello per la visualizzazione dei totali nell'header...
		
		ricalcolaTotali: function(){
			//modelHome>/GestioneAccantonamento
			var annoI = "0";
			var annoII = "0";
			var annoIII = "0";
			var annoIV = "0";

			var arrayAnnni = ["annoI","annoII","annoIII","annoIV"];

			var colonneModel = this.getOwnerComponent().getModel("colonneModel");
			//vedo che periodo è segnato...

			if(!colonneModel){
				console.log("Non c'è il modello riga 'ricalcolaTotali");
				return;
			}

			var colonneModelData = colonneModel.getData();
			//per ogni anno del periodo effettuo il recupero della disponibilità
			//var periodoSelected = colonneModelData.periodoSelected;
			//salvo la disponibilità risultante per ogni anno

			//lt resetto le scritte per ebitare bug con meno periodi
			var that = this;
			arrayAnnni.forEach(element => {
				that.getOwnerComponent().getModel("modelHome").setProperty("/HeaderDetail/"+element+ "Desc" , "Tot. Disponibilità anno N/D");
				that.getOwnerComponent().getModel("modelHome").setProperty("/HeaderDetail/"+element, "0");
			});


			var periodoSelected = colonneModelData.periodi[parseInt(colonneModelData.periodoSelectedKey)];

			var items =	this.getOwnerComponent().getModel("modelHome").getProperty("/GestioneAccantonamento");

			 for (let z = 0; z < periodoSelected.array.length; z++) {
				const periodo = periodoSelected.array[z];		
	
				var somma = 0;
				for (let i = 0; i < items.length; i++) {
					const element = items[i];
					
					if(element.comprimibile){					
						somma = parseFloat(somma) + parseFloat(element["dispAnno"+periodo]);
					}
				}

				this.getOwnerComponent().getModel("modelHome").setProperty("/HeaderDetail/"+arrayAnnni[z] + "Desc" , "Tot. Disponibilità "+periodo);
				this.getOwnerComponent().getModel("modelHome").setProperty("/HeaderDetail/"+arrayAnnni[z] + "Acc" , "Tot. Accantonamento " + periodo);
				this.getOwnerComponent().getModel("modelHome").setProperty("/HeaderDetail/"+arrayAnnni[z], somma.toFixed(2));
			}

		},

		//lt 20220531 rimuovo al clear le colonne che ho aggiunto in più
        resetTable: function(){
            var table = this.getView().byId("TableGestioneDetail");
            //table.setVisible(false);
            
            var nColumnStd = 6;
            var nColumd = table.getColumns().length;
            while (nColumd > nColumnStd) {  
                nColumd = table.getColumns().length -1;               
                table.removeColumn(nColumd);    
            }
        },

		test: function(){
            this.resetTable();
        },

		test2: function(){
			this.preparaModello();
		},
		
		getText: function(label) {

			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(label);
		}

	});

});