// JavaScript source code
/* custom javascript developed by amit */
MyJsClass = {

    /* Select the Server call type if you want return data first then select false other wise true*/
    IsAsynchronousCall : [true,false],
    /* Select the Server call Data type*/
    DataType: ["json", "html"],
    /* Select the Server content Data type if using .serialize() then use contentType[1] otherwise use contentType[0]*/
    contentType: ["application/json; charset=utf-8", "application/x-www-form-urlencoded;"],                    // content type sent to server
    /*Server call Method*/
    SetverCallType:["POST","GET","PUT","DELETE"],
    /*   =========================================================Ajax Server Call Function(Method For POST) ============================================================================
                                      
                                      Paramaters="data which you want to send on server method"
                                      OnSuccess="After success which method you want to call"
                                      OnFailure="When Error which method you want to call"
                                      IsParamaterRequired="Condition to make sure that you have passed Paramaters"
                                      UrlOrControler="Server side methods path(relative)"
                                      DataType="Which data type you want to send on server if you want to add more datatypes then add them to MyJsClass.DataType(see above)"
                                      contentType="Which content type you want to send on server if you want to add more contenttypes then add them to MyJsClass.DataType(see above)"


    Note: contentType[0]=>for JSON.stringfy and contentType[1]=> for .serialize() Data
    ====================================================================================================================================================================================== */

    CallServer: function (Paramaters, OnSuccess, OnFailure, IsParamaterRequired, UrlOrControler, DataType, contentType,IsaSynchronous,GetPost) {
        if (contentType == null || contentType == "", contentType == undefined) {
            contentType = this.contentType[0];
        }
        if (IsaSynchronous == null || IsaSynchronous == "", IsaSynchronous == undefined) {
            IsaSynchronous = this.IsAsynchronousCall[0];
        }
         if (GetPost == null || GetPost == "", GetPost == undefined) {
            GetPost = this.SetverCallType[0];
        }
        if (IsParamaterRequired == true) {
            $.ajax({
            
                type: GetPost, 		                        //GET or POST or PUT or DELETE verb
                url: UrlOrControler, 		                // Location of the service
                data: Paramaters, 		                    //Data sent to server 
                contentType: contentType,		            // content type sent to server
                dataType: DataType, 	                    //Expected data format from server
                processdata: true, 	                        //True or False
                async:IsaSynchronous,
                success: OnSuccess,                         // When Service call runs
                error: OnFailure 	                        // When Service call fails
            });
        } else {
            $.ajax({
                type: GetPost, 		                        //GET or POST or PUT or DELETE verb
                url: UrlOrControler, 		                // Location of the service 
                contentType: contentType,		            // content type sent to server
                dataType: DataType, 	                    //Expected data format from server
                processdata: true, 	                        //True or False
                async:IsaSynchronous,
                success: OnSuccess,                         // When Service call runs
                error: OnFailure 	                        // When Service call fails
            });
        }
    },
    /*=======================================================================================================
                                  End  Ajax Server Call Function 
   ==========================================================================================================*/
    /*===========================================================================================================
                                 Ajax Server Call For AutoComplete Request 
      ============================================================================================================*/
    AJAX_Textbox_Stored: "und",
    BindDDL: function (AJAX_Textbox, ServerMethod, AjaxListSelect) {
        AJAX_Textbox_Stored = AJAX_Textbox;
        $("#" + AJAX_Textbox).autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: ServerMethod,
                    data: { query: request.term },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: 'GET',
                    success: function (data) {
                        response($.map(data, function (item) {
                            return {
                                label: item.ProductName,
                                value: item.ProductName
                            }
                        }));
                    }, //this.AjaxCallSuccess,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert(textStatus);
                        alert(errorThrown);
                    }
                });
            },
            minLength: 1,
            select: function (event, ui) {
                AjaxListSelect(event, ui);
            }
        });
    },
     BindDDList: function (ddl, optionData, idfield, textfield) {
                if (idfield == undefined || idfield == null) {
                    idfield = "Id";
                }
                if (textfield == undefined || textfield == null) {
                    textfield = "Name";
                }
                // To clear dropdown values we need to write code like as shown below
                $("#" + ddl).empty();
                // Bind new values to dropdown
                var i = 0;
                if ($(optionData).length > 0) {
                    $(optionData).each(function (k, v) {
                        // Create option
                        var option = $("<option />");
                        if (i == 0) {
                            option.attr("value", '0').text('Select All');
                            $("#" + ddl).append(option);
                            option = $("<option />");
                            option.attr("value", $(v).prop(idfield)).text($(v).prop(textfield));
                        } else {
                            option.attr("value", $(v).prop(idfield)).text($(v).prop(textfield));
                        }
                        $("#" + ddl).append(option);
                        ++i;
                    });

                } else {
                    var option = $("<option />");
                    option.attr("value", '0').text('Select All');
                    $("#" + ddl).append(option);
                }
                $("#" + ddl).val(5).trigger("chosen:updated");
            }
    /*---------------------------------------------------------------------------------------------------------
                             End  Ajax Server Call For AutoComplete Request 
----------------------------------------------------------------------------------------------------------*/
};

