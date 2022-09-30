sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/unified/FileUploader",
	"sap/m/MessageBox"
], function (Controller,JSONModel,MessageToast,FileUploader,MessageBox) {
	"use strict";

	return Controller.extend("ZCCM.ZCCM.controller.mocform", {
		onInit: function (evt) {
			var oRouter=new sap.ui.core.UIComponent.getRouterFor(this);
	          oRouter.getRoute("mocform").attachPatternMatched(this.onObjectMatched,this);
	          var t=this; t.obj={};var aarr=[]; t.mocnumber,t.fobj={},t.farr=[];
	         
	          t.datamodel=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
	    
	    
	      	
	      t.actarr=[];t.actobj={};
	     t.mocempdata=new sap.ui.model.json.JSONModel();
	    
	  
	     var obj={
					
					
					empdetails:[],
					actiontable:[],
					checklisttable:[],
					Approverstable:[]
			};
			var mocmodel=new JSONModel(obj);
			this.getView().setModel(mocmodel,"mocmodel");
			
			var mode;
			var compData=this.getOwnerComponent().getComponentData();
			if(compData){
				var sParam=compData.startupParameters;
				if(sParam && sParam.loginmode){
					mode=sParam.loginmode[0];
				}
			}
		mocmodel.setProperty("/loginMode",mode);
		  
		var mocmodel=this.getView().getModel("mocmodel");
		mocmodel.refresh(true);
		},
		onObjectMatched:function(evt){
			var t=this;
			
			var significant=this.getView().byId("significant");
			
			t.mocnumber=evt.getParameter("arguments").m;
			var sav_sub=evt.getParameter("arguments").savsub;
			var dobj={};
			var mocmodel=this.getView().getModel("mocmodel");
			mocmodel.setProperty("/Sav_sub",sav_sub);
			mocmodel.setProperty("/empdetails",[]);
			mocmodel.setProperty("/actiontable",[]);
			mocmodel.setProperty("/checklisttable",[]);
			mocmodel.setProperty("/Approverstable",[]);
			mocmodel.setProperty("/Historytable",[]);
			mocmodel.setProperty("/fileupload",[]);
			mocmodel.setProperty("/changetypedata",[]);
			///////////////////mocdate//////////////////
		/*	 var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
         	var mocdate = frmt.format(new Date());*/
			var obj={};
			obj.MocDate=new Date();
			mocmodel.setProperty("/empdetails",obj);
			var changetypeurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			if(mocmodel.oData.loginMode !== "E"){
				
				this.getView().byId("actiontable").resetProperty("mode", "");
			
			 changetypeurl.read("/zhr_t_mocSet('"+t.mocnumber+"')?$expand=zhr_t_moc_actionSet,zhr_t_moc_checkSet,zhr_t_moc_commSet,ZHR_T_MOC_APPROVSet",{
				 success:function(data){
					 var data=data;
				
					/* var frmt1 = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
	                	var d1 = frmt1.format(new Date(data.MocDate));
					 data.MocDate=d1;*/
					 data.MocDate=new Date(data.MocDate);
					 if((data.DateFrom!==null)&&(data.DateTo!==null)){
					/* var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
	                	var d = frmt.format(new Date(data.DateFrom));
					    var d2=frmt.format(new Date(data.DateTo));*/
					data.DateFrom=new Date(data.DateFrom);
					data.DateTo=new Date(data.DateTo);
					var plant=data.Werks;
					var bukrs=data.Bukrs;
					var significant=data.Significant;
					mocmodel.setProperty("/empdetails",data);
					 }else{
						 var plant=data.Persarea;
							var bukrs=data.Bukrs;
							var significant=data.Significant;
					mocmodel.setProperty("/empdetails",data);
					 }
					   var orgdatadetails=mocmodel.getProperty("/empdetails");
						var data=t.getView().getModel("mocmodel").getData().empdetails;
						var empapprovalurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
						empapprovalurl.read("/Approvers_tableSet/?$filter=Werks eq '"+plant+"' and Bukrs eq '"+bukrs+"' and Significant eq '"+significant+"' and MocNum eq '"+t.mocnumber+"'",{
							success:function(odata){
								
									
								
								var array=[];
								var emporgdata=odata.results;
								
								
									for(var i=0;i<emporgdata.length;i++){
										delete emporgdata[i].__metadata;
										
										array.push(emporgdata[i]);
									
									var orgtable=array;
									
									mocmodel.setProperty("/orgapprtable",orgtable);
								}
								
							},
							error:function(error){
								
								var message=error;
								var msg=$(error.response.body).find('message').first().text();
								var action="OK";
								MessageBox.error(msg,{
									
									onClose:function(){
										if(action==="OK"){
											var oRouter=t.getOwnerComponent().getRouter();
	                              oRouter.navTo("Homepage");
										}
									}
								});
							}
							
						})
					//////////////////actiontable data///////////////

					/*var actiontable=mocmodel.getProperty("/actiontable");*/

			 var actiontabledata=data.zhr_t_moc_actionSet.results;
			 for(var i=0;i<actiontabledata.length;i++){
				 if(actiontabledata[i].TargetDate===null){
					 actiontabledata[i].TargetDate=null;
				 }
				 else{
				  	actiontabledata[i].TargetDate=new Date(actiontabledata[i].TargetDate);
				 }

				  
				  

				  }
                mocmodel.setProperty("/actiontable",actiontabledata);
                ////////////////////////////////////////////////////////////
                
                /*var checklisttable=mocmodel.getProperty("/checklisttable");*/

   			 var checklisttabled=data.zhr_t_moc_checkSet.results;
   			
                   mocmodel.setProperty("/checklisttable",checklisttabled);
                   
                   /////////////////////////////////////////////
                   
                 /*  var Approverstable=mocmodel.getProperty("/Approverstable");*/

         			 var Approverstabled=data.ZHR_T_MOC_APPROVSet.results;
         			
                         mocmodel.setProperty("/Approverstable",Approverstabled);
                         
                         //////////////Historytable/////////////////
                         
                         var arr=[];
                         var Historytable=data.zhr_t_moc_commSet.results;
                         for(var i=0;i<Historytable.length;i++){
                        	 Historytable[i].Zdate=new Date(Historytable[i].Zdate);
              			delete Historytable[i].__metadata;
              			arr.push(Historytable[i]);
                         }
                         mocmodel.setProperty("/Historytable",arr);
			}
			      
			 
			 });
			 
			 var t=this;
		        t.getView().getModel("mocmodel").setProperty("/fileupload");
		        var oGlobalBusyDialog = new sap.m.BusyDialog();
                oGlobalBusyDialog.open();
			var filedownloadurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			filedownloadurl.read("/ZHR_T_MOC_ATTACHSet/?$filter=MocNum eq '"+t.mocnumber+"'",{
				 success:function(odata){
					 
					 
					var data=odata.results;
					var array=[];
				
					
					
						for(var i=0;i<data.length;i++){
							delete data[i].__metadata;
							
							array.push(data[i]);
						
						var file=array;
						
						mocmodel.setProperty("/fileupload",file);
					}
						oGlobalBusyDialog.close();
						 },
				 error:function(evt){
					 
					 var message=error;
						var msg=$(error.response.body).find('message').first().text();
						var action="OK";
						MessageBox.error(msg,{
							
							onClose:function(){
								if(action==="OK"){
									var oRouter=t.getOwnerComponent().getRouter();
                          oRouter.navTo("Homepage");
								}
							}
						});
				 }
			 });
			
			
			
			
			sap.ui.core.BusyIndicator.hide();
			 
			 
			}
			else if(mocmodel.oData.loginMode=== "E"){
				
				 var t=this;
				/* t.getView().byId("pu").setEditable(false);
				 t.getView().byId("empno").setEditable(false);
				 t.getView().byId("ndept").setEditable(false);
				 t.getView().byId("significant").setEditable(false);*/
			        t.getView().getModel("mocmodel").setProperty("/fileupload");
			        var oGlobalBusyDialog = new sap.m.BusyDialog();
                    oGlobalBusyDialog.open();
				var filedownloadurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				filedownloadurl.read("/ZHR_T_MOC_ATTACHSet/?$filter=MocNum eq '"+t.mocnumber+"'",{
					 success:function(odata){
						 
						 
						var data=odata.results;
						var array=[];
					
						
						
							for(var i=0;i<data.length;i++){
								delete data[i].__metadata;
								
								array.push(data[i]);
							
							var file=array;
							
							mocmodel.setProperty("/fileupload",file);
							
						}
							oGlobalBusyDialog.close();
							 },
					 error:function(evt){
						 oGlobalBusyDialog.close();
						 var message=error;
							var msg=$(error.response.body).find('message').first().text();
							MessageBox.error(msg);
					 }
							 
				 });
				
				
				
				
	this.getView().byId("actiontable").setProperty("mode", "SingleSelect");
	
	
        var plant=this.getView().byId("pu").getValue();
       /* var Significant=this.getView().byId("significant");*/
        var significant=this.getView().byId("significant").getValue();
        var zparameter=this.getView().getModel("mocmodel").getData().loginMode;
        if(t.mocnumber!=="E"){
			changetypeurl.read("/zhr_t_mocSet('"+t.mocnumber+"')?$expand=zhr_t_moc_actionSet,zhr_t_moc_checkSet,zhr_t_moc_commSet,ZHR_T_MOC_APPROVSet",{
				 success:function(data){
					 
					 t.getView().byId("pu").setEditable(false);
					 t.getView().byId("empno").setEditable(false);
					 t.getView().byId("ndept").setEditable(false);
					 t.getView().byId("significant").setEditable(false);
					 
					 var data=data;
				
					
					 var bukrs=data.Bukrs;
						var plant=data.Persarea;
						var significant=data.Significant;
						
						
						
						
						/*var frmt1 = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
	                	var d1 = frmt1.format(new Date(data.MocDate));*/
					    data.MocDate=new Date(data.MocDate);
					    
						 if((data.DateFrom!==null)&&(data.DateTo!==null)){
						/* var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
		                	var d = frmt.format(new Date(data.DateFrom));
						    var d2=frmt.format(new Date(data.DateTo));*/
							 data.DateFrom=new Date(data.DateFrom);
								data.DateTo=new Date(data.DateTo);
						mocmodel.setProperty("/empdetails",data);
						 }else{
						mocmodel.setProperty("/empdetails",data);
						 }
						
						
						
						if(data.ChangeType===""){
							t.getView().byId("changetype").setEditable(true);
							mocmodel.setProperty("/empdetails",data);
						}
						else{
							t.getView().byId("changetype").setEditable(false);
							mocmodel.setProperty("/empdetails",data);
						}
						/*if(data.Significant===""){
							var significant=t.getView().byId("significant").setValue("No");
						}
						else{
							var significant=data.Significant;
							mocmodel.setProperty("/empdetails",data);
						}*/
                     var orgdatadetails=mocmodel.getProperty("/empdetails");
					
					var empapprovalurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
					empapprovalurl.read("/Approvers_tableSet/?$filter=Werks eq '"+plant+"' and Bukrs eq '"+bukrs+"' and Significant eq '"+significant+"' and Zparameter eq '"+zparameter+"' and MocNum eq '"+t.mocnumber+"'",{
						success:function(odata){
							
								
							
							var array=[];
							var emporgdata=odata.results;
							
							
								for(var i=0;i<emporgdata.length;i++){
									delete emporgdata[i].__metadata;
									
									array.push(emporgdata[i]);
								
								var orgtable=array;
								
								mocmodel.setProperty("/orgapprtable",orgtable);
							}
							
						},
						error:function(error){
							var message=error;
							var msg=$(error.response.body).find('message').first().text();
							MessageBox.error(msg);
						}
						
					})
					
					//////////////////actiontable data///////////////

					/*var actiontable=mocmodel.getProperty("/actiontable");*/

			 var actiontabledata=data.zhr_t_moc_actionSet.results;
			 for(var i=0;i<actiontabledata.length;i++){
				 if(actiontabledata[i].TargetDate===null){
					 actiontabledata[i].TargetDate=null;
				 }
				 else{
				  	actiontabledata[i].TargetDate=new Date(actiontabledata[i].TargetDate);
				 }

				  }
                mocmodel.setProperty("/actiontable",actiontabledata);
                ////////////////////////////////////////////////////////////
                
                /*var checklisttable=mocmodel.getProperty("/checklisttable");*/

   			 var checklisttabled=data.zhr_t_moc_checkSet.results;
   			
                   mocmodel.setProperty("/checklisttable",checklisttabled);
                   
                   /////////////////////////////////////////////
                   
                 /*  var Approverstable=mocmodel.getProperty("/Approverstable");*/

         			 var Approverstabled=data.ZHR_T_MOC_APPROVSet.results;
         			
                         mocmodel.setProperty("/Approverstable",Approverstabled);
                         
                         //////////////Historytable/////////////////
                         
                         var arr=[];
                         var Historytable=data.zhr_t_moc_commSet.results;
                         for(var i=0;i<Historytable.length;i++){
                        	 Historytable[i].Zdate=new Date(Historytable[i].Zdate);
              			delete Historytable[i].__metadata;
              			arr.push(Historytable[i]);
                         }
                         mocmodel.setProperty("/Historytable",arr);
			}
			      
			 
			 });
			
        }
	
			}

		       	var empdetails=[
		       		{
		       			"type":"Personal",
		       			
		       			"perm":"Permanent",
		       			"y":"Yes",
		       			"key":"1"
		       			
		       		},
		       		{
			            "type":"Organizational",
		       			
		       			"perm":"Temporary",
		       			"y":"No",
		       			"key":"2"
		       		},
		       		/*{
		       			"type":"Operational activities/processes"
		       		},
		       		{
		       			"type":"Known hazards and risks"
		       		},
		       		{
		       			"type":"Plant and equipment"
		       		},
		       		{
		       			"type":"Product and materials"
		       		},
		       		{
		       			"type":"Established processes and management systems"
		       		},
		       		{
		       			"type":"Procedures or system of working and relevant documentation"
		       		}
		       		*/
		       		]
		       		
		    /*  this.getView().setProperty("/empdetails1",empdetails)*/
	
      var changetypedata=new sap.ui.model.json.JSONModel();
       changetypedata.setData(empdetails);
       this.getView().setModel(changetypedata,"values");
       
       var data={
    	 'empdetails':[
       		{
       			"type":"Personal",
       			
       			"perm":"Permanent",
       			"y":"Yes"
       			
       		},
       		{
	            "type":"Organizational",
       			
       			"perm":"Temporary",
       			"y":"No",
       		},
       		{
       			"type":"Operational activities/processes"
       		},
       		{
       			"type":"Known hazards and risks"
       		},
       		{
       			"type":"Plant and equipment"
       		},
       		{
       			"type":"Product and materials"
       		},
       		{
       			"type":"Established processes and management systems"
       		},
       		{
       			"type":"Procedures or system of working and relevant documentation"
       		}
       		]
       		
       }

    var changetypedata1=new sap.ui.model.json.JSONModel();
       changetypedata1.setData(data);
        this.getView().setModel(changetypedata1);
      
      
      /*mocmodel.setProperty("/changetypedata",changetypedata);*/

        
		},
		
		
		onselect_changetype:function(evt){
		
			var t=this;
			var text=evt.mParameters.selectedItem.mProperties.text;
			var type=t.getView().byId("changetype").getValue();
			var significant=t.getView().byId("significant").getValue();
			var moct=t.getView().byId("mt").getValue();
			var plant=t.getView().byId("pu").getValue();
			var mocdate=t.getView().byId("mocdate").getValue();
			var planned=t.getView().byId("planned").getValue();
			var kc=t.getView().byId("kc").getValue();
			var datefrom=t.getView().byId("datefrom").getValue();
			var dateto=t.getView().byId("todate").getValue();
			var briefrole=t.getView().byId("briefrole").getValue();
			var PresentPrblm=t.getView().byId("PresentPrblm").getValue();
			var purposechange=t.getView().byId("purposechange").getValue();
			var reasons=t.getView().byId("reasons").getValue();
			var detailschange=t.getView().byId("detailschange").getValue();
			var benifits=t.getView().byId("benifits").getValue();
			
			var t=this;
			
			

			var s_change=t.getView().byId("significant").getValue();
						if(s_change==="No"){
							this.getView().byId("reasons").setVisible(false);
						}else{
							this.getView().byId("reasons").setVisible(true);
						}
	        t.getView().getModel("mocmodel").setProperty("/fileupload");
		var filedownloadurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
		filedownloadurl.read("/ZHR_T_MOC_ATTACHSet/?$filter=ChangeType eq '"+text+"'",{
			 success:function(odata){
				 
				 
				var data=odata.results;
				var array=[];
			
				
				
					for(var i=0;i<data.length;i++){
						delete data[i].__metadata;
						
						array.push(data[i]);
					
					var file=array;
					
					mocmodel.setProperty("/fileupload",file);
				}
				
					 },
			 error:function(evt){
				 var message=error;
					var msg=$(error.response.body).find('message').first().text();
					MessageBox.error(msg);
			 }
		 });
			
			
			
			if(text==="Personal"){
				t.getView().byId("changetype").clearSelection();
			
				this.getView().byId("briefrole").setVisible(true);this.getView().byId("empno").setEditable(true);this.getView().byId("ndept").setEditable(true);
				t.getView().byId("empname").setEditable(false);t.getView().byId("dept").setEditable(false);t.getView().byId("cocode").setEditable(false);
			    t.getView().byId("PresentPrblm").setVisible(false);
				
				t.getView().byId("purposechange").setVisible(true);
				
				t.getView().byId("detailschange").setVisible(true);
				t.getView().byId("benifits").setVisible(false);
				
				
				/*var mocmodel=this.getView().getModel("mocmodel");
			
				mocmodel.setProperty("/actiontable",[]);*/
				
				
		/*		var changetypeurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				 changetypeurl.read("/zhr_t_moc_actionSet?$filter=ChangeType eq '"+text+"'",{
					 success:function(odata){
						 
						 
						
							
						
							mocmodel.setProperty("/actiontable",odata.results);
						
							 t.getView().byId("changetype").clearSelection();
						 
							
					 },
					 error:function(evt){
							var message=error;
							var msg=$(error.response.body).find('message').first().text();
							var action="OK";
							var t=this;
							MessageBox.error(msg,{
								
								onClose:function(){
									if(action==="OK"){
										var oRouter=t.getOwnerComponent().getRouter();
                              oRouter.navTo("Homepage");
									}
								}
							});
					 }
				 });*/
				 var mocmodel=t.getView().getModel("mocmodel");
				  
				 mocmodel.setProperty("/checklisttable",[]);
				var checklisturl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				checklisturl.read("/zhr_t_moc_checkSet?$filter=ChangeType eq '"+text+"'",{
					success:function(odata){
						
						for(var i=0;i<odata.results.length;i++){
							if(odata.results[i].YesNo===""){
								odata.results[i].YesNo="Yes";
								mocmodel.setProperty("/checklisttable",odata.results);
							}
						
						else{
							
							mocmodel.setProperty("/checklisttable",odata.results);
						}}
						
							
						
					},
					error:function(error){
						var message=error;
						var msg=$(error.response.body).find('message').first().text();
						var action="OK";
						var t=this;
						MessageBox.error(msg,{
							
							onClose:function(){
								if(action==="OK"){
									var oRouter=t.getOwnerComponent().getRouter();
                          oRouter.navTo("Homepage");
								}
							}
						});
					}
					
				})
			
		
				
				}
			else if((text==="Organizational")||(text==="Operational activities/processes")
					||(text==="Known hazards and risks")||(text==="Plant and equipment")
					||(text==="Product and materials")||(text==="Established processes and management systems")
					||(text==="Procedures or system of working and relevant documentation")){
				
				this.getView().byId("briefrole").setVisible(true);this.getView().byId("empno").setEditable(false);this.getView().byId("ndept").setEditable(false);
				this.getView().byId("empno").setValue(null);this.getView().byId("ndept").setValue(null);t.getView().byId("empname").setEditable(false);t.getView().byId("empname").setValue(null);
				t.getView().byId("dept").setEditable(true);t.getView().byId("dept").setValue(null);t.getView().byId("cocode").setEditable(true);t.getView().byId("cocode").setValue(null);
				 t.getView().byId("dept").setEditable(false);t.getView().byId("cocode").setEditable(false);
			 t.getView().byId("orgtable").setVisible(true);
			    this.getView().byId("PresentPrblm").setVisible(true);
				t.getView().byId("purposechange").setVisible(true);
				t.getView().byId("reasons").setVisible(true);
				t.getView().byId("detailschange").setVisible(true);
				t.getView().byId("benifits").setVisible(true);
				var mocmodel=t.getView().getModel("mocmodel");
				mocmodel.setProperty("/empdetails",[]);
				
			
			
			var fetchdataurlorg=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			fetchdataurlorg.read("Employee_DetailsSet('000')",{
				success:function(data){
					/*var frmt1 = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
                	var d1 = frmt1.format(new Date());*/
				 data.MocDate=new Date();
					var data=data;
					data.ChangeType=type;                                  
					
					data.MocTitle=moct;
				    data.Persarea=plant;
				    data.Significant=significant;
				    
				    data.MocDate=new Date(data.MocDate);
					var bukrs=data.Bukrs;
					data.Planned=planned;
					data.KindChange=kc;
					data.DateFrom=new Date(datefrom);
					data.DateTo=new Date(dateto);
					data.BriefRole=briefrole;
					data.Reasons=reasons;
					data.PurposeChange=purposechange;
					data.PresentPrblm=PresentPrblm;
					data.DetailsChange=detailschange;
					data.Benifits=benifits;
					mocmodel.setProperty("/empdetails",data);
					 t.getView().byId("changetype").clearSelection();
					
					////////////////////////
					var orgdatadetails=mocmodel.getProperty("/empdetails");
					var zparameter=t.getView().getModel("mocmodel").getData().loginMode;
					var empapprovalurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
					empapprovalurl.read("/Approvers_tableSet/?$filter=Werks eq '"+plant+"' and Bukrs eq '"+bukrs+"' and Significant eq '"+significant+"' and Zparameter eq '"+zparameter+"' and MocNum eq '"+t.mocnumber+"'",{
						success:function(odata){
							
								
							
							var array=[];
							var emporgdata=odata.results;
							
							
								for(var i=0;i<emporgdata.length;i++){
									delete emporgdata[i].__metadata;
									
									array.push(emporgdata[i]);
								
								var orgtable=array;
								
								mocmodel.setProperty("/orgapprtable",orgtable);
								 t.getView().byId("changetype").clearSelection();
							}
							
						},
						error:function(error){
							var message=error;
							var msg=$(error.response.body).find('message').first().text();
							var action="OK";
							MessageBox.error(msg,{
								
								onClose:function(){
									if(action==="OK"){
										var oRouter=t.getOwnerComponent().getRouter();
                              oRouter.navTo("Homepage");
									}
								}
							})
						}
						
					})
					
					
				},
				error:function(error){
					var message=error;
					var msg=$(error.response.body).find('message').first().text();
					var action="OK";
					var t=this;
					MessageBox.error(msg,{
						
						onClose:function(){
							if(action==="OK"){
								var oRouter=t.getOwnerComponent().getRouter();
                      oRouter.navTo("Homepage");
							}
						}
					});
				}
				
				///////////////////////////////////////
				
				
			});
			
			
			var mocmodel=this.getView().getModel("mocmodel");
			
	/*		mocmodel.setProperty("/actiontable",[]);
			
			
			var changetypeurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			 changetypeurl.read("/zhr_t_moc_actionSet?$filter=ChangeType eq '"+text+"'",{
				 success:function(odata){
					 
					 
					
						
					
						mocmodel.setProperty("/actiontable",odata.results);
				
					
					 
						
				 },
				 error:function(evt){
						var message=error;
						var msg=$(error.response.body).find('message').first().text();
						var action="OK";
						var t=this;
						MessageBox.error(msg,{
							
							onClose:function(){
								if(action==="OK"){
									var oRouter=t.getOwnerComponent().getRouter();
                          oRouter.navTo("Homepage");
								}
							}
						});
				 }
			 });*/
			 var mocmodel=t.getView().getModel("mocmodel");
			 mocmodel.setProperty("/checklisttable",[]);
			 
			var checklisturl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			checklisturl.read("/zhr_t_moc_checkSet?$filter=ChangeType eq '"+text+"'",{
				success:function(odata){
					
						
					for(var i=0;i<odata.results.length;i++){
						if(odata.results[i].YesNo===""){
							odata.results[i].YesNo="Yes";
							mocmodel.setProperty("/checklisttable",odata.results);
						}
					
					else{
						
						mocmodel.setProperty("/checklisttable",odata.results);
					}}
					
				},
				error:function(error){
					var message=error;
					var msg=$(error.response.body).find('message').first().text();
					var action="OK";
					var t=this;
					MessageBox.error(msg,{
						
						onClose:function(){
							if(action==="OK"){
								var oRouter=t.getOwnerComponent().getRouter();
                      oRouter.navTo("Homepage");
							}
						}
					});
				}
				
			})
			
			}
			
			
		
			
			
			},
			onselect_empno:function(evt){
				var t=this;
				 t.getView().byId("ndept").setValue(null);
				t.evt=evt.mParameters.selectedItem.mProperties.text;
				var empno=t.getView().byId("empno");
				empno.setValue(t.evt);
				var mocmodel=t.getView().getModel("mocmodel");
				var type=t.getView().byId("changetype").getValue();
				var moct=t.getView().byId("mt").getValue();
				var significant=t.getView().byId("significant").getValue();
			    var plant=t.getView().byId("pu").getValue();
			    var mocdate=t.getView().byId("mocdate").getValue();
			    var kindoc=t.getView().byId("kc").getValue();
				var frmd=t.getView().byId("datefrom").getValue();
				var td=t.getView().byId("todate").getValue();
				var ndept=t.getView().byId("ndept").getValue();
				var planned=t.getView().byId("planned").getValue();
				var briefrole=t.getView().byId("briefrole").getValue();
				var cocode=t.getView().byId("cocode").getValue();
				var purposechange=t.getView().byId("purposechange").getValue();
				var reasons=t.getView().byId("reasons").getValue();
				var detailschange=t.getView().byId("detailschange").getValue();
				var actiontable=t.getView().byId("actiontable").getModel("mocmodel").getData().actiontable;
				mocmodel.setProperty("/actiontable",actiontable);
				var changetype=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				changetype.read("Employee_DetailsSet('"+t.evt+"')",{
					success:function(data){
						var data=data;
						/*var frmt1 = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
	                	var d1 = frmt1.format(new Date());*/
						data.Pernr=t.evt;
	                	data.MocDate=new Date();
						data.Persarea=plant;
						data.Significant=significant;
						data.ChangeType=type;
						data.MocTitle=moct;
						data.KindChange=kindoc;
						data.DateFrom=new Date(frmd);
						data.DateTo=new Date(td);
						data.NewDept=ndept;
						data.Planned=planned;
						data.BriefRole=briefrole;
						data.Reasons=reasons;
						data.PurposeChange=purposechange;
					    data.Bukrs=cocode;
						data.DetailsChange=detailschange;
						mocmodel.setProperty("/empdetails",data);
					},
					error:function(error){
						new sap.m.error("error");}
				});
			},
			onsuggest_empno:function(evt){
				var t=this;
				 t.getView().byId("ndept").setValue(null);
			t.evt=evt.mParameters.value;
			var changetype=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			changetype.read("/pa0002Set",{
				success:function(odata){
					var arr=[],obj={};
					var Pernr=odata.results;
					for(var i=0;i<Pernr.length;i++){
						obj.Pernr=Pernr[i].Pernr;
						obj.Vorna=Pernr[i].Vorna;
						arr.push(obj);
						obj={};}
				var mocmodel=new sap.ui.model.json.JSONModel();
				mocmodel.setData(arr);
				t.getView().setModel(mocmodel,"empdata");
	            
				var mocmodel=t.getView().getModel("mocmodel");
				var type=t.getView().byId("changetype").getValue();
				var moct=t.getView().byId("mt").getValue();
				var significant=t.getView().byId("significant").getValue();
			    var plant=t.getView().byId("pu").getValue();
			    var mocdate=t.getView().byId("mocdate").getValue();
			    var kindoc=t.getView().byId("kc").getValue();
				var frmd=t.getView().byId("datefrom").getValue();
				var td=t.getView().byId("todate").getValue();
				var ndept=t.getView().byId("ndept").getValue();
				var planned=t.getView().byId("planned").getValue();
				var briefrole=t.getView().byId("briefrole").getValue();
				var empno=t.getView().byId("empno").getValue();
				var purposechange=t.getView().byId("purposechange").getValue();
				var reasons=t.getView().byId("reasons").getValue();
				var detailschange=t.getView().byId("detailschange").getValue();
				var actiontable=t.getView().byId("actiontable").getModel("mocmodel").getData().actiontable;
				mocmodel.setProperty("/actiontable",actiontable);
				changetype.read("Employee_DetailsSet('"+t.evt+"')",{
					success:function(data){
						var data=data;
						/*var frmt1 = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
	                	var d1 = frmt1.format(new Date());*/
						data.Pernr=empno;
	                	data.MocDate=new Date();
						data.Persarea=plant;
						data.Significant=significant;
						data.ChangeType=type;
						data.MocTitle=moct;
						data.KindChange=kindoc;
						data.DateFrom=new Date(frmd);
						data.DateTo=new Date(td);
						data.NewDept=ndept;
						data.Planned=planned;
						data.BriefRole=briefrole;
						data.Reasons=reasons;
						data.PurposeChange=purposechange;
					
						data.DetailsChange=detailschange;
						mocmodel.setProperty("/empdetails",data);
					},
					error:function(error){
						new sap.m.error("error");}
				});
				}
			
			});
	
		},
	///////////////  fetch emplyoee details based on emplyee number///////
			
			
		empchangetype:function(evt){
			var t=this;
			
			var changetype=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			changetype.read("/pa0002Set",{
				success:function(odata){
					var arr=[],obj={};
					var Pernr=odata.results;
					for(var i=0;i<Pernr.length;i++){
						obj.Pernr=Pernr[i].Pernr;
						obj.Vorna=Pernr[i].Vorna;
						arr.push(obj);
						obj={};}
				var mocmodel=new sap.ui.model.json.JSONModel();
				mocmodel.setData(arr);
				t.getView().setModel(mocmodel,"mocmodel1");
				
				
				var type=t.getView().byId("changetype").getValue();
				var moct=t.getView().byId("mt").getValue();
				var significant=t.getView().byId("significant").getValue();
			    var plant=t.getView().byId("pu").getValue();
			    var mocdate=t.getView().byId("mocdate").getValue();
			    var kindoc=t.getView().byId("kc").getValue();
				var frmd=t.getView().byId("datefrom").getValue();
				var td=t.getView().byId("todate").getValue();
				var ndept=t.getView().byId("ndept").getValue();
				var planned=t.getView().byId("planned").getValue();
				var briefrole=t.getView().byId("briefrole").getValue();
				
				var purposechange=t.getView().byId("purposechange").getValue();
				var reasons=t.getView().byId("reasons").getValue();
				var detailschange=t.getView().byId("detailschange").getValue();
				var actiontable=t.getView().byId("actiontable").getModel("mocmodel").getData().actiontable;
				mocmodel.setProperty("/actiontable",actiontable);
				var dialog=new sap.m.Dialog({
					title:"Personal Details",
					content:[new sap.m.SearchField({liveChange:function(evt){
									var filt=[];
									var a=evt.mParameters.newValue;
		                            var binding=t.l.getBinding("items");
		                            if(a&&a.length>0){
		                            var filter=new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, a);
		                            filt.push(filter);
		                            }binding.filter(filt);
                                     }}),
                                     
                             t.l=new sap.m.List({growing:true,
							items: {path: 'mocmodel1>/',template: new sap.m.StandardListItem({title: "{mocmodel1>Pernr}",info:"{mocmodel1>Vorna}",type: "Active"}),},
							itemPress: function (oevt) {
								
								var mocmodel=t.getView().getModel("mocmodel");
								mocmodel.setProperty("/empdetails",[]);
								var value = oevt.getParameter("listItem").getProperty("title");
								/*this.getView().byId("changetype").setValue(value);*/
								/*t.getView().byId("empno").setValue(value);*/
								var fetchdataurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
								fetchdataurl.read("Employee_DetailsSet('"+value+"')",{
									success:function(data){
										var data=data;
										/*var frmt1 = sap.ui.core.format.DateFormat.getDateInstance({pattern:"dd-MM-yyyy"});
					                	var d1 = frmt1.format(new Date());*/
					                	data.MocDate=new Date();
										data.Persarea=plant;
										data.Significant=significant;
										data.ChangeType=type;
										data.MocTitle=moct;
										data.KindChange=kindoc;
										data.DateFrom=new Date(frmd);
										data.DateTo=new Date(td);
										data.NewDept=ndept;
										data.Planned=planned;
										data.BriefRole=briefrole;
										data.Reasons=reasons;
										data.PurposeChange=purposechange;
									
										data.DetailsChange=detailschange;
										mocmodel.setProperty("/empdetails",data);
									},
									error:function(error){
										new sap.m.error("error");}});
								dialog.close();}})],
						buttons:[new sap.m.Button({text:"OK",press:function(){ 
						dialog.close();}
							}),
							new sap.m.Button({text:"Close",press:function(){ 
								dialog.close();}})] });
				t.getView().addDependent(dialog);
				dialog.open();}});
		},
		
		onsuggest_dept:function(evt){
			var t=this;
			t.arr=[];
			t.obj={};
			
			var plant=t.getView().byId("pu").getValue();
			var bukrs=t.getView().byId("cocode").getValue();
			var significant=t.getView().byId("significant").getValue();
			var changetype=t.getView().byId("changetype").getValue();
			var empno=t.getView().byId("empno").getValue();
			t.val = evt.getSource().getValue().toUpperCase();
			t.getView().byId("ndept").setValue(t.val);
			var newdepartmenturl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			newdepartmenturl.read("/t001pSet",{
				success:function(odata){
					var data=odata.results;
					for(var i=0;i<data.length;i++){
						t.obj.Dept=data[i].Btrtl;
						t.obj.Btext=data[i].Btext;
						t.arr.push(t.obj);
						t.obj={};}
					var depdata=new sap.ui.model.json.JSONModel();
					depdata.setData(t.arr);
					t.getView().setModel(depdata,"depdata1");
				}
			});
			var plant=t.getView().byId("pu").getValue();
		var significant=t.getView().byId("significant").getValue();
		var changetype=t.getView().byId("changetype").getValue();
		var empno=t.getView().byId("empno").getValue();
		var bukrs=t.getView().byId("cocode").getValue();
		var value=t.val;
		var mocmodel=t.getView().getModel("mocmodel");
			 var empapprovalurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				empapprovalurl.read("/Approvers_tableSet/?$filter=Werks eq '"+plant+"' and Bukrs eq '"+bukrs+"' and Significant eq '"+significant+"' and ChangeType eq '"+changetype+"' and Pernr eq '"+empno+"' and NewDept eq '"+value+"'",{
					success:function(odata){
						
							
						
						var array=[];
						var emporgdata=odata.results;
						
						
							for(var i=0;i<emporgdata.length;i++){
								delete emporgdata[i].__metadata;
								
								array.push(emporgdata[i]);
							
							var orgtable=array;
							
							
						}
							mocmodel.setProperty("/orgapprtable",orgtable);
							t.dialog.close();
					},
					error:function(error){
						var message=error;
						var msg=$(error.response.body).find('message').first().text();
						var action="OK";
						MessageBox.error(msg,{
							
							onClose:function(){
								if(action==="OK"){
									var oRouter=t.getOwnerComponent().getRouter();
                       oRouter.navTo("Homepage");
								}
							}
						});
						t.dialog.close();
					}
					
				})
		},
		newdepartment:function(evt){
			var t=this;
			t.arr=[];
			t.obj={};
			
			var plant=t.getView().byId("pu").getValue();
			var bukrs=t.getView().byId("cocode").getValue();
			var significant=t.getView().byId("significant").getValue();
			var changetype=t.getView().byId("changetype").getValue();
			var empno=t.getView().byId("empno").getValue();
			
			var newdepartmenturl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			newdepartmenturl.read("/t001pSet",{
				success:function(odata){
					var data=odata.results;
					for(var i=0;i<data.length;i++){
						t.obj.Dept=data[i].Btrtl;
						t.obj.Btext=data[i].Btext;
						t.arr.push(t.obj);
						t.obj={};}
					var depdata=new sap.ui.model.json.JSONModel();
					depdata.setData(t.arr);
					t.getView().setModel(depdata,"depdata")
					
					 t.dialog=new sap.m.Dialog({
						title:"New Department",
						content:[
							new sap.m.SearchField({liveChange:function(evt){
								var filt=[];
								var a=evt.mParameters.newValue;
	                            var binding=t.l.getBinding("items");
	                            if(a&&a.length>0){ var filter=new sap.ui.model.Filter("Dept", sap.ui.model.FilterOperator.Contains, a);
	                            filt.push(filter);}binding.filter(filt);}}),
							t.l=new sap.m.List({items:{path:'depdata>/',template:new sap.m.StandardListItem({title:"{depdata>Dept}",info:"{depdata>Btext}",type:"Active"}),},
								
									itemPress:function(evt){
										
										var value=evt.getParameter("listItem").getProperty("title");
										t.getView().byId("ndept").setValue(value);
										var mocmodel=t.getView().getModel("mocmodel");
										
										 var empapprovalurl= new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
											empapprovalurl.read("/Approvers_tableSet/?$filter=Werks eq '"+plant+"' and Bukrs eq '"+bukrs+"' and Significant eq '"+significant+"' and ChangeType eq '"+changetype+"' and Pernr eq '"+empno+"' and NewDept eq '"+value+"'",{
												success:function(odata){
													
														
													
													var array=[];
													var emporgdata=odata.results;
													
													
														for(var i=0;i<emporgdata.length;i++){
															delete emporgdata[i].__metadata;
															
															array.push(emporgdata[i]);
														
														var orgtable=array;
														
														
													}
														mocmodel.setProperty("/orgapprtable",orgtable);
														t.dialog.close();
												},
												error:function(error){
													var message=error;
													var msg=$(error.response.body).find('message').first().text();
													var action="OK";
													MessageBox.error(msg,{
														
														onClose:function(){
															if(action==="OK"){
																var oRouter=t.getOwnerComponent().getRouter();
						                              oRouter.navTo("Homepage");
															}
														}
													});
													t.dialog.close();
												}
												
											})

										
										
										
										
											}})],
							buttons:[new sap.m.Button({text:"Cancel",press:function(evt){
								t.dialog.close();}})]})
					t.getView().addDependent(t.dialog);
					t.dialog.open();
				},
				error:function(error){
					new sap.m.MessageBox.error("error");}})
					},
		kind_change:function(evt){
			var k_change=evt.mParameters.selectedItem.mProperties.text;
			if(k_change==="Temporary"){
			
				this.getView().byId("datefrom").setVisible(true);
				this.getView().byId("todate").setVisible(true);
			}
			else if(k_change==="Permanent"){
			this.getView().byId("datefrom").setVisible(false);
				this.getView().byId("todate").setVisible(false);
			}
		},
		
		significant_change:function(evt){
			var s_change=evt.mParameters.selectedItem.mProperties.text;
			if(s_change==="No"){
				this.getView().byId("reasons").setVisible(false);
			}else{
				this.getView().byId("reasons").setVisible(true);
			}
			
		},
		 onsuggest_plant:function(evt){
				var t=this;
				var arr=[];
				var obj={};
				t.val = evt.getSource().getValue().toUpperCase();
				t.getView().byId("pu").setValue(t.val);
				t.getView().byId("significant").setValue(null);
				t.getView().byId("changetype").setValue(null);
				t.getView().byId("empno").setEditable(false);
                t.getView().byId("ndept").setEditable(false);
				var planturl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				planturl.read("/PlantHelpSet",{
					success:function(odata){
						var data=odata.results;
						for(var i=0;i<data.length;i++){
							obj.plant=odata.results[i].Werks;
							
							arr.push(obj);
							obj={};}
						var depdata=new sap.ui.model.json.JSONModel();
						depdata.setData(arr);
						//depdata.setProperty("/plantdata", arr);
						depdata.setSizeLimit(data.length);
						t.getView().setModel(depdata,"plantdata")
					}});
			 
		 },
		plantunit:function(evt){
			var t=this;
			t.arr=[];
			t.obj={};
			var planturl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			planturl.read("/PlantHelpSet",{
				success:function(odata){
					var data=odata.results;
					for(var i=0;i<data.length;i++){
						t.obj.plant=odata.results[i].Werks;
						
						t.arr.push(t.obj);
						t.obj={};}
					var depdata=new sap.ui.model.json.JSONModel();
					depdata.setData(t.arr);
					t.getView().setModel(depdata,"plantdata");
					
					var dialog=new sap.m.Dialog({
						title:"Plant and Unit",
						content:[
							new sap.m.SearchField({liveChange:function(evt){
								var filt=[];
								var a=evt.mParameters.newValue;
	                            var binding=t.l.getBinding("items");
	                            if(a&&a.length>0){ var filter=new sap.ui.model.Filter("plant", sap.ui.model.FilterOperator.Contains, a);
	                            filt.push(filter);}binding.filter(filt);}}),
							t.l=new sap.m.List({items:{path:'plantdata>/',template:new sap.m.StandardListItem({title:"{plantdata>plant}",type:"Active"}),},
								
									itemPress:function(evt){
										
										var value=evt.getParameter("listItem").getProperty("title");
										t.getView().byId("pu").setValue(value);
										t.getView().byId("significant").setValue(null);
										t.getView().byId("changetype").setValue(null);
										t.getView().byId("empno").setEditable(false);
		                                t.getView().byId("ndept").setEditable(false);
		                                
				t.getView().byId("empno").setValue(null);t.getView().byId("ndept").setValue(null);t.getView().byId("empname").setEditable(false);t.getView().byId("empname").setValue(null);
				t.getView().byId("dept").setEditable(true);t.getView().byId("dept").setValue(null);t.getView().byId("cocode").setEditable(true);t.getView().byId("cocode").setValue(null);
				 t.getView().byId("dept").setEditable(false);t.getView().byId("cocode").setEditable(false);
										dialog.close();}})],
							buttons:[new sap.m.Button({text:"Cancel",press:function(evt){
								dialog.close();}})]})
					t.getView().addDependent(dialog);
					dialog.open();
				},
				
				error:function(evt){
					new sap.m.MessageBox.error("error");
				}
			})
			
		},
		
		
		
		addactionplan:function(evt){
			var t=this;
		var dialogbox=	new sap.m.Dialog({
				title:"Action Plans",
				content:[
					new sap.ui.layout.form.SimpleForm({
						title:"Action plan",layout:"ResponsiveGridLayout",
						editable:true,
						content:[
							/*new sap.m.Label({text:"Sr.NO",design:"Bold"}),
							new sap.m.Input({}),*/
							new sap.m.Label({text:"Action Plan",design:"Bold"}),
							new sap.m.TextArea({}),
							new sap.m.Label({text:"Target Date",design:"Bold"}),
							new sap.m.DatePicker({})
							]
					})
					],
					buttons:[
						new sap.m.Button({
							text:"OK",
							press:function(evt){
                               var mocmodel=t.getView().getModel("mocmodel")
								
								var actiontable=mocmodel.getProperty("/actiontable");
                                var val1=evt.oSource.oParent.mAggregations.content[0]._aElements[1].mProperties.value;
                                 var val2=evt.oSource.oParent.mAggregations.content[0]._aElements[3].mProperties.value;
                                  if(val1===""){
	                              new sap.m.MessageBox.warning("Please Fill Actionplan")
                                      }
                                  else if(val2===""){
	                               new sap.m.MessageBox.warning("Please Fill TargetDate")
                                      }
                                  else{
                                  t.actobj.ActionPlan=evt.oSource.oParent.mAggregations.content[0]._aElements[1].mProperties.value;
								t.actobj.TargetDate=new Date(evt.oSource.oParent.mAggregations.content[0]._aElements[3].mProperties.dateValue);
								actiontable.push(t.actobj);
								t.actobj={};
                                  }
								
								mocmodel.setProperty("/actiontable",actiontable);
							
								dialogbox.close();
							}
						}),
						new sap.m.Button({
							text:"Close",
							press:function(){
								dialogbox.close();
							}
						})
						]
				
			});
			this.getView().addDependent(dialogbox);
			dialogbox.open();
		},
		deleteactionplan:function(evt){
			var tb6=this.getView().byId("actiontable");
			var tb8=tb6.mAggregations.items;
		
			var tb7=tb6._aSelectedPaths[0].slice(13);
			var t=parseInt(tb7);
		    var tb3=this.getView().byId("actiontable").getModel("mocmodel");
			tb3.getData().actiontable.splice(tb7,1);
		tb3.refresh(true);
			
		},
			
		//////////////////////////fileuploader////////////////////
	flupload:function(evt){
			
			var f;var t=this; 
		
			 t.path=parseInt(evt.getSource().oPropagatedProperties.oBindingContexts.mocmodel.sPath.slice(12));
			 
			var dialog=new sap.m.Dialog({
				title:"Upload Files",
				content:[
			
				new sap.ui.layout.form.SimpleForm({
					title:"File upload",editable:true,layout:"ResponsiveGridLayout",
					content:[
						
						new sap.m.Label({text:"File Name"}),
						f=new FileUploader({
						name:"myFileUpload",
						uploadUrl:"",
						tooltip:"Upload your file to the local server",
						uploadComplete:function(evt){
							var statu s=evt.mParameters.status;
							var m;
							var fileupload=t.getView().getModel("mocmodel").getProperty("/fileupload");
							if(status===201){
								
								
								 m=fileupload[t.path].DocDesc
								
								
									new sap.m.MessageBox.success("Upload '"+m+"' Succesfully");
								  sap.ui.core.BusyIndicator.hide();
								
							}
							else{
								new sap.m.MessageBox.error("Upload '"+m+"' failed");
								 sap.ui.core.BusyIndicator.hide();
							}
							
						},
						
						useMultipart:false,
						sameFilenameAllowed:true,
						
						multiple:true,
						typeMissmatch:"handlemissmatch",
						
							
							
				
						}),
					]
				})
					
				],
				buttons:[new sap.m.Button({text:"Upload",icon:"sap-icon://upload" ,type:"Emphasized" ,
					press:function(evt)
					{
						 sap.ui.core.BusyIndicator.show();
						
						var fileupload=t.getView().getModel("mocmodel").getProperty("/fileupload");
					
						for(var i=t.path;i<fileupload.length;i++){
						
						fileupload[i].DocDesc=evt.oSource.oParent.mAggregations.content[0]._aElements[1].mProperties.value;
						break;
						}
						t.getView().getModel("mocmodel").setProperty("/fileupload",fileupload);
						
						
						var SrNo=fileupload[i].SrNo;
						var Docname=fileupload[i].Docname;
						
						var filename=evt.oSource.oParent.mAggregations.content[0]._aElements[1].mProperties.value.slice(1,-2);
						
						if(filename===""){
							new sap.m.MessageBox.warning("Please Select File");
							sap.ui.core.BusyIndicator.hide();
						}
						else{
							
						var file=f.getFocusDomRef();
						
						
						var filename1=SrNo+"@#"+Docname+"@#"+filename;
						var oTasks = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
						f.removeAllHeaderParameters();
						
						 f.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						       name: "SLUG",
						       value:filename1
						       
						   }));
						

						 f.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						        name: "x-csrf-token",
						        value: oTasks.getSecurityToken()
						    }));
						    f.setSendXHR(true);
						    f.setUploadUrl("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/ZHR_T_MOC_ATTACHSet");
						   f.upload();
						/*new sap.m.MessageBox.success("'"+filename+"' Upload Succesfully");*/
						}
						
						
					dialog.close();
						
				},
				  
				}),
				
				new sap.m.Button({text:"Cancel",icon:"sap-icon://cancel",type:"Emphasized",press:function(evt){dialog.close()}})]
			})
			t.getView().addDependent(dialog);
			dialog.open();
			
			
			
		},
		
		/*handleUploadComplete11:function(evt){
			var a=10;
		},*/
		flupload1:function(evt){
			
			var f;var t=this; 
			var moc=t.mocnumber;
			 t.path=parseInt(evt.getSource().oPropagatedProperties.oBindingContexts.mocmodel.sPath.slice(12));
			 
			var dialog=new sap.m.Dialog({
				title:"Upload Files",
				content:[
			
				new sap.ui.layout.form.SimpleForm({
					title:"File upload",editable:true,layout:"ResponsiveGridLayout",
					content:[
						
						new sap.m.Label({text:"File Name"}),
						f=new FileUploader({
						name:"myFileUpload",
						uploadUrl:"upload/",
						tooltip:"Upload your file to the local server",
						uploadComplete:function(evt){
							var status=evt.mParameters.status;
							var m;
							var fileupload=t.getView().getModel("mocmodel").getProperty("/fileupload");
							if(status===201){
								
								
								 m=fileupload[t.path].Docname;
								
								
									new sap.m.MessageBox.success("Upload '"+m+"' Succesfully");
								 sap.ui.core.BusyIndicator.hide();
								
							}
							else{
								new sap.m.MessageBox.error("Upload '"+m+"' failed");
								sap.ui.core.BusyIndicator.hide();
							}
						},
							
							useMultipart:false
							
				
						}),
					]
				})
					
				],
				buttons:[new sap.m.Button({text:"Upload",icon:"sap-icon://upload" ,type:"Emphasized" ,
					press:function(evt)
					{
						
						sap.ui.core.BusyIndicator.show();
						var fileupload=t.getView().getModel("mocmodel").getProperty("/fileupload");
						
					
						for(var i=t.path;i<fileupload.length;i++){
			
						fileupload[i].DocDescF=evt.oSource.oParent.mAggregations.content[0]._aElements[1].mProperties.value;
						
						
						break;
						}
						t.getView().getModel("mocmodel").setProperty("/fileupload",fileupload);
						
						
						var SrNo=fileupload[i].SrNo;
						var Docname=fileupload[i].Docname;
						
						var filename=evt.oSource.oParent.mAggregations.content[0]._aElements[1].mProperties.value;
						
						if(filename===""){
							new sap.m.MessageBox.warning("Please Select File");
						}
						else{
							
						var file=f.getFocusDomRef();
						
						
						var filename1=SrNo+"@#"+Docname+"@#"+filename+"@#"+moc;
						var oTasks = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
						f.removeAllHeaderParameters();
						
						 f.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						       name: "SLUG",
						       value:filename1
						       
						   }));
						

						 f.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
						        name: "x-csrf-token",
						        value: oTasks.getSecurityToken()
						    }));
						    f.setSendXHR(true);
						    f.setUploadUrl("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/ZHR_T_MOC_ATTACHSet");
						   f.upload();
						/*   this.handleUploadComplete();*/
					/*	new sap.m.MessageBox.success("'"+filename+"' Upload Succesfully");*/
						}
						
						
					dialog.close();
						
				},
				  
				}),
				new sap.m.Button({text:"Cancel",icon:"sap-icon://cancel",type:"Emphasized",press:function(evt){dialog.close()}})]
			})
			t.getView().addDependent(dialog);
			dialog.open();
			
			
			
		},
		
		
		
		fldownload:function(evt){
            var path=evt.getSource().oPropagatedProperties.oBindingContexts.mocmodel.sPath;
			
			var MocNum=this.getView().getModel("mocmodel").getProperty(path).MocNum;
			var SrNo=this.getView().getModel("mocmodel").getProperty(path).SrNo;
			
			var Docdesc=this.getView().getModel("mocmodel").getProperty(path).DocDesc;
			var mandit=this.getView().getModel("mocmodel").getProperty(path).Mandatory;
			if(Docdesc==="" && mandit===""){
				new sap.m.MessageBox.error("File Download Failed");
			}
			else{
			var string="ZHR_T_MOC_ATTACHSet(MocNum='"+MocNum+"',SrNo='"+SrNo+"',Docname=' ')?$/$value";
			var Model5=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			Model5.read(string,{ 
				success:function(odata,response){
					var file=response.data.__metadata.media_src;;
				     window.open(file);
				},
				error:function(evt){
					var message=evt.message;
					MessageBox.show("'"+message+"'",{
		        		icon:MessageBox.Icon.WARNING,
		        		title:"",
		        		actions:[MessageBox.Action.OK],
		        		onClose:function(oAction){
		        			if(oAction===MessageBox.Action.OK){
		        			
		        			}
		        		}.bind(this)
		        	});
					
				}
				
			});
			}
		},
		fldownload2:function(evt){
           var path=evt.getSource().oPropagatedProperties.oBindingContexts.mocmodel.sPath;
			
			var MocNum=this.getView().getModel("mocmodel").getProperty(path).MocNum;
			var SrNo=this.getView().getModel("mocmodel").getProperty(path).SrNo;
			var docname=this.getView().getModel("mocmodel").getProperty(path).DocDescF;
		
			var mandit=this.getView().getModel("mocmodel").getProperty(path).Mandatory;
			if(docname==="" && mandit===""){
				new sap.m.MessageBox.error("File Download Failed");
			}
			else{
			var string="ZHR_T_MOC_ATTACHSet(MocNum='"+MocNum+"',SrNo='"+SrNo+"',Docname=' "+docname+"')?$/$value";
			var Model5=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			Model5.read(string,{
				success:function(odata,response){
					var file=response.data.__metadata.media_src;;
				     window.open(file);
				},
				error:function(evt){
					var message=evt.message;
					MessageBox.show("'"+message+"'",{
		        		icon:MessageBox.Icon.WARNING,
		        		title:"",
		        		actions:[MessageBox.Action.OK],
		        		onClose:function(oAction){
		        			if(oAction===MessageBox.Action.OK){
		        			
		        			}
		        		}.bind(this)
		        	});
					
				}
				
			});
			}
			
		},
		
		onchecklistchange:function(evt){
            var path=evt.getSource().oPropagatedProperties.oBindingContexts.mocmodel.sPath;
			
			var YesNo=this.getView().getModel("mocmodel").getProperty(path).YesNo;
			var SrNo=this.getView().getModel("mocmodel").getProperty(path).SrNo;
			var changetype=this.getView().byId("changetype").getValue();
			if((YesNo==="Yes")&&(SrNo==="0010")&&(changetype==="Organizational")){
			
				new sap.m.MessageBox.warning("Please Upload GHG Document");
			}
		},
		
		mocsave:function(evt){
		
			
			var arr=[],array=[],array1=[];var obj={};
			arr.push(obj);
			var nul=arr;
			obj={};
			
			

		    //////////////savsub/////////////////
     this.sav=this.getView().getModel("mocmodel").getData().empdetails.Savsub;
      if(this.sav==="F"){
        sav="F"
      }
      else{
      	this.sav="S";
      }
      /////////////date////////////////////////////////////////
      var mocdate=this.getView().byId("mocdate").getValue();
	/*	var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy/dd/MM"});
		var d = frmt.format(new Date(mocdate));*/
		 mocdate=new Date(mocdate);
		mocdate= new Date(mocdate.setHours("00","00","00","00"));
       mocdate = new Date(mocdate.getTime() + mocdate.getTimezoneOffset() * (-60000));
    
		var datefrom=this.getView().byId("datefrom").getValue();
		if((datefrom==="")||(datefrom===null)){
			datefrom=null;
		}else{
      /* var d2 = frmt.format(new Date(datefrom));*/
		 datefrom=new Date(datefrom);
		datefrom= new Date(datefrom.setHours("00","00","00","00"));
       datefrom = new Date(datefrom.getTime() + datefrom.getTimezoneOffset() * (-60000));
		}

       var dateto=this.getView().byId("todate").getValue();
       if((dateto==="")||(dateto===null)){
       	dateto=null;
       }else{
	/*	var d3 = frmt.format(new Date(dateto));*/
	    dateto=new Date(dateto);
		dateto= new Date(dateto.setHours("00","00","00","00"));
      dateto = new Date(dateto.getTime() + dateto.getTimezoneOffset() * (-60000));
       }
			////////////////////////////////////////////////////////////////////////
             var mocmodel=this.getView().getModel("mocmodel");
			
			var actiontable1=this.getView().byId("actiontable").getModel("mocmodel").getData().actiontable;
			if( mocmodel.oData.Sav_sub !== "C"){
				//mocmodel.setProperty("/actiontable",[]);
				for(var i=0;i<actiontable1.length;i++){
					delete actiontable1[i].__metadata;
					
					array.push(actiontable1[i]);
				}
				var actiontable=array;
			}else if(mocmodel.oData.Sav_sub === "C"){
				var actiontable =actiontable1;
			}
			
			var checklisttable1=this.getView().byId("checklisttable").getModel("mocmodel").getData().checklisttable;
			
			if(mocmodel.oData.Sav_sub !== "C"){
				//mocmodel.setProperty("/checklisttable",[]);
				for(var i=0;i<checklisttable1.length;i++){
					delete checklisttable1[i].__metadata;
				   
				  array1.push(checklisttable1[i]);
				}
				var checklisttable=array1;
			}else if(mocmodel.oData.Sav_sub === "C"){
				var checklisttable=checklisttable1
			}
			var fileupload=this.getView().byId("fileupload").getModel("mocmodel").getData().fileupload;
			var arr1=[];
			
			
			
			if(mocmodel.oData.Sav_sub !== "C"){
				//mocmodel.setProperty("/checklisttable",[]);
				for(var i=0;i<fileupload.length;i++){
					delete fileupload[i].__metadata;
				   
				  arr1.push(fileupload[i]);
				}
				var fileupload=arr1;
			}else if(mocmodel.oData.Sav_sub === "C"){
				var fileupload=fileupload
			}
			
	///////////////////action table validation/////////////////////
			 if(actiontable.length===0){
				 	
				 	array1=arr;
				 	
				 	
				 }
				 	else{
				 		array1=actiontable;
				 	}
			
			/////////////////////////validations//////////////////
			var actlen=actiontable.length;
			var sav=this.getView().getModel("mocmodel").getData().empdetails.Savsub;
			  var Closure=this.getView().getModel("mocmodel").getData().empdetails.Closure;
			  var changetype=this.getView().byId("changetype").getValue();
		
			 var changetype=this.getView().byId("changetype").getValue();
			 
			  if(this.getView().byId("pu").getValue()===""){
					new sap.m.MessageBox.warning("Please Select Plant Unit");
				}
				else if(this.getView().byId("significant").getValue()===""){
					new sap.m.MessageBox.warning("Please Select Significant change");
				}
				else if(this.getView().byId("changetype").getValue()===""){
					new sap.m.MessageBox.warning("Please Select Change Type");
				}
				else if((this.getView().byId("empno").getValue()==="")&&(changetype==="Personal")){
					new sap.m.MessageBox.warning("Please Select Employee Number");
				}
				else if((this.getView().byId("ndept").getValue()==="")&&(changetype==="Personal")){
					new sap.m.MessageBox.warning("Please Select New Department");
				}
			 
				
						 
			
				
			
			 
				   else{
			 
			
			var t=this;
		 var savedata={
				"MocNum":this.getView().getModel("mocmodel").getData().empdetails.MocNum,
				"Pernr":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
				"MocTitle":this.getView().byId("mt").getValue(),
				"ChangeType":this.getView().byId("changetype").getValue(),
				"Persarea":this.getView().byId("pu").getValue(),
				"EmpNameId":this.getView().getModel("mocmodel").getData().empdetails.EmpNameId,
				"Dept":this.getView().getModel("mocmodel").getData().empdetails.Dept,
				"MocDate":mocdate,
				"DesigEmpId":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
				"NewDept":this.getView().byId("ndept").getValue(),
				"Bukrs":this.getView().getModel("mocmodel").getData().empdetails.Bukrs,
				"Werks":this.getView().getModel("mocmodel").getData().empdetails.Werks,
				"KindChange":this.getView().byId("kc").getValue(),
				"DateFrom":datefrom,
				"DateTo":dateto,
				"Significant":this.getView().byId("significant").getValue(),
				"Planned":this.getView().byId("planned").getValue(),
				"BriefRole":this.getView().byId("briefrole").getValue(),
				"Reasons":this.getView().byId("reasons").getValue(),
				"PurposeChange":this.getView().byId("purposechange").getValue(),
				"PresentPrblm":this.getView().byId("PresentPrblm").getValue(),
				"DetailsChange":this.getView().byId("detailschange").getValue(),
				"Benifits":this.getView().byId("benifits").getValue(),
				"Status":this.getView().getModel("mocmodel").getData().empdetails.Status,
				"ApprId":this.getView().getModel("mocmodel").getData().empdetails.ApprId,
				"ApprComm":this.getView().getModel("mocmodel").getData().empdetails.ApprComm,
				"Zdate":null,
				"Zstatus":this.getView().getModel("mocmodel").getData().empdetails.Zstatus,
				"Zparameter":"E",
				"Savsub":this.sav,
				"Closure":this.getView().getModel("mocmodel").getData().empdetails.Closure,
				"AppRej":this.getView().getModel("mocmodel").getData().empdetails.AppRej,
				"zhr_t_moc_actionSet":array1,
				"ZHR_T_MOC_ATTACHSet":arr,
				"ZHR_T_MOC_APPROVSet":arr,
				"zhr_t_moc_checkSet":checklisttable,
				"zhr_t_moc_commSet":arr,
				"BenifitsExc":this.getView().byId("BenefitsExpectedF").getValue(),
				"BenifitsTan":this.getView().byId("BenefitsAccruedF").getValue(),
				"BenifitsIn":this.getView().byId("BenefitsAccruedTangible").getValue()

				
		}
		
		 
		 var t=this;
		 sap.m.MessageBox.information("Once Save Plant Unit,Significant,Change Type,Employee Number,New Department Should Not Editable", {
				icon:MessageBox.Icon.Information,
        		title:"Information",                                   // default
			    onClose: null,                                       // default
			                                          // default
			    actions:[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.NO], 
			   
			    onClose:function(oAction){
			    if(oAction===MessageBox.Action.OK){
			    	var that=this;
					var mocsaveurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
					mocsaveurl.create("/zhr_t_mocSet",savedata,{
						success:function(odata,responsedata){
							var action="OK";
							that.mocnumber=responsedata.data.MocNum;
							  sap.m.MessageBox.success("Moc No.'"+that.mocnumber+"' Saved succesfully", {
			  				    title: "Success",                                    // default
			  				    onClose: null,                                       // default
			  				    styleClass: "",                                      // default
			  				    actions: [sap.m.MessageBox.Action.OK],                 // default
			  				    emphasizedAction: sap.m.MessageBox.Action.OK,        // default
			  				    initialFocus: null,                                  // default
			  				    textDirection: sap.ui.core.TextDirection.Inherit ,
			  				    onClose:function(){
			  				    if(action==="OK"){
			  				    
			  				    
			  				    	var oRouter=t.getOwnerComponent().getRouter();
									oRouter.navTo("Homepage");
			  				    }
			  				    }
			  				});
						},
						error:function(error){
							var message=error;
							var msg=$(error.response.body).find('message').first().text();
							new sap.m.MessageBox.error(msg);
						}
						
					})
			    }
			    }
		 });
	
						 
				   	 
			 
	  }	 
		},
		mocsubmit:function(evt){
			var arr=[];var obj={};
			arr.push(obj);
			var nul=arr;
			var array1;
			obj={};
			
			  var sav=this.getView().getModel("mocmodel").getData().empdetails.Savsub;
			  var Closure=this.getView().getModel("mocmodel").getData().empdetails.Closure;

		    //////////////savsub/////////////////
   
			
            //////////////date validation///////////////////
			  
		      var mocdate=this.getView().byId("mocdate").getValue();
				/*var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy/dd/MM"});
				var d = frmt.format(new Date(mocdate));*/
				 mocdate=new Date(mocdate);
				mocdate= new Date(mocdate.setHours("00","00","00","00"));
		       mocdate = new Date(mocdate.getTime() + mocdate.getTimezoneOffset() * (-60000));
		    
				var datefrom=this.getView().byId("datefrom").getValue();
				if((datefrom==="")||(datefrom===null)){
					datefrom=null;
				}else{
		       /*var d2 = frmt.format(new Date(datefrom));*/
				 datefrom=new Date(datefrom);
				datefrom= new Date(datefrom.setHours("00","00","00","00"));
		       datefrom = new Date(datefrom.getTime() + datefrom.getTimezoneOffset() * (-60000));
				}

		       var dateto=this.getView().byId("todate").getValue();
		       if((dateto==="")||(dateto===null)){
		       	dateto=null;
		       }else{
				/*var d3 = frmt.format(new Date(dateto));*/
			    dateto=new Date(dateto);
				dateto= new Date(dateto.setHours("00","00","00","00"));
		      dateto = new Date(dateto.getTime() + dateto.getTimezoneOffset() * (-60000));
		       }
			///////////////////////////////////////////////////////////
			var ar=[];var ar1=[];
			var actiontable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/actiontable")));

			var actiontable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/actiontable")));
        
			for(var i=0;i<actiontable.length;i++){
			//actiontable[i].TargetDate=new Date(actiontable[i].TargetDate);
				delete actiontable[i].__metadata;
				ar.push(actiontable[i]);
				ar[i].TargetDate=new Date(ar[i].TargetDate);
			}
			var checklisttable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/checklisttable")));
			for(var i=0;i<checklisttable.length;i++){
				delete checklisttable[i].__metadata;
				ar1.push(checklisttable[i]);
			}
			
			var actlen=actiontable.length;
			
			///////////////////action table validation/////////////////////
			 if(actiontable.length===0){
				 	
				 	array1=arr;
				 	
				 	
				 }
				 	else{
				 		array1=actiontable;
				 	}
			
			var changetype=this.getView().byId("changetype").getValue();
			var kind_change=this.getView().byId("kc").getValue();
			
			var fileupload=this.getView().byId("fileupload").getModel("mocmodel").getData().fileupload;
			   for (var k=0;k<fileupload.length;k++){
				   	var mand=fileupload[k].Docname;
			   	var m="";
				    if((fileupload[k].Mandatory==="X")&&(fileupload[k].DocDesc==="")||(sav==="F")&&(fileupload[k].DocDescF==="")&&((fileupload[k].Mandatory==="X"))){
					  
							m=1;
					break;
						
					}
					  }
					
			 for(var i=0;i<checklisttable.length;i++){
					var SrNo=checklisttable[i].SrNo;
					var msg="";
					/* if((checklisttable[i].YesNo==="")){
						msg=3;
                 break;
						
					}*/
					  if((checklisttable[i].YesNo==="")&&(checklisttable[i].Comments==="")){
						msg=0;
                 break;
						
					}
					
					else if((checklisttable[i].YesNo==="Yes")&&(checklisttable[i].Comments==="")){
						msg=1;
                 break;
						
					}
					
				/*	else if((changetype==="Organizational")){
						if((checklisttable[i].YesNo==="Yes")&&(checklisttable[i].SrNo==="0010")&&(fileupload[i].SrNo==="0009")&&(fileupload[i].DocDesc==="")){
						var msg=3;
						break;
					}
			 }*/
		
			 }
			 var rsig=this.getView().byId("significant").getValue();
			/////////////////validations////////////////////////////////////////
			if(this.getView().byId("mt").getValue()===""){
				new sap.m.MessageBox.warning("Please Fill MOC Title");
			}
			else if(this.getView().byId("pu").getValue()===""){
				new sap.m.MessageBox.warning("Please Select Plant Unit");
			}
			else if(this.getView().byId("significant").getValue()===""){
				new sap.m.MessageBox.warning("Please Select Significant change");
			}
			else if(this.getView().byId("changetype").getValue()===""){
				new sap.m.MessageBox.warning("Please Select Change Type");
			}
			else if(((this.getView().byId("empno").getValue()==="")&&(changetype==="Personal"))){
				new sap.m.MessageBox.warning("Please Fill Employee Number");
			}
			else if(((this.getView().byId("ndept").getValue()==="")&&(changetype==="Personal"))){
				new sap.m.MessageBox.warning("Please Fill New Department");
			}
			/////////////////////////////////////////////////////////
			else if(this.getView().byId("mocdate").getValue()===""){
				new sap.m.MessageBox.warning("Please Fill MOC Date");
			}
			else if(this.getView().byId("kc").getValue()===""){
				new sap.m.MessageBox.warning("Please Select Kind Of Change");
			}
			else if((kind_change==="Temporary")&&((datefrom===""))){
				new sap.m.MessageBox.warning("Please Fill From Date");
			}
			else if((kind_change==="Temporary")&&((dateto===""))){
				new sap.m.MessageBox.warning("Please Fill To Date");
			}
			else if(this.getView().byId("planned").getValue()===""){
				new sap.m.MessageBox.warning("Please Select Planned Change");
			}
			
			/////////////////////////////////////////////////////////////
			
			else if(((this.getView().byId("briefrole").getValue()==="")&&(changetype==="Personal"))){
				new sap.m.MessageBox.warning("Please Fill BriefRole Change");
			}
			else if((this.getView().byId("PresentPrblm").getValue()==="")&&(changetype!=="Personal")){
				new sap.m.MessageBox.warning("Please Fill Present Problem Change");
			}
			else if(((this.getView().byId("purposechange").getValue()==="")&&(changetype==="Personal"))||((this.getView().byId("purposechange").getValue()==="")&&(changetype!=="Personal"))){
				new sap.m.MessageBox.warning("Please Fill Purpose Change");
			}
			
			else if((this.getView().byId("reasons").getValue()==="")&&(rsig==="Yes")){
				new sap.m.MessageBox.warning(" Please Fill Reasons if Significant Change");
			}
			else if((this.getView().byId("detailschange").getValue()==="")){
				new sap.m.MessageBox.warning("Please Fill Detail Of Change");
			}
			else if((this.getView().byId("benifits").getValue()==="")&&(changetype!=="Personal")){
				new sap.m.MessageBox.warning("Please Fill Benefits Expected Change");
			}
			///////////////////////////////////////////////////////////////////////////////////////////////////////////
			
			else if(((this.getView().byId("BenefitsExpectedF").getValue()==="")&&(changetype!=="Personal")&&(Closure==="X"))){
				new sap.m.MessageBox.warning("Please Fill BenefitsExpected Final Change");
			}
			else if(((this.getView().byId("BenefitsAccruedF").getValue()==="")&&(changetype!=="Personal")&&(Closure==="X"))){
				new sap.m.MessageBox.warning("Please Fill Benefits Accrued Tangible Change");
			}
			else if((this.getView().byId("BenefitsAccruedTangible").getValue()==="")&&(changetype!=="Personal")&&(Closure==="X")){
				new sap.m.MessageBox.warning("Please Fill Benefits Accrued InTangible Change");
			}
			/*else if((this.getView().byId("reasonsF").getValue()==="")&&(changetype==="Organizational")&&(Closure==="X")){
				new sap.m.MessageBox.warning("Plaese Fill Final Reasons if Significant Change");
			}
			else if((this.getView().byId("detailschangeF").getValue()==="")&&(changetype==="Organizational")&&(Closure==="X")){
				new sap.m.MessageBox.warning("Please Fill Final Detail Of Change");
			}
			else if((this.getView().byId("benifitsF").getValue()==="")&&(changetype==="Organizational")&&(Closure==="X")){
				new sap.m.MessageBox.warning("Please Fill Final Benefits Expected Change");
			}
			*/
			
			
			else if(actlen<3&&changetype!=="Personal"){
				new sap.m.MessageBox.warning("Add Minimum Three Action Plan Records");
			}
			else if(msg === 0){
			  	new sap.m.MessageBox.warning("Please Fill '"+SrNo+"' Details For CheckList Table ");
							
			  }
			
			else if(msg === 1){
				  	new sap.m.MessageBox.warning("Please Fill '"+SrNo+"' Comment For CheckList Table ");
								
				  }
				 
			/*else if(msg===3){
				 
				 	
				 
					  new sap.m.MessageBox.warning("Please Fill Yes/No For'"+checklisttable[i].SrNo+"' Document");
							
						
				 }*/
				  else if(msg===""){
					  
				 if(m===1){
		
		  new sap.m.MessageBox.warning("Please Upload '"+mand+"' Document");
                  }
						 
				else if(this.mocnumber==="E"){
					
					 
					
					var t=this;
				 var savedata={
						"MocNum":this.getView().getModel("mocmodel").getData().empdetails.MocNum,
						"Pernr":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
						"MocTitle":this.getView().byId("mt").getValue(),
						"ChangeType":this.getView().byId("changetype").getValue(),
						"Persarea":this.getView().byId("pu").getValue(),
						"EmpNameId":this.getView().getModel("mocmodel").getData().empdetails.EmpNameId,
						"Dept":this.getView().getModel("mocmodel").getData().empdetails.Dept,
						"MocDate":mocdate,
						"DesigEmpId":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
						"NewDept":this.getView().byId("ndept").getValue(),
						"Bukrs":this.getView().getModel("mocmodel").getData().empdetails.Bukrs,
						"Werks":this.getView().getModel("mocmodel").getData().empdetails.Werks,
						"KindChange":this.getView().byId("kc").getValue(),
						"DateFrom":datefrom,
						"DateTo":dateto,
						"Significant":this.getView().byId("significant").getValue(),
						"Planned":this.getView().byId("planned").getValue(),
						"BriefRole":this.getView().byId("briefrole").getValue(),
						"Reasons":this.getView().byId("reasons").getValue(),
						"PurposeChange":this.getView().byId("purposechange").getValue(),
						"PresentPrblm":this.getView().byId("PresentPrblm").getValue(),
						"DetailsChange":this.getView().byId("detailschange").getValue(),
						"Benifits":this.getView().byId("benifits").getValue(),
						"Status":this.getView().getModel("mocmodel").getData().empdetails.Status,
						"ApprId":this.getView().getModel("mocmodel").getData().empdetails.ApprId,
						"ApprComm":this.getView().getModel("mocmodel").getData().empdetails.ApprComm,
						"Zdate":null,
						"Zstatus":this.getView().getModel("mocmodel").getData().empdetails.Zstatus,
						"Zparameter":"E",
						"Savsub":"T",
						"Closure":this.getView().getModel("mocmodel").getData().empdetails.Closure,
						"AppRej":this.getView().getModel("mocmodel").getData().empdetails.AppRej,
						"zhr_t_moc_actionSet":array1,
						"ZHR_T_MOC_ATTACHSet":arr,
						"ZHR_T_MOC_APPROVSet":arr,
						"zhr_t_moc_checkSet":checklisttable,
						"zhr_t_moc_commSet":arr,
						"BenifitsExc":this.getView().byId("BenefitsExpectedF").getValue(),
						"BenifitsTan":this.getView().byId("BenefitsAccruedF").getValue(),
						"BenifitsIn":this.getView().byId("BenefitsAccruedTangible").getValue()

						
				}
				
				
				var t=this;
				var mocsaveurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
				mocsaveurl.create("/zhr_t_mocSet",savedata,{
					success:function(odata,responsedata){
						var action="OK";
						t.mocnumber=responsedata.data.MocNum;
						  sap.m.MessageBox.success("Moc No.'"+t.mocnumber+"' Submitted succesfully", {
		  				    title: "Success",                                    // default
		  				    onClose: null,                                       // default
		  				    styleClass: "",                                      // default
		  				    actions: [sap.m.MessageBox.Action.OK],                 // default
		  				    emphasizedAction: sap.m.MessageBox.Action.OK,        // default
		  				    initialFocus: null,                                  // default
		  				    textDirection: sap.ui.core.TextDirection.Inherit ,
		  				    onClose:function(){
		  				    if(action==="OK"){
		  				    
		  				    
		  				    	var oRouter=t.getOwnerComponent().getRouter();
								oRouter.navTo("Homepage");
		  				    }
		  				    }
		  				});
					},
					error:function(error){
						var message=error;
						var msg=$(error.response.body).find('message').first().text();
						new sap.m.MessageBox.error(msg);
					}
					
				})
					
					
					 
						 
				}
			else {
		 	var t=this;
			 t.getView().byId("changetype").setEditable(false);
			
		 var submitdata={
				 "MocNum":t.mocnumber,
				 
					"Pernr":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
					"MocTitle":this.getView().byId("mt").getValue(),
					"ChangeType":this.getView().byId("changetype").getValue(),
					"Persarea":this.getView().byId("pu").getValue(),
					"EmpNameId":this.getView().getModel("mocmodel").getData().empdetails.EmpNameId,
					"Dept":this.getView().getModel("mocmodel").getData().empdetails.Dept,
					"MocDate":mocdate,
					"DesigEmpId":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
					"NewDept":this.getView().byId("ndept").getValue(),
					"Bukrs":this.getView().getModel("mocmodel").getData().empdetails.Bukrs,
					"Werks":this.getView().getModel("mocmodel").getData().empdetails.Werks,
					"KindChange":this.getView().byId("kc").getValue(),
					"DateFrom":datefrom,
					"DateTo":dateto,
					"Significant":this.getView().byId("significant").getValue(),
					"Planned":this.getView().byId("planned").getValue(),
					"BriefRole":this.getView().byId("briefrole").getValue(),
					"Reasons":this.getView().byId("reasons").getValue(),
					"PurposeChange":this.getView().byId("purposechange").getValue(),
					"PresentPrblm":this.getView().byId("PresentPrblm").getValue(),
					"DetailsChange":this.getView().byId("detailschange").getValue(),
					"Benifits":this.getView().byId("benifits").getValue(),
					"Status":this.getView().getModel("mocmodel").getData().empdetails.Status,
					"ApprId":this.getView().getModel("mocmodel").getData().empdetails.ApprId,
					"ApprComm":this.getView().getModel("mocmodel").getData().empdetails.ApprComm,
					"Zdate":null,
					"Zstatus":this.getView().getModel("mocmodel").getData().empdetails.Zstatus,
					"Zparameter":"E",
					"Savsub":"T",
					"Closure":this.getView().getModel("mocmodel").getData().empdetails.Closure,
					"AppRej":this.getView().getModel("mocmodel").getData().empdetails.AppRej,
					"zhr_t_moc_actionSet":array1,
					"ZHR_T_MOC_ATTACHSet":arr,
					"ZHR_T_MOC_APPROVSet":arr,
					"zhr_t_moc_checkSet":ar1,
					"zhr_t_moc_commSet":arr,
					
					"BenifitsExc":this.getView().getModel("mocmodel").getData().empdetails.BenifitsExc,
					"BenifitsTan":this.getView().getModel("mocmodel").getData().empdetails.BenifitsTan,
					"BenifitsIn":this.getView().getModel("mocmodel").getData().empdetails.BenifitsIn

				
		}
		
				var that=this;
			var mocsaveurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			mocsaveurl.create("/zhr_t_mocSet",submitdata,{
				success:function(odata,responsedata){
					var oAction="OK";
						var mocnumber=responsedata.data.MocNum;
						
                        sap.m.MessageBox.success("Moc No.'"+mocnumber+"' Submitted succesfully", {
    				    title: "Success",                                    // default
    				    onClose: null,                                       // default
    				    styleClass: "",                                      // default
    				    actions: [sap.m.MessageBox.Action.OK],                 // default
    				    emphasizedAction: sap.m.MessageBox.Action.OK,        // default
    				    initialFocus: null,                                  // default
    				    textDirection: sap.ui.core.TextDirection.Inherit ,
    				    onClose:function(){
    				    if(oAction==="OK"){
    				    
    				    
    				    	var oRouter=that.getOwnerComponent().getRouter();
    						oRouter.navTo("Homepage");
    				    }
    				    }
    				});
					},
				error:function(error){
					var message=error;
					var msg=$(error.response.body).find('message').first().text();
					new sap.m.MessageBox.error(msg);
				}
				
			})
			}
				  }
		},
		approve:function(){
			var arr=[];var obj={}; var obj2={};
			arr.push(obj);
			var nul=arr;
			obj={};
			var array1;
			var ar=[];
			var ar1=[];
			
//////////////date validation///////////////////
			 /////////////date////////////////////////////////////////
		      var mocdate=this.getView().byId("mocdate").getValue();
				/*var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy/dd/MM"});
				var d = frmt.format(new Date(mocdate));*/
				 mocdate=new Date(mocdate);
				mocdate= new Date(mocdate.setHours("00","00","00","00"));
		       mocdate = new Date(mocdate.getTime() + mocdate.getTimezoneOffset() * (-60000));
		    
				var datefrom=this.getView().byId("datefrom").getValue();
				if((datefrom==="")||(datefrom===null)){
					datefrom=null;
				}else{
		       /*var d2 = frmt.format(new Date(datefrom));*/
				 datefrom=new Date(datefrom);
				datefrom= new Date(datefrom.setHours("00","00","00","00"));
		       datefrom = new Date(datefrom.getTime() + datefrom.getTimezoneOffset() * (-60000));
				}

		       var dateto=this.getView().byId("todate").getValue();
		       if((dateto==="")||(dateto===null)){
		       	dateto=null;
		       }else{
			/*	var d3 = frmt.format(new Date(dateto));*/
			    dateto=new Date(dateto);
				dateto= new Date(dateto.setHours("00","00","00","00"));
		      dateto = new Date(dateto.getTime() + dateto.getTimezoneOffset() * (-60000));
		       }
			
			
			var actiontable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/actiontable")));

		      for(var i=0;i<actiontable.length;i++){
			
				delete actiontable[i].__metadata;
				ar.push(actiontable[i]);
				ar[i].TargetDate=new Date(ar[i].TargetDate);
			}
			var checklisttable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/checklisttable")));
			for(var i=0;i<checklisttable.length;i++){
				delete checklisttable[i].__metadata;
				ar1.push(checklisttable[i]);
			}
///////////////////action table validation/////////////////////
			 if(actiontable.length===0){
				 	
				 	array1=arr;
				 	
				 	
				 }
				 	else{
				 		array1=actiontable;
				 	}
			/////////////////validations///////////////
			if(this.getView().byId("acmt").getValue()===""){
				new sap.m.MessageBox.warning("Please Fill Approver Comments");
			}
			else{
			 var t=this;
		 var Approvedata={
				"MocNum":t.mocnumber,
				"Pernr":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
				"MocTitle":this.getView().getModel("mocmodel").getData().empdetails.MocTitle,
				"ChangeType":this.getView().getModel("mocmodel").getData().empdetails.ChangeType,
				"Persarea":this.getView().getModel("mocmodel").getData().empdetails.Persarea,
				"EmpNameId":this.getView().getModel("mocmodel").getData().empdetails.EmpNameId,
				"Dept":this.getView().getModel("mocmodel").getData().empdetails.Dept,
				"MocDate":mocdate,
				"DesigEmpId":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
				"NewDept":this.getView().getModel("mocmodel").getData().empdetails.NewDept,
				"Bukrs":this.getView().getModel("mocmodel").getData().empdetails.Bukrs,
				"Werks":this.getView().getModel("mocmodel").getData().empdetails.Werks,
				"KindChange":this.getView().getModel("mocmodel").getData().empdetails.KindChange,
				"DateFrom":datefrom,
				"DateTo":dateto,
				"Significant":this.getView().getModel("mocmodel").getData().empdetails.Significant,
				"Planned":this.getView().getModel("mocmodel").getData().empdetails.Planned,
				"BriefRole":this.getView().getModel("mocmodel").getData().empdetails.BriefRole,
				"Reasons":this.getView().getModel("mocmodel").getData().empdetails.Reasons,
				"PurposeChange":this.getView().getModel("mocmodel").getData().empdetails.PurposeChange,
				"PresentPrblm":this.getView().getModel("mocmodel").getData().empdetails.PresentPrblm,
				"DetailsChange":this.getView().getModel("mocmodel").getData().empdetails.DetailsChange,
				"Benifits":this.getView().getModel("mocmodel").getData().empdetails.Benifits,
				"Status":this.getView().getModel("mocmodel").getData().empdetails.Status,
				"ApprId":this.getView().getModel("mocmodel").getData().empdetails.ApprId,
				"ApprComm":this.getView().byId("acmt").getValue(),
				"Zdate":this.getView().getModel("mocmodel").getData().empdetails.Zdate,
				"Zstatus":this.getView().getModel("mocmodel").getData().empdetails.Zstatus,
				"Zparameter":"A",
				"Savsub":this.getView().getModel("mocmodel").getData().empdetails.Savsub,
				"Closure":this.getView().getModel("mocmodel").getData().empdetails.Closure,
				"AppRej":"A",
				"zhr_t_moc_actionSet":array1,
				"ZHR_T_MOC_ATTACHSet":arr,
				"ZHR_T_MOC_APPROVSet":arr,
				"zhr_t_moc_checkSet":ar1,
				"zhr_t_moc_commSet":arr,
				"BenifitsExc":this.getView().getModel("mocmodel").getData().empdetails.BenifitsExc,
				"BenifitsTan":this.getView().getModel("mocmodel").getData().empdetails.BenifitsTan,
				"BenifitsIn":this.getView().getModel("mocmodel").getData().empdetails.BenifitsIn


				
		}
		    
				var t=this;
			var mocsaveurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
			mocsaveurl.create("/zhr_t_mocSet",Approvedata,{
				success:function(odata,responsedata){
					var oAction="OK";
						var mocnumber=responsedata.data.MocNum;
						
						 sap.m.MessageBox.success("Moc No.'"+mocnumber+"' Approved succesfully", {
		    				    title: "Success",                                    // default
		    				    onClose: null,                                       // default
		    				    styleClass: "",                                      // default
		    				    actions: sap.m.MessageBox.Action.OK,                 // default
		    				    emphasizedAction: sap.m.MessageBox.Action.OK,        // default
		    				    initialFocus: null,                                  // default
		    				    textDirection: sap.ui.core.TextDirection.Inherit ,
		    				    onClose:function(){
		    				    if(oAction==="OK"){
		    				    
		    				    t.getView().byId("acmt").setValue(null);
		    				    	var oRouter=t.getOwnerComponent().getRouter();
		    						oRouter.navTo("Homepage");
		    				    }
		    				    }
		    				});

						
					/*var oRouter=t.getOwnerComponent().getRouter();
					oRouter.navTo("Homepage");*/
				},
				error:function(error){
					var message=error;
					var msg=$(error.response.body).find('message').first().text();
					new sap.m.MessageBox.error(msg);
				}
				
			})
			}
		},
		/////////////////////////////////////////////////////////////////////////
		reject:function(evt){
			var arr=[];var obj={}; var obj2={};
			arr.push(obj);
			var nul=arr;
			obj={};
			var array1;
			var ar=[];
			var ar1=[];
			var actiontable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/actiontable")));

			var actiontable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/actiontable")));

			for(var i=0;i<actiontable.length;i++){
			//actiontable[i].TargetDate=new Date(actiontable[i].TargetDate);
				delete actiontable[i].__metadata;
				ar.push(actiontable[i]);
				ar[i].TargetDate=new Date(ar[i].TargetDate);
			}
			var checklisttable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/checklisttable")));
			for(var i=0;i<checklisttable.length;i++){
				delete checklisttable[i].__metadata;
				ar1.push(checklisttable[i]);
			}
			/*var Approverstable=JSON.parse(JSON.stringify(this.getView().getModel("mocmodel").getProperty("/Approverstable")));
			for(var i=0;i<Approverstable.length;i++){
				delete Approverstable[i].__metadata;
				Approverstable.push(Approverstable[i]);
			}*/
			
              //////////////date validation///////////////////
			 /////////////date////////////////////////////////////////
		      var mocdate=this.getView().byId("mocdate").getValue();
				/*var frmt = sap.ui.core.format.DateFormat.getDateInstance({pattern:"yyyy/dd/MM"});
				var d = frmt.format(new Date(mocdate));*/
				 mocdate=new Date(mocdate);
				mocdate= new Date(mocdate.setHours("00","00","00","00"));
		       mocdate = new Date(mocdate.getTime() + mocdate.getTimezoneOffset() * (-60000));
		    
				var datefrom=this.getView().byId("datefrom").getValue();
				if((datefrom==="")||(datefrom===null)){
					datefrom=null;
				}else{
		     /*  var d2 = frmt.format(new Date(datefrom));*/
				 datefrom=new Date(datefrom);
				datefrom= new Date(datefrom.setHours("00","00","00","00"));
		       datefrom = new Date(datefrom.getTime() + datefrom.getTimezoneOffset() * (-60000));
				}

		       var dateto=this.getView().byId("todate").getValue();
		       if((dateto==="")||(dateto===null)){
		       	dateto=null;
		       }else{
				/*var d3 = frmt.format(new Date(dateto));*/
			    dateto=new Date(dateto);
				dateto= new Date(dateto.setHours("00","00","00","00"));
		      dateto = new Date(dateto.getTime() + dateto.getTimezoneOffset() * (-60000));
		       }
///////////////////action table validation/////////////////////
				 if(actiontable.length===0){
					 	
					 	array1=arr;
					 	
					 	
					 }
					 	else{
					 		array1=actiontable;
					 	}
                /////////////////validations///////////////
			if(this.getView().byId("acmt").getValue()===""){
				new sap.m.MessageBox.warning("Please Fill Approver Comments");
			}
			
			else{
			var t=this;
		 var Rejectdata={
				"MocNum":t.mocnumber,
				"Pernr":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
				"MocTitle":this.getView().getModel("mocmodel").getData().empdetails.MocTitle,
				"ChangeType":this.getView().getModel("mocmodel").getData().empdetails.ChangeType,
				"Persarea":this.getView().getModel("mocmodel").getData().empdetails.Persarea,
				"EmpNameId":this.getView().getModel("mocmodel").getData().empdetails.EmpNameId,
				"Dept":this.getView().getModel("mocmodel").getData().empdetails.Dept,
				"MocDate":mocdate,
				"DesigEmpId":this.getView().getModel("mocmodel").getData().empdetails.Pernr,
				"NewDept":this.getView().getModel("mocmodel").getData().empdetails.NewDept,
				"Bukrs":this.getView().getModel("mocmodel").getData().empdetails.Bukrs,
				"Werks":this.getView().getModel("mocmodel").getData().empdetails.Werks,
				"KindChange":this.getView().getModel("mocmodel").getData().empdetails.KindChange,
				"DateFrom":datefrom,
				"DateTo":dateto,
				"Significant":this.getView().getModel("mocmodel").getData().empdetails.Significant,
				"Planned":this.getView().getModel("mocmodel").getData().empdetails.Planned,
				"BriefRole":this.getView().getModel("mocmodel").getData().empdetails.BriefRole,
				"Reasons":this.getView().getModel("mocmodel").getData().empdetails.Reasons,
				"PurposeChange":this.getView().getModel("mocmodel").getData().empdetails.PurposeChange,
				"PresentPrblm":this.getView().getModel("mocmodel").getData().empdetails.PresentPrblm,
				"DetailsChange":this.getView().getModel("mocmodel").getData().empdetails.DetailsChange,
				"Benifits":this.getView().getModel("mocmodel").getData().empdetails.Benifits,
				"Status":this.getView().getModel("mocmodel").getData().empdetails.Status,
				"ApprId":this.getView().getModel("mocmodel").getData().empdetails.ApprId,
				"ApprComm":this.getView().byId("acmt").getValue(),
				"Zdate":this.getView().getModel("mocmodel").getData().empdetails.Zdate,
				"Zstatus":this.getView().getModel("mocmodel").getData().empdetails.Zstatus,
				"Zparameter":"A",
				"Savsub":this.getView().getModel("mocmodel").getData().empdetails.Savsub,
				"Closure":this.getView().getModel("mocmodel").getData().empdetails.Closure,
				"AppRej":"R",
				"zhr_t_moc_actionSet":array1,
				"ZHR_T_MOC_ATTACHSet":arr,
				"ZHR_T_MOC_APPROVSet":arr,
				"zhr_t_moc_checkSet":ar1,
				"zhr_t_moc_commSet":arr,
				/*"BriefRoleF":this.getView().getModel("mocmodel").getData().empdetails.BriefRoleF,
				"BenifitsF":this.getView().getModel("mocmodel").getData().empdetails.BenifitsF,
				"DetailsChangeF":this.getView().getModel("mocmodel").getData().empdetails.DetailsChangeF,
				"PresentPrblm_F":this.getView().getModel("mocmodel").getData().empdetails.PresentPrblm_F,
				"PurposeChangeF":this.getView().getModel("mocmodel").getData().empdetails.PurposeChangeF,
				"ReasonsF":this.getView().getModel("mocmodel").getData().empdetails.ReasonsF*/
				"BenifitsExc":this.getView().getModel("mocmodel").getData().empdetails.BenifitsExc,
				"BenifitsTan":this.getView().getModel("mocmodel").getData().empdetails.BenifitsTan,
				"BenifitsIn":this.getView().getModel("mocmodel").getData().empdetails.BenifitsIn


				
		}
		 var oAction1="OK";
		 var t=this;
		 sap.m.MessageBox.warning("Are You Sure Want To Reject", {
				icon:MessageBox.Icon.WARNING,
        		title:"Reject",                                   // default
			    onClose: null,                                       // default
			                                          // default
			    actions:[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.NO], 
			   
			    onClose:function(oAction){
			    if(oAction===MessageBox.Action.OK){
					
					var mocsaveurl=new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZHR_OD_MOC_SRV/");
					mocsaveurl.create("/zhr_t_mocSet",Rejectdata,{
						success:function(odata,responsedata){
							var oAction="OK";
								var mocnumber=responsedata.data.MocNum;
								
								 sap.m.MessageBox.error("Moc No.'"+mocnumber+"' Rejected", {
				    				    title: "Error",                                    // default
				    				    onClose: null,                                       // default
				    				    styleClass: "",                                      // default
				    				    actions: sap.m.MessageBox.Action.OK,                 // default
				    				    emphasizedAction: sap.m.MessageBox.Action.OK,        // default
				    				    initialFocus: null,                                  // default
				    				    textDirection: sap.ui.core.TextDirection.Inherit ,
				    				    onClose:function(){
				    				    if(oAction==="OK"){
				    				    
				    				    	 t.getView().byId("acmt").setValue(null);
				    				    	var oRouter=t.getOwnerComponent().getRouter();
				    						oRouter.navTo("Homepage");
				    				    }
				    				    }
				    				});

								
							/*var oRouter=t.getOwnerComponent().getRouter();
							oRouter.navTo("Homepage");*/
						},
						error:function(error){
							var message=error;
							var msg=$(error.response.body).find('message').first().text();
							new sap.m.MessageBox.error(msg);
						}
						
					})
			    	
			    }
			    }
			});
	
			
		}
		},
		onAfterRendering:function(){
			
		}
	});
});