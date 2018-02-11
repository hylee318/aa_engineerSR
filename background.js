var envName;
var accountName;
var SRNumber;
var ProductIndex = []; 
var PanelID = -100;
	
function trim(str)
{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

//RequestProductInfoFromCSV
var ProductInfo = new XMLHttpRequest();
var ProductInfo_URL = "http://adc00pwx.us.oracle.com/collabsrsa/ComponentCode.csv"+"?_=" + new Date().getTime();
ProductInfo.open('GET',ProductInfo_URL, true);
ProductInfo.send();
ProductInfo.onload = function () {
	if (ProductInfo.readyState === ProductInfo.DONE) {
	    if (ProductInfo.status === 200) {
			var ProductInfo_result = ProductInfo.responseText;
			ProductInfo_result = ProductInfo_result.replace(/\r\n/g,",");
			var ProductInfo_result_array = ProductInfo_result.split(",");
			for(var i = 0;i<ProductInfo_result_array.length;i++) {
				if(i%5==4) {
					ProductIndex.push(ProductInfo_result_array[i]);
				}
			}
	    }
	}
}
	
//Version Check
var manifestData = chrome.runtime.getManifest();
var ExpiredNotification = "ExpiredNotification";
var Version_Check = new XMLHttpRequest();
var Version_URL = "http://adc00pwx.us.oracle.com/collabsrsa/version.txt";
Version_Check.open('GET',Version_URL, true);

Version_Check.send();
Version_Check.onload = function () {
	if (Version_Check.readyState === Version_Check.DONE) {
		if (Version_Check.status === 200) {
			var version_current = Version_Check.responseText;
			if(manifestData.version != version_current) {
				chrome.notifications.create(ExpiredNotification, {
					"type": "basic",
					"iconUrl": chrome.extension.getURL("icons/running.jpg"),
					"title": "EngineerSR Addon is expired",
					"message": "Upgrade to the latest one - Click here for more information"
				});
			}
		}
	}
}

chrome.notifications.onClicked.addListener(function(ExpiredNotification) {
	chrome.tabs.create({url: "https://mosemp.us.oracle.com/epmos/faces/DocumentDisplay?id=2192637.1"});
});

//unique array
function unique5(array){
	var r = [];
	for(var i = 0, l = array.length; i < l; i++) {
		for(var j = i + 1; j < l; j++) {
			if (array[i] === array[j]) {
				j = ++i;
			}
			r.push(array[i]);
		}
	}
	r.sort();
	return r;
}


//create  collab SR
var config = [];
chrome.contextMenus.create({
    id: "CollabSR",
    title: "Create  Collab SR...",
    contexts: ["all"]
});

var CollabSR = new XMLHttpRequest();
var CollabSR_URL = "http://adc00pwx.us.oracle.com/collabsrsa/issue.csv"+"?_=" + new Date().getTime();
CollabSR.open('GET',CollabSR_URL, true);

CollabSR.send();
CollabSR.onload = function () {
  if (CollabSR.readyState === CollabSR.DONE) {
    if (CollabSR.status === 200) {
      var temp = CollabSR.responseText;
      var array = new Array();
		temp = temp.replace(/\r\n/g,",");
		array = temp.split(",");
		var menu1, menu2, template, subcomp;
			
		for(var i = 0; i<array.length; i++) {
			if(i%4==0) {
				menu1 = array[i];
			}
			else if(i%4==1) {
				menu2 = array[i];
			}
			else if(i%4==2) {
				template = array[i];
			}
			else {
				subcomp = array[i];	
				var configItem = {
					menu1: menu1,
					menu2: menu2,
					template: template,
					subcomp: subcomp
				}					
				config.push(configItem);				
			}			
		}
		//init MenuLabel			
		var tempMenus = new Array();
		for(var i = 0; i<config.length; i++) {
			tempMenus[i] = config[i].menu1;
		}
		var MenuLabel = unique5(tempMenus);

		for(var i = 0; i<MenuLabel.length;i++) {
	        chrome.contextMenus.create({
	          id: MenuLabel[i],
		      title: MenuLabel[i],
	          contexts: ["all"],
	          parentId: "CollabSR"
	        });
      	} 

		//init items			
		var Items = new Array();
		for(var k = 0; k<MenuLabel.length; k++) {
			Items[k] = new Array();
			for(var i = 0; i<config.length; i++) {
				if(config[i].menu1 == MenuLabel[k]) {
					Items[k].push(config[i].menu2+"__"+config[i].menu1+"__"+config[i].template+"__"+config[i].subcomp);
				}
			}
			Items[k].sort();
			for(var l = 0; l<Items[k].length; l++) {
				chrome.contextMenus.create({
			        id: Items[k][l],
			        title: Items[k][l].split("_")[0],
			        contexts: ["all"],
			        parentId: MenuLabel[k]
			    });
			}
		}	
    }
  }
}


//Useful Link
chrome.contextMenus.create({
    id: "UsefulLink",
    title: "Useful Links...",
    contexts: ["all"]
});

var ExpressLink = [];
var UsefulLink = new XMLHttpRequest();
var UsefulLink_URL = "http://adc00pwx.us.oracle.com/UsefulLink.csv"+"?_=" + new Date().getTime();
UsefulLink.open('GET',UsefulLink_URL, true);
UsefulLink.send();
UsefulLink.onload = function () {
  if (UsefulLink.readyState === UsefulLink.DONE) {
    if (UsefulLink.status === 200) {
      var array = new Array();
      var item, itemURL;
      var temp = UsefulLink.responseText;
      temp = temp.replace(/\r\n/g,",");
      array = temp.split(",");
      for(var i = 0; i<array.length; i++) {
	  	if(i%2==0) {
			item = array[i];
		}
		else {
			itemURL = array[i];	
			var configItem = {
				item: item,
				itemURL: itemURL
			}					
			ExpressLink.push(configItem);				
		}			
	  }
	//init MenuLabel			
	  var tempMenus = new Array();
		  for(var i = 0; i<ExpressLink.length; i++) {
			tempMenus[i] = ExpressLink[i].item;
		  }
//		  var MenuLabel = unique5(tempMenus);
	      for(var i = 0; i<ExpressLink.length;i++) {
	        chrome.contextMenus.create({
	          id: tempMenus[i],
	          title: tempMenus[i],
	          contexts: ["all"],
	          parentId: "UsefulLink"
	        });
	      }   
	    }
	  }
	}

	chrome.contextMenus.onClicked.addListener(function(info, tab) {
		for(var i =0;i<ExpressLink.length;i++) {
			if(info.menuItemId == ExpressLink[i].item) {
	      		chrome.tabs.create({url: ExpressLink[i].itemURL});
	      		break;
	      	}
	   	 }
	});

	//FM Link
	chrome.contextMenus.create({
	    id: "FM",
	    title: "Search in FleetManager...",
	    contexts: ["all"]
	});

	chrome.contextMenus.create({
	    id: "SearchByPod"+"___"+envName,
	    title: "Search by Pod",
	    contexts: ["all"],
	    parentId: "FM"
	});

	chrome.contextMenus.create({
	    id: "SearchByCustomer"+"___"+accountName,
	    title: "Search by Customer",
	    contexts: ["all"],
	    parentId: "FM"
	});


//copy paste menu	
/////2018/2/3///////////////////////////////////////////////////////////////////////////
	chrome.contextMenus.create({
	    id: "CopyPaste",
	    title: "Create Copy / Paste...",
	    contexts: ["all"]
	});

	chrome.contextMenus.create({
	    id: "ManageCopyPaste",
	    title: "ManageCopyPaste",
	    contexts: ["all"],
		parentId: "CopyPaste"
	});
	chrome.contextMenus.create({
	    "type":"separator",
	    contexts: ["all"],
		parentId: "CopyPaste"
	});

	chrome.contextMenus.onClicked.addListener(function(info) {
		if(info.menuItemId == "ManageCopyPaste") {
		//	chrome.tabs.create({url:"note/index.html"});	
			chrome.tabs.create({url:"note.html"});	
		}
		
		if(info.menuItemId.indexOf("paste@@")!=-1) {
			
			temp_key = (info.menuItemId).split("@@")[1];
			chrome.storage.sync.get(temp_key, function(data){			
				var textArea = document.createElement("textarea");
				textArea.style.cssText = "position:absolute;left:-100%";
				document.body.appendChild(textArea);
				textArea.value = data[temp_key].split("#_#_#")[2];
				textArea.select();
				document.execCommand("copy");
				document.body.removeChild(textArea);
			});
		}		
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		var id = request.id;
		var title = request.title;
						
		chrome.contextMenus.create({
			id: "paste@@"+id,
			title: title,
			contexts: ["all"],
			parentId: "CopyPaste"
		});
	});
	
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		var id = request.removed_id;
						
		chrome.contextMenus.remove("paste@@" + id);
	});
			
	chrome.storage.sync.get(null, function (data) {
		for (let key in data) {
		//	alert(key);
			chrome.contextMenus.create({
				id: "paste@@"+key,
				title: key.split("#_#_#")[0],
				contexts: ["all"],
				parentId: "CopyPaste"
			});
		}
	});
