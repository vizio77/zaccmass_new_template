sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";
	return Controller.extend("zsap.com.r3.cobi.s4.accmass.controller.PageFail", {
		onInit: function () {
			var oRouter, oTarget;
			oRouter = this.getOwnerComponent().getRouter();
			oTarget = oRouter.getTarget("PageFail");
			oTarget.attachDisplay(function (oEvent) {
				var data = oEvent.getParameter("data");
				this.getView().byId("errPage").setDescription(data);
			}, this);
		},
		reloadPage: function () {
			location.reload(true); //true dovrebbe svuotare anche la cache
		},
		goBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Home");
		},
        
	});
});