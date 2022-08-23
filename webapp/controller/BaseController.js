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
        }

	});
});