/*Play With HTML Table*/
MyTable = {
    RowNo: 0,
    IsSeriolNoWant: true,
    LblIdForGrandTotal: "GrandTotal",   // Give Default Id to grandtotal lavel 
    /* Insert Row With Cells HTML
    GtotalCalculateColumnNo=-1 when Grand total is not required
     Ex. 
                  var InnerHtmlList = new Array(5);
                  InnerHtmlList[0] = 'this.RowNo'; // SrNo 
    */
    createTableRow: function (TableId, NoOfCells, CellInnerDataList, IsSeriolNoWant, GtotalCalculateColumnNo, RowTags) {
        this.RowNo += 1;
        var table = document.getElementById(TableId);    //Get Table Instance
        var row = table.insertRow(1);
        if (RowTags == null || RowTags == undefined) {
            for (var i = 0; i < NoOfCells; i++) {
                this.InsertCellToRow(row, CellInnerDataList[i], i, null);
            }
        } else {
            for (var i = 0; i < NoOfCells; i++) {
                this.InsertCellToRow(row, CellInnerDataList[i], i, RowTags[i]);
            }
        }
        if (IsSeriolNoWant) {
            this.adjustSrNO(TableId);
        }
        if (GtotalCalculateColumnNo != -1) {
            $("#" + this.LblIdForGrandTotal).html(this.CalculateTotal(TableId));
        }
    },
    /* Insert  Cells HTML */
    InsertCellToRow: function (row, CellHtml, InsertOrder, RowTag) {
        var cell1 = row.insertCell(InsertOrder);
        cell1.innerHTML = CellHtml;
        if (RowTag == null || RowTag == undefined) {
            //Undefined Do nothing
        }
        else {
            $(cell1).attr("Tag", RowTag);
        }
    },
    /* Renove Row  
    Ex : "<a href='javascripr:void(0);' onclick='MyTable.RemoveRow(this)'> remove </a>"
    */
    RemoveRow: function (RowObject) {
        var TblId = $(RowObject).closest("table").prop("id"); // Get the Table ID from The Clicked Instance of Object
        RowObject.parentNode.parentNode.remove();
        if (this.IsSeriolNoWant) {
            this.adjustSrNO(TblId);
        }
        if (this.LblIdForGrandTotal != null) {
            $("#" + this.LblIdForGrandTotal).html(this.CalculateTotal(TblId));
        }
    },
    /* Adjust SRNO */
    adjustSrNO: function (TableId) {
        var i = $("#" + TableId + " tr:not(:first)").length;
        $("#" + TableId + " tr:not(:first)").each(function (k, v) {
            $(v).find('td:eq(0)').html(i);
            --i;
        });

    },
    CalculateTotal: function (TableId) {
        var GrandTotal = 0.0;
        $("#" + TableId + " tr:not(:first)").find("td:eq(4)").each(function (k, v) {
            GrandTotal += parseFloat($(v).html());
        });
        return GrandTotal;
    },
    AddRow: function (RowObject, removeCurrentRow) {
        Sales.addFilteredRow(RowObject);
        if (removeCurrentRow == null || removeCurrentRow == undefined) { }
        else {
            if (removeCurrentRow) {
                MyTable.RemoveRow(RowObject);
            }
        }

    }
};
/*===============================================================================================================
                                          JS Comman Function
=================================================================================================================*/
SharedViewCommanFunctions = {
    /*-----------------------------------------------------------------------------------------------------------
                                              CheckDuplicate Function 
    -----------------------------------------------------------------------------------------------------------*/
    CheckDuplicate: function (InputValue) {
    var returnVal=false;
        var UrlLink = '/ProfileManagement/CheckDuplicate';
        var UrlData = JSON.stringify({ strEmail: InputValue });
        MyJsClass.CallServer(UrlData, function (result) {
            if (result == 'true') {
                returnVal = false;
            }
            else {
                returnVal = true;
            }
        },
        function (xhr, textStatus, errorThrown) {
        },

        true, UrlLink, MyJsClass.DataType[0],MyJsClass.contentType[0],false);
return returnVal;
    },
    /*-----------------------------------------------------------------------------------------------------------
                                           End CheckDuplicate Function
    -----------------------------------------------------------------------------------------------------------*/
};
/*==============================================================================================================
                                       End JS Comman Function
================================================================================================================*/
/* ========================================================Comprassed=========================================================================

MyJsClass={IsAsynchronousCall:[true,false],DataType:["json","html"],contentType:["application/json; charset=utf-8","application/x-www-form-urlencoded;"],SetverCallType:["POST","GET","PUT","DELETE"],CallServer:function(a,b,c,d,e,f,g,h,i){if(g==null||g=="",g==undefined){g=this.contentType[0]}if(h==null||h=="",h==undefined){h=this.IsAsynchronousCall[0]}if(i==null||i=="",i==undefined){i=this.SetverCallType[0]}if(d==true){$.ajax({type:i,url:e,data:a,contentType:g,dataType:f,processdata:true,async:h,success:b,error:c})}else{$.ajax({type:i,url:e,contentType:g,dataType:f,processdata:true,async:h,success:b,error:c})}},AJAX_Textbox_Stored:"und",BindDDL:function(f,g,h){AJAX_Textbox_Stored=f;$("#"+f).autocomplete({source:function(d,e){$.ajax({url:g,data:{query:d.term},contentType:"application/json; charset=utf-8",dataType:"json",type:'GET',success:function(b){e($.map(b,function(a){return{label:a.ProductName,value:a.ProductName}}))},error:function(a,b,c){alert(b);alert(c)}})},minLength:1,select:function(a,b){h(a,b)}})}};MyTable={RowNo:0,IsSeriolNoWant:true,LblIdForGrandTotal:"GrandTotal",createTableRow:function(a,b,c,d,e,f){this.RowNo+=1;var g=document.getElementById(a);var h=g.insertRow(1);if(f==null||f==undefined){for(var i=0;i<b;i++){this.InsertCellToRow(h,c[i],i,null)}}else{for(var i=0;i<b;i++){this.InsertCellToRow(h,c[i],i,f[i])}}if(d){this.adjustSrNO(a)}if(e!=-1){$("#"+this.LblIdForGrandTotal).html(this.CalculateTotal(a))}},InsertCellToRow:function(a,b,c,d){var e=a.insertCell(c);e.innerHTML=b;if(d==null||d==undefined){}else{$(e).attr("Tag",d)}},RemoveRow:function(a){var b=$(a).closest("table").prop("id");a.parentNode.parentNode.remove();if(this.IsSeriolNoWant){this.adjustSrNO(b)}if(this.LblIdForGrandTotal!=null){$("#"+this.LblIdForGrandTotal).html(this.CalculateTotal(b))}},adjustSrNO:function(a){var i=$("#"+a+" tr:not(:first)").length;$("#"+a+" tr:not(:first)").each(function(k,v){$(v).find('td:eq(0)').html(i);--i})},CalculateTotal:function(a){var b=0.0;$("#"+a+" tr:not(:first)").find("td:eq(4)").each(function(k,v){b+=parseFloat($(v).html())});return b},AddRow:function(a,b){Sales.addFilteredRow(a);if(b==null||b==undefined){}else{if(b){MyTable.RemoveRow(a)}}}};SharedViewCommanFunctions={CheckDuplicate:function(d){var e=false;var f='/ProfileManagement/CheckDuplicate';var g=JSON.stringify({strEmail:d});MyJsClass.CallServer(g,function(a){if(a=='true'){e=false}else{e=true}},function(a,b,c){},true,f,MyJsClass.DataType[0],MyJsClass.contentType[0],false);return e},};

*/
