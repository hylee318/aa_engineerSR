var envName = document.getElementById("envName");
var accountName = document.getElementById("accountName");


var activeSrList = document.getElementById("activeSrList");
var SRNumber = activeSrList.value;
var position1 = SRNumber.indexOf(" ");
if(position1 !=-1) {
	SRNumber = SRNumber.substring(0, position1);
}

chrome.runtime.sendMessage({envName: envName.value.split(".")[0], accountName:accountName.value, SRNumber:SRNumber},
	function(response){}
);