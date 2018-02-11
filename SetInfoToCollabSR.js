var collabType = document.getElementById("collabType");
var severity_id = document.getElementById("severity");
var severity_name = document.getElementsByName("severity");
var fld24x7 = document.getElementById("fld24x7");
		
		
var envName = document.getElementById("envName");
var summary = document.getElementById("summary");
var description = document.getElementById("description");

var subcomponentDescription = document.getElementById("subcomponentDescription");
var subcomponent = document.getElementById("subcomponent");
var component = document.getElementById("component");

var componentDescription = document.getElementById("componentDescription");
componentDescription.value = "Cloud Operations - COLLABORATION USE ONLY";

var productDescription = document.getElementById("productDescription");

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	collabType.value = "PDIT Cloud Ops";
	if(envName.value == "") {
		summary.value = "POD:" + "<Please input>" + " / "+ request.summary;
	}
	else {
		summary.value = "POD:" + envName.value.split(".")[0] + " / "+ request.summary;
	}
	description.value = request.description;
	if(severity_id.value == "1-Critical") {
		if((outageStatus == "Production is entirely Unusable, Action plan provided, Awaiting Execution") || (outageStatus == "Production is entirely Unusable, Action plan being developed")) {
			summary.value = "Production Unusable:" + summary.value;
		}
		if((outageStatus == "Environment is severely impacted, Action plan being developed") || (outageStatus == "Environment is severely impacted, Action plan provided, Awaiting Execution")) {
			summary.value = "Env Severly Impacted:" + summary.value;
		}		
	}
	if(severity_id.value == "1-Critical") {
		severity_id.value = "2-Significant";
		severity_name[0].value = "2-Significant";
		document.getElementById("fld24x7").click();
	}
	subcomponentDescription.value = request.subcomponentDescription;
	for(var i = 0;i<request.ProductIndex.length;i++) {
		if(productDescription.value == request.ProductIndex[i].split('@')[0]&&subcomponentDescription.value == request.ProductIndex[i].split('@')[2]) {
			component.value = request.ProductIndex[i].split('@')[1];		
			subcomponent.value = request.ProductIndex[i].split('@')[3];
			break;
		}
	}
});


/*
var uspublicsectorpods_temp = text.split('_')[2];
var outageStatus = text.split('_')[3];
if(envName.value == "") {
	summary.value = "POD:" + "<Please input>" + " / "+ text.split('_')[0];
}
else if(uspublicsectorpods_temp!="CDC-Gov") {
	summary.value = "POD:" + envName.value.split(".")[0] + " / "+ text.split('_')[0];
}
else {
	summary.value = "USPUBLICSECTOR:" + "POD:" + envName.value.split(".")[0] + " / "+ text.split('_')[0];
}	


self.port.on("ProductIndex", function setCode(ProductIndex) {
	var productDescription = document.getElementById("productDescription");
			for(var i = 0;i<ProductIndex.length;i++) {
				if(productDescription.value == ProductIndex[i].split('@')[0]&&subcomponentDescription.value == ProductIndex[i].split('@')[2]) {
					component.value = ProductIndex[i].split('@')[1];		
					subcomponent.value = ProductIndex[i].split('@')[3];
					break;
				}
			}
		});
	*/