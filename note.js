window.onload = function() {
	init();
	function init() {
		var table = document.getElementById("title_content");
	 	table.setAttribute("contenteditable", true);
		var title = document.getElementById("title");
		var content = document.getElementById("content");	
		chrome.storage.sync.get(null, function (data) {
			for (let key in data) {				
				var row = table.insertRow(table.rows.length);					
				var cell_title=row.insertCell(0);
				cell_title.innerText=data[key].split("#_#_#")[0];
				cell_title.setAttribute("id", key+"title");
				
				var cell_content=row.insertCell(1);
				cell_content.innerText=data[key].split("#_#_#")[2];
				cell_content.setAttribute("id", key+"content");
				
				var cell_save_remove=row.insertCell(2);
				var save_button= document.createElement("button");
				var span = document.createElement("span");
				
				//add a nbsp
				span.innerText = '\u00a0';
				
				save_button.setAttribute("id", key+"save");
				save_button.setAttribute("class", "btn btn-default");
				
				
				save_button.addEventListener('click', function onclick(event) {
					//0#_#_#title + save
					var id_original = this.id.split("save")[0];
					var id_title_save = id_original+"title";
					var id_content_save = id_original+"content";
					if(id_original.split("#_#_#")[0] == document.getElementById(id_title_save).innerText) {										
						data[id_original] = id_original+"#_#_#"+document.getElementById(id_content_save).innerText;
						chrome.storage.sync.set(data);
					}
					else {					
						var title_key = document.getElementById(id_title_save).innerText+"#_#_#"+id_original.split("#_#_#")[1];
						data[title_key] = title_key+"#_#_#"+document.getElementById(id_content_save).innerText;
						chrome.storage.sync.set(data);
						chrome.runtime.sendMessage({id: title_key, title:title_key.split("#_#_#")[0]},
							function(response){}
						);
						chrome.storage.sync.remove(id_original);
						chrome.runtime.sendMessage({removed_id: id_original},
							function(response){}
						);
					}
				});
				cell_save_remove.appendChild(save_button);
				save_button.innerText="save";
				
				var remove_button= document.createElement("button");
				remove_button.setAttribute("id", key+"_remove");
				remove_button.setAttribute("class", "btn btn-default");
				remove_button.addEventListener('click', function onclick(event) {
					chrome.storage.sync.remove(key);
					chrome.runtime.sendMessage({removed_id: key},
						function(response){}
					);
				});
				cell_save_remove.appendChild(span).appendChild(remove_button);
				remove_button.innerText="remove";
			}
		});
	}
	
	document.getElementById("add").onclick = function () {
		var count = 0;
		var title = document.getElementById("title").value;
		var content = document.getElementById("content").value;	
		chrome.storage.sync.get(null, function (data) {
			var count = 0;
			for (let key in data) {
				count++;
			}

			var newKey = title+"#_#_#"+count;
			data[newKey] = newKey+"#_#_#"+content;
			chrome.storage.sync.set(data);
			chrome.runtime.sendMessage({id: newKey, title:newKey.split("#_#_#")[0]},
				function(response){}
			);
			alert(title + " is added");
			
			var table = document.getElementById("title_content");
			for (var i = table.rows.length-1; i>0; i--) {
				table.deleteRow(i);
			}
			for (let key in data) {				
				var row = table.insertRow(table.rows.length);					
				var cell_title=row.insertCell(0);
				cell_title.innerText=data[key].split("#_#_#")[0];
				cell_title.setAttribute("id", key+"title");
				
				var cell_content=row.insertCell(1);
				cell_content.innerText=data[key].split("#_#_#")[2];
				cell_content.setAttribute("id", key+"content");
				
				var cell_save_remove=row.insertCell(2);
				var save_button= document.createElement("button");
				var span = document.createElement("span");
				
				//add a nbsp
				span.innerText = '\u00a0';
				
				save_button.setAttribute("id", key+"save");
				save_button.setAttribute("class", "btn btn-default");
				
				
				save_button.addEventListener('click', function onclick(event) {
					//0#_#_#title + save
					var id_original = this.id.split("save")[0];
					var id_title_save = id_original+"title";
					var id_content_save = id_original+"content";
					if(id_original.split("#_#_#")[0] == document.getElementById(id_title_save).innerText) {										
						data[id_original] = id_original+"#_#_#"+document.getElementById(id_content_save).innerText;
						chrome.storage.sync.set(data);
					}
					else {					
						var title_key = document.getElementById(id_title_save).innerText+"#_#_#"+id_original.split("#_#_#")[1];
						data[title_key] = title_key+"#_#_#"+document.getElementById(id_content_save).innerText;
						chrome.storage.sync.set(data);
						chrome.runtime.sendMessage({id: title_key, title:title_key.split("#_#_#")[0]},
							function(response){}
						);
						chrome.storage.sync.remove(id_original);
						chrome.runtime.sendMessage({removed_id: id_original},
							function(response){}
						);
					}
				});
				cell_save_remove.appendChild(save_button);
				save_button.innerText="save";
				
				var remove_button= document.createElement("button");
				remove_button.setAttribute("id", key+"_remove");
				remove_button.setAttribute("class", "btn btn-default");
				remove_button.addEventListener('click', function onclick(event) {
					chrome.storage.sync.remove(key);
					chrome.runtime.sendMessage({removed_id: key},
						function(response){}
					);
				});
				cell_save_remove.appendChild(span).appendChild(remove_button);
				remove_button.innerText="remove";
			}
		});		
	}
	
	document.getElementById("import").onclick = function () {
		var exportdata = document.getElementById("exportdata");
		var exportdata_Object = JSON.parse(exportdata.value);
	
		chrome.storage.sync.get(null, function (data) {
			var FinalData = Object.assign(data, exportdata_Object);
			chrome.storage.sync.set(FinalData);
			chrome.storage.sync.get(null, function (data) {
				for (let key in data) {	
					chrome.runtime.sendMessage({id: key, title:key.split("#_#_#")[0]},
						function(response){}
					);
				}
			});
			alert("menu imported..");
		});		
	}
	
	document.getElementById("export").onclick = function () {	
		var exportdata = document.getElementById("exportdata");
		chrome.storage.sync.get(null, function (data) {
			exportdata.value = JSON.stringify(data);
		});	
	}
	
	document.getElementById("clear_add").onclick = function () {	
		var title = document.getElementById("title");
		var content = document.getElementById("content");
		title.value = "";
		content.value = "";
	}
	
	document.getElementById("clear_exportdata").onclick = function () {	
		var exportdata = document.getElementById("exportdata");
		exportdata.value = "";
	}
}