sap.ui.define(["sap/ui/core/format/NumberFormat","sap/ui/core/format/DateFormat"], function(NumberFormat,DateFormat) {
    "use strict";
    return {

        totPotenzaNominale: function (items) {

            let total = 0;
            
            for (let i = 0; i < items.length; i++) {

                if (items[i].Zzpotnom) total += parseFloat(items[i].Zzpotnom);
            }

            return total.toFixed(2);
        },

        totPotenzaFlashList: function (items) {

            let total = 0;
            
            for (let i = 0; i < items.length; i++) {

                if (items[i].Zzpotenza) total += parseFloat(items[i].Zzpotenza);
            }

            return total.toFixed(2);
        },

		formatDataWorkFlow: function(data){

			if(data){
				const dt = DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" });
				const dateFormatted = dt.format(data);
				return dateFormatted;
			}
			
		},

        dateFormatter: function (iDate) {
            
            return (iDate === undefined || iDate === null) ? "" : ((iDate.getMonth()+1).toString().length !== 1 ?
                `${iDate.getDate()}/${iDate.getMonth()+1}/${iDate.getFullYear()}` :
                `${iDate.getDate()}/0${iDate.getMonth()+1}/${iDate.getFullYear()}`);
        },  
        
        formatterNumber: function(sNum) {
			var oLocale = new sap.ui.core.Locale("it-IT");
			var oFormatOptions = {
				"minIntegerDigits": 1,
				"maxIntegerDigits": 20,
				"minFractionDigits": 2,
				"maxFractionDigits": 2
			};
			var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			var oFloatFormatReturn;
			if (sNum.includes(",")) {

				var aTemp = sNum.split(",");
				var sIntergerPart = aTemp[0].replace(".", "");
				var sDecimalPart = aTemp[1];
				if (sIntergerPart === "") {
					sIntergerPart = "0";
				}
				if (sDecimalPart === "") {
					sDecimalPart = "0";
				}
				oFloatFormatReturn = sIntergerPart + "." + sDecimalPart;
				oFloatFormatReturn = oFloatFormat.format(oFloatFormatReturn);
			} else {
				oFloatFormatReturn = oFloatFormat.format(sNum);
			}
			return oFloatFormatReturn;
		},
		formatterNumberOnInit: function(sNum) {
			var oLocale = new sap.ui.core.Locale("it-IT");
			var oFormatOptions = {
				"minIntegerDigits": 1,
				"maxIntegerDigits": 20,
				"minFractionDigits": 2,
				"maxFractionDigits": 2
			};
			var oFloatFormat = NumberFormat.getFloatInstance(oFormatOptions, oLocale);
			var oFloatFormatReturn;
			if (sNum.includes(".")) {

				/* var aTemp = sNum.split(".");
				var sIntergerPart = aTemp[0].replace(".", "");
				var sDecimalPart = aTemp[1];
				if (sIntergerPart === "") {
					sIntergerPart = "0";
				}
				if (sDecimalPart === "") {
					sDecimalPart = "0";
				}
				oFloatFormatReturn = sIntergerPart + "." + sDecimalPart; */
				oFloatFormatReturn = oFloatFormat.format(sNum);
			} else {
				oFloatFormatReturn = oFloatFormat.format(sNum);
			}
			return oFloatFormatReturn;
		},
		iconWf: function (valore) {
			if (valore === 1) {
				return "sap-icon://favorite";
			} else {
				return "sap-icon://person-placeholder";
			}
		},

		statusWf: function (valore) {
			if (valore === 1) {
				return "Warning";
			} else {
				return "";
			}
		},
		StatoTrue: function (valore) {
			if (valore) {
				return "sap-icon://accept";
			} else {
				return "sap-icon://sys-cancel-2";
			}
		},
		ColorTrue: function (valore) {
			if (valore) {
				return "#339933";
			} else {
				return "#cc0000";
			}
		},

		State: function (valore) {
			if (valore) {
				return "Success";
			} else {
				return "Error";
			}
		},

		cpCs: function (valore) {
			if (valore === "CP") {
				return "Competenza";
			} else {
				return "Cassa";
			}
		},

		auth: function (valore) {
			if (valore === "FB") {
				return "Fabbisogno";
			} else {
				return "Obbligo Inderogabile";
			}
		},

		taglio: function (valore) {
			if (valore === "OBC") {
				return "Obiettivo Contabile";
			} else if(valore === "LIN") {
				return "Taglio Lineare";
			}else if(valore === "PLUR") {
				return "Obiettivo Pluriennale";
			}else{
				return "";
			}
		},

		takeStatusDescription: function (valore) {
			var accantonamentiModel = this.getOwnerComponent().getModel("accantonamentiModel");
			var stati = accantonamentiModel.getProperty("/TipoStatiSet");

			var statoRecuperato = $.grep(stati, function (n, i) {
				return n.Stato.toString() === valore.toString();
			});

			if (statoRecuperato && statoRecuperato.length > 0) {
				return statoRecuperato[0].Descrizione;
			} else {
				return "";
			}
		}

    };
});