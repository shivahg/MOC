sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/json/JSONModel",
	
	"sap/ui/unified/library",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter"
], function (Controller, DateFormat, JSONModel, Formatter,unifiedLibrary, MessageToast,MessageBox,Fragment,Filter) {
	"use strict";

	return Controller.extend("ZCCM.ZCCM.controller.Homepage", {
		onInit: function (evt) {
			var obj={
					busy:false,
					delay:0,
					oHistoryItems:[]
					};
					var mocmodel=new sap.ui.model.json.JSONModel();
					mocmodel.setData(obj);
					this.getView().setModel(mocmodel,"mocmodel");
					var mode="";
					var compData=this.getOwnerComponent().getComponentData();
					if(compData){
						var sParam=compData.startupParameters;
						if(sParam&&sParam.loginmode[0]){
							mode=sParam.loginmode[0];
						}
					}
					mocmodel.setProperty("/loginMode",mode);
					
			
					
					var oRouter=new sap.ui.core.UIComponent.getRouterFor(this);
					
					
					
					oRouter.getRoute("Homepage").attachPatternMatched(this.onObjectMatched, this);
						this.getmocdatapassesHistoryData();			
					},
					
					onObjectMatched:function(evt){
						var obj={
								busy:false,
								delay:0,
								oHistoryItems:[]
								};
								var mocmodel=new sap.ui.model.json.JSONModel();
								mocmodel.setData(obj);
								this.getView().setModel(mocmodel,"mocmodel");
								var mode="";
								var compData=this.getOwnerComponent().getComponentData();
								if(compData){
									var sParam=compData.startupParameters;
									if(sParam&&sParam.loginmode[0]){
										mode=sParam.loginmode[0];
									}
								}
								mocmodel.setProperty("/loginMode",mode);
								this.getmocdatapassesHistoryData();	
						
					},
					getmocdatapassesHistoryData:function(e){
						var mocmodel=this.getView().getModel("mocmodel");
						
						
     					
						var mode= mocmodel.getProperty("/loginMode");
						var oFilters=[];

						if(mode=="E"){
							oFilters.push(new sap.ui.model.Filter("Zparameter","EQ","E"));
						
							
						}else if(mode=="A"){
							oFilters.push(new sap.ui.model.Filter("Zparameter","EQ","A"));
							
							this.getView().byId("Employeecreate").setVisible(false);
						}
						var that=this;
						var oModel=this.getView().getModel();
						mocmodel.setProperty("/busy",true);
						var dashboardurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
		                     dashboardurl.read("/zhr_t_mocSet/",{filters:oFilters,
		                    	 success:function(oData,oResponse){
		         					mocmodel.setProperty("/busy",false);
		         					
		         					mocmodel.setProperty("/oHistoryItems",oData.results);
		         					that.data=oData.results;
		         					
		         				}.bind(this),error:function(err){
		         					mocmodel.setProperty("/busy",false);
		         					MessageBox.error(JSON.parse(err.responseText).error.message.value);
		         				}.bind(this)});
			},
			
		
		navigatemocformcreate:function(oEvent){
			var t=this;
			
			var oRouter=this.getOwnerComponent().getRouter();
			oRouter.navTo("mocform",{m:"E",savsub:"C"});
		},
		goApproverdata:function(evt){
		
			var mocnumber=evt.oSource.mProperties.text;
            for(var i=0;i<this.data.length;i++){
            	if(this.data[i].MocNum === mocnumber){
            		var savsub=this.data[i].Savsub;
            	}
            }
			var oRouter=this.getOwnerComponent().getRouter();
			oRouter.navTo("mocform",{m:mocnumber,savsub:savsub});
		},
		  onSearch:function(oEvent){
				
				   var sQuery = oEvent.getParameter("query");
					if(oEvent.getId() == "liveChange"){
						sQuery = oEvent.getParameter("newValue");
					}
					var oFilter1=new sap.ui.model.Filter("MocNum","Contains",sQuery);
					var oFilter2=new sap.ui.model.Filter("Pernr","Contains",sQuery);
					var oFilter3=new sap.ui.model.Filter("EmpNameId","Contains",sQuery);
					var oFilter4=new sap.ui.model.Filter("Dept","Contains",sQuery);
					var oFilter5=new sap.ui.model.Filter("Status","Contains",sQuery);
					
					var aFilters=new sap.ui.model.Filter([oFilter1,oFilter2,oFilter3,oFilter4,oFilter5]);
					var oTable=this.byId("tb1");
					var oBinding=oTable.getBinding("items");
					if(oBinding){
						oBinding.filter([aFilters]);
					}
			   },
		onAfterRendering:function(){
			var model=this.getView().getModel("mocmodel");
				model.refresh(true);
		}
				
	});
});