///////////////////////////////////////////////////////////////////////////////////////////////////////
	
	chrome.tabs.onActivated.addListener(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			if(tabs[0].url.indexOf("https://support.us.oracle.com/oip/faces/secure/srm/srview/")!=-1) {	
				chrome.tabs.executeScript(null, {file: "GetInfoFromParentSR.js"}, function() {
					chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
						envName = request.envName;
						accountName = request.accountName;
						SRNumber = request.SRNumber;
					});
				});
			}
		});
	});

	chrome.tabs.onUpdated.addListener(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			if(tabs[0].url.indexOf("https://support.us.oracle.com/oip/faces/secure/srm/srview/")!=-1) {	
				chrome.tabs.executeScript(null, {file: "GetInfoFromParentSR.js"}, function() {
					chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
						envName = request.envName;
						accountName = request.accountName;
						SRNumber = request.SRNumber;
					});
				});
			}
		});
	});

	
	var t_description;
	chrome.contextMenus.onClicked.addListener(function(info, tab) {
		if(info.menuItemId.indexOf("__")!=-1) {
			var template = new XMLHttpRequest();
			var template_URL = "http://adc00pwx.us.oracle.com/collabsrsa/"+info.menuItemId.split("__")[2];
			template.open('GET',template_URL, true);
			template.send();
			template.onload = function () {
				if (template.readyState === template.DONE) {
			    	if (template.status === 200) {
			      		t_description = template.responseText;
				  		var CollabSR_URL = "https://support.us.oracle.com/oip/faces/secure/srm/sr/SRCreate.jspx?srNumber="+SRNumber+"&queryTabName=My%20Service%20Requests&srcreateOp=SRCollaboration#";
			      		chrome.tabs.create({url:CollabSR_URL}, function(tabs) {
			      			/**/
						});
						
						function checkTime() {
							chrome.tabs.executeScript(null, {file: "SetInfoToCollabSR.js"}, function(){
								chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
									chrome.tabs.sendMessage(tabs[0].id,{summary:info.menuItemId.split("__")[1]+":"+info.menuItemId.split("__")[0], description: t_description, subcomponentDescription:info.menuItemId.split("__")[3], ProductIndex:ProductIndex}, function(response) {});
								});
							});
						}
						checkTime();
						chrome.alarms.onAlarm.addListener(checkTime);
						chrome.alarms.create('checkTime', {delayInMinutes : 0.15});						
			   		}
			   	}
			}
		}
	});

	chrome.contextMenus.onClicked.addListener(function(info, tab) {
		switch(info.menuItemId.split("___")[0]) {
			case "SearchByPod":	
				chrome.tabs.create({url: "https://fleetmanager.oraclecloud.com/customerPod/faces/environmentPod?podName="+envName});
				break;

			case "SearchByCustomer":
				chrome.tabs.create({url: "https://fleetmanager.oraclecloud.com/customerPod/faces/customer?customerName="+accountName});
				break;
		}
	});

	chrome.tabs.onActivated.addListener(function() {
		chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
			if(tabs[0].url == "https://support.us.oracle.com/oip/faces/secure/srm/sr/SRQueue.jspx?mc=true"&&PanelID == -100) {	
				chrome.windows.create({left:400, top: 300, width:400, height:500, type:"normal", url:"SRList.html"}, function(windows) {
					PanelID = windows.id;
				});
				
			}
		});
    });

	chrome.windows.onRemoved.addListener(function(windows) {
		if (windows == PanelID) {
			PanelID = -100;
		}
	});