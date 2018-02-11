function trim(str)
{
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

/***get username start***/
var username;
var prefix_URL = "https://support.us.oracle.com/oip/faces/secure/srm/srview/SRTechnical.jspx?srNumber=";
var xhr_username = new XMLHttpRequest();
xhr_username.open('GET', "https://support.us.oracle.com/oip/faces/secure/srm/sr/SRQueue.jspx?mc=true", true);
xhr_username.send();
xhr_username.onload = function () {
  if (xhr_username.readyState === xhr_username.DONE) {
    if (xhr_username.status === 200) {
      var t = xhr_username.responseText;
      var temp;
      var position1 = t.indexOf("@");
      temp = t.substring(0, position1);
      var position2 = temp.lastIndexOf("(");
      username = t.substring(position2+1, position1);
    }
  }
}
/***get username end***/

/***get engineer' name start***/
var engineerName = document.getElementById("engineerName");
var search = document.getElementById("search");
//engineerName.focus();
/***get engineer' name end***/

/***click enter, get engineer's SR start***/
search.addEventListener('click', function (event) {

    var engineerName_value = trim(engineerName.value.replace(/(\r\n|\n|\r|@oracle.com)/gmi,"")).toUpperCase();
    var URL = "https://support.us.oracle.com/oip/faces/ListRequest?query=%5Bstatus%5D%20%3D%20%27Open%27%20AND%20%5Bowner%5D%20%3D%20%27"+engineerName_value+"%40ORACLE.COM%27&type=SR&sort=%2BadjustedPriorityScore&listBCId=282-577&subject="+username+"%40oracle.com&mode=All&recCountType=NONE&&start=0&count=99";
    //get SR#
    var xhr = new XMLHttpRequest();
    xhr.open('GET', URL, true);
   // xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          var json = xhr.responseText;
          var result = JSON.parse(json);  
          
          //ODM Missed
          var ODM = document.getElementById("ODM");
          ODM.innerText = "OOPS! ODM missed! Click the link to Open SR";
          var SRODMMissed = new Array();
          //outage missed
          var outage = document.getElementById("outage");
          outage.innerText = "OOPS! Outage missed! Click the link to Open SR";
          var SROutageMissed = new Array();
          //NRD missed
          var NRD = document.getElementById("NRD");
          NRD.innerText = "OOPS! NRD missed! Click the link to Open SR";
          var SRNRDMissed = new Array();
          //env missed
          var Environment = document.getElementById("Environment");
          Environment.innerText = "OOPS! Environment missed! Click the link to Open SR";
          var SREnvMissed = new Array();

          //sev1
          var SRSev1_24x7 = document.getElementById("SRSev1_24x7");
          SRSev1_24x7.innerText = "Sev1/24x7 SRs! Click the link to Open SR";
          var Sev1_24x7 = new Array();

          for (var i = 0; i< result.items.length; i++) {
            //ODM Missed
            if((result.items[i].consultativeODMTags =="0"||result.items[i].consultativeODMTags =="")&&(result.items[i].problemSolutionODMTags =="0"||result.items[i].problemSolutionODMTags =="")) {
              SRODMMissed[i] = result.items[i].SRNumber;
              var p = document.createElement("p");
              var a = document.createElement("a");
              a.innerText=SRODMMissed[i];
              a.setAttribute("id", a.innerText);
              a.setAttribute("name", "ODMMissed");
              a.setAttribute("href", "#");
              
              a.addEventListener('click', function onclick(event) {
                chrome.tabs.create({url: prefix_URL + this.id});
              });
              ODM.appendChild(p).appendChild(a);
            }
            else {
              SRODMMissed[i] = "ODMNotMissed";
            }

            //outage Missed
            if((result.items[i].severity =="1-Critical"&&result.items[i].outageStatus==""&&result.items[i].requestFullSupportFlg=="true")) {
              SROutageMissed[i] = result.items[i].SRNumber;
              var p = document.createElement("p");
              var a = document.createElement("a");
              a.innerText=SROutageMissed[i];
              a.setAttribute("id", a.innerText);
              a.setAttribute("name", "OutageMissed");
              a.setAttribute("href", "#");
              
              a.addEventListener('click', function onclick(event) {
                chrome.tabs.create({url: prefix_URL + this.id});
              });
              outage.appendChild(p).appendChild(a);
            }
            else {
              SROutageMissed[i] = "OutageNotMissed";
            }

            //NRD Missed
            var NRD_date = new Date(result.items[i].nextResponseDue.replace(/-/g, ' ').replace(/GMT /g, 'GMT-'));
            var now = new Date(); 
            if(NRD_date < now) {
              SRNRDMissed[i] = result.items[i].SRNumber;
              var p = document.createElement("p");
              var a = document.createElement("a");
              a.innerText=SRNRDMissed[i];
              a.setAttribute("id", a.innerText);
              a.setAttribute("name", "NRDMissed");
              a.setAttribute("href", "#");
              a.addEventListener('click', function onclick(event) {
                chrome.tabs.create({url: prefix_URL + this.id});
              });
              NRD.appendChild(p).appendChild(a);
            }
            else {
              SRNRDMissed[i] = "NRDNotOverdued";
            }
          
            //Env missed
            if((result.items[i].envName=="")&&(result.items[i].serviceName=="")&&(result.items[i].levelofService=="CLOUDpriority"||result.items[i].levelofService=="CLOUDsub")) {
              SREnvMissed[i] = result.items[i].SRNumber;
              var p = document.createElement("p");
              var a = document.createElement("a");
              a.innerText=SREnvMissed[i];
              a.setAttribute("id", a.innerText);
              a.setAttribute("name", "EnvMissed");
              a.setAttribute("href", "#");
              
              a.addEventListener('click', function onclick(event) {
                chrome.tabs.create({url: prefix_URL + this.id});
              });
              
              Environment.appendChild(p).appendChild(a); 
            }
            else {
              SREnvMissed[i] = "EnvNotMissed";
            }

            //sev1_24x7
            if(result.items[i].severity =="1-Critical"&&result.items[i]['sub-Status']!="Close Requested"&&result.items[i].requestFullSupportFlg=="true") {
              Sev1_24x7[i] = result.items[i].SRNumber;
              var p = document.createElement("p");
              var a = document.createElement("a");
              a.innerText=result.items[i].SRNumber+"("+result.items[i]['sub-Status']+")";
              a.setAttribute("id", result.items[i].SRNumber);
              a.setAttribute("name", "Sev1_24x7");
              a.setAttribute("href", "#");
              
              a.addEventListener('click', function onclick(event) {
                chrome.tabs.create({url: prefix_URL + this.id});
              });
              
              SRSev1_24x7.appendChild(p).appendChild(a); 
            }
            else {
              Sev1_24x7[i] = "NotSev1_24x7";
            }
          }

          var link_ODM = document.getElementsByName("ODMMissed");
          if(link_ODM.length == 0) {
            ODM.innerText = "Great! No ODM Missed!";
          }

          var link_Outage = document.getElementsByName("OutageMissed");
          if(link_Outage.length == 0) {
            outage.innerText = "Great! No Outage Missed!";
          }

          var link_NRD = document.getElementsByName("NRDMissed");
          if(link_NRD.length == 0) {
            NRD.innerText = "Great! No NRD Missed!";
          }

          var link_Env = document.getElementsByName("EnvMissed");
          if(link_Env.length == 0) {
            Environment.innerText = "Great! No Env Missed!";
          }

          var link_Sev1 = document.getElementsByName("Sev1_24x7");
          if(link_Sev1.length == 0) {
            SRSev1_24x7.innerText = "Great! No Sev1_24x7 SR!";
          }
        }
      }
    };

    //Sev1MoreThan3 
    //SEV1 SRs in Customer Working for more than 3 days
    var SRList_Sev1MoreThan3 = document.getElementById("SRList_Sev1MoreThan3");
    SRList_Sev1MoreThan3.innerText = "SEV1 SRs in Customer Working for more than 3 days";
    var Sev1MoreThan3 = new Array();
    var URL_Sev1MoreThan3 = "https://support.us.oracle.com/oip/faces/ListRequest?query=%5Bowner%5D%3D%27"+engineerName_value+"%40ORACLE.COM%27%20and%20%5Bseverity%5D%3D%271-Critical%27%20and%20%5Bsub-Status%5D%3D%27Customer%20Working%27%20and%20%5Bupdated%5D%20%3C%25%25SERVER_TIME(-72)%25%25&type=SR&sort=%2BadjustedPriorityScore&listBCId=282-577&subject="+username+"%40oracle.com&mode=All&recCountType=NONE&&start=0&count=99";
    //get SR#
    var xhr_Sev1MoreThan3 = new XMLHttpRequest();
    xhr_Sev1MoreThan3.open('GET', URL_Sev1MoreThan3, true);
    // xhr_Sev1MoreThan3.responseType = 'json';
    xhr_Sev1MoreThan3.send();
    xhr_Sev1MoreThan3.onload = function () {
      if (xhr_Sev1MoreThan3.readyState === xhr_Sev1MoreThan3.DONE) {
        if (xhr_Sev1MoreThan3.status === 200) {
          var json = xhr_Sev1MoreThan3.responseText;
          var result = JSON.parse(json);
          //SEV1 SRs in Customer Working for more than 3 days
          for (var i = 0; i< result.items.length; i++) {        
            Sev1MoreThan3[i] = result.items[i].SRNumber;
            var p = document.createElement("p");
            var a = document.createElement("a");
            a.innerText=Sev1MoreThan3[i];
            a.setAttribute("id", a.innerText);
            a.setAttribute("name", "Sev1MoreThan3");
            a.setAttribute("href", "#");
            
            a.addEventListener('click', function onclick(event) {
              chrome.tabs.create({url: prefix_URL + this.id});
            });
              
            SRList_Sev1MoreThan3.appendChild(p).appendChild(a); 
          }
          var link_Sev1MoreThan3 = document.getElementsByName("Sev1MoreThan3");
          if(link_Sev1MoreThan3.length == 0) {
            SRList_Sev1MoreThan3.innerText = "Great! No SEV1 SRs in Customer Working for more than 3 days";
          }
        }
      }
    }

    //Sev1AtLeast10
    //SEV1 SRs that have spent at least 10 days in Support status
    var SRList_Sev1AtLeast10 = document.getElementById("SRList_Sev1AtLeast10");
    SRList_Sev1AtLeast10.innerText = "SEV1 SRs that have spent at least 10 days in Support status";
    var Sev1AtLeast10 = new Array();


    var URL_Sev1AtLeast10 = "https://support.us.oracle.com/oip/faces/ListRequest?query=%5Bowner%5D%3D%27"+engineerName_value+"%40ORACLE.COM%27%20and%20%5Bstatus%5D%3D%27Open%27%20and%20%5Bseverity%5D%3D%271-Critical%27%20and%20%5Bcreated%5D%20%3C%25%25SERVER_TIME(-240)%25%25&type=SR&sort=%2BadjustedPriorityScore&listBCId=282-577&subject="+username+"%40oracle.com&mode=All&recCountType=NONE&&start=0&count=99";
    //get SR#
    var xhr_Sev1AtLeast10 = new XMLHttpRequest();
    xhr_Sev1AtLeast10.open('GET', URL_Sev1AtLeast10, true);
   // xhr_Sev1AtLeast10.responseType = 'json';
    xhr_Sev1AtLeast10.send();
    xhr_Sev1AtLeast10.onload = function () {
      if (xhr_Sev1AtLeast10.readyState === xhr_Sev1AtLeast10.DONE) {
        if (xhr_Sev1AtLeast10.status === 200) {
          var json = xhr_Sev1AtLeast10.responseText;
          var result = JSON.parse(json);  
          for (var i = 0; i< result.items.length; i++) {        
            Sev1AtLeast10[i] = result.items[i].SRNumber;
            var p = document.createElement("p");
            var a = document.createElement("a");
            a.innerText=Sev1AtLeast10[i];
            a.setAttribute("id", a.innerText);
            a.setAttribute("name", "Sev1AtLeast10");
            a.setAttribute("href", "#");            
            a.addEventListener('click', function onclick(event) {
              chrome.tabs.create({url: prefix_URL + this.id});
            });
              
            SRList_Sev1AtLeast10.appendChild(p).appendChild(a); 
          }
          var link_Sev1AtLeast10 = document.getElementsByName("Sev1AtLeast10");
          if(link_Sev1AtLeast10.length == 0) {
            SRList_Sev1AtLeast10.innerText = "Great! NO SEV1 SRs that have spent at least 10 days in Support status";
          }
        }
      }
    }

    //NoUpdatedOver20
    //SRs that have not been updated in over 20 days
    var SRList_NoUpdatedOver20 = document.getElementById("SRList_NoUpdatedOver20");
    SRList_NoUpdatedOver20.innerText = "SRs that have not been updated in over 20 days";
    var NoUpdatedOver20 = new Array();

    var URL_NoUpdatedOver20 = "https://support.us.oracle.com/oip/faces/ListRequest?query=%5Bowner%5D%3D%27"+engineerName_value+"%40ORACLE.COM%27%20%20and%20%5Bstatus%5D%3D%27Open%27%20and%20%5Bsub-Status%5D%3C%3E%27Solution%20Offered%27%20%20and%20%5Bupdated%5D%20%3C%25%25SERVER_TIME(-480)%25%25&type=SR&sort=%2BadjustedPriorityScore&listBCId=282-577&subject="+username+"%40oracle.com&mode=All&recCountType=NONE&&start=0&count=99";
    //get SR#
    var xhr_NoUpdatedOver20 = new XMLHttpRequest();
    xhr_NoUpdatedOver20.open('GET', URL_NoUpdatedOver20, true);
   // xhr_NoUpdateOver20.responseType = 'json';
    xhr_NoUpdatedOver20.send();
    xhr_NoUpdatedOver20.onload = function () {
      if (xhr_NoUpdatedOver20.readyState === xhr_NoUpdatedOver20.DONE) {
        if (xhr_NoUpdatedOver20.status === 200) {
          var json = xhr_NoUpdatedOver20.responseText;
          var result = JSON.parse(json); 
          for (var i = 0; i< result.items.length; i++) {        
            NoUpdatedOver20[i] = result.items[i].SRNumber;
            var p = document.createElement("p");
            var a = document.createElement("a");
            a.innerText=NoUpdatedOver20[i];
            a.setAttribute("id", a.innerText);
            a.setAttribute("name", "NoUpdatedOver20");
            a.setAttribute("href", "#");
            
            a.addEventListener('click', function onclick(event) {
              chrome.tabs.create({url: prefix_URL + this.id});
            });
              
            SRList_NoUpdatedOver20.appendChild(p).appendChild(a); 
          } 
          var link_NoUpdateOver20 = document.getElementsByName("NoUpdatedOver20");
          if(link_NoUpdateOver20.length == 0) {
            SRList_NoUpdatedOver20.innerText = "Great! No SRs that have not been updated in over 20 days";
          }
        }
      }
    }

    //AgedThan30
    //SR aged > 30 days in Non Solution offered /closed status 
    var SRList_AgedThan30 = document.getElementById("SRList_AgedThan30");
    SRList_AgedThan30.innerText = "SR aged > 30 days in Non Solution offered /closed status";
    var AgedThan30 = new Array();
    var URL_AgedThan30 = "https://support.us.oracle.com/oip/faces/ListRequest?query=%5Bowner%5D%3D%27"+engineerName_value+"%40ORACLE.COM%27%20and%20%5Bstatus%5D%3D%27Open%27%20and%20%5Bsub-Status%5D%3C%3E%27Solution%20Offered%27%20%20and%20%5Bcreated%5D%20%3C%25%25SERVER_TIME(-720)%25%25&type=SR&sort=%2BadjustedPriorityScore&listBCId=282-577&subject="+username+"%40oracle.com&mode=All&recCountType=NONE&&start=0&count=99";
    //get SR#
    var xhr_AgedThan30 = new XMLHttpRequest();
    xhr_AgedThan30.open('GET', URL_AgedThan30, true);
   // xhr_AgedThan30.responseType = 'json';
    xhr_AgedThan30.send();
    xhr_AgedThan30.onload = function () {
      if (xhr_AgedThan30.readyState === xhr_AgedThan30.DONE) {
        if (xhr_AgedThan30.status === 200) {
          var json = xhr_AgedThan30.responseText;
          var result = JSON.parse(json);
          for (var i = 0; i< result.items.length; i++) {        
            AgedThan30[i] = result.items[i].SRNumber;
            var p = document.createElement("p");
            var a = document.createElement("a");
            a.innerText=AgedThan30[i];
            a.setAttribute("id", a.innerText);
            a.setAttribute("name", "AgedThan30");
            a.setAttribute("href", "#");
            
            a.addEventListener('click', function onclick(event) {
              chrome.tabs.create({url: prefix_URL + this.id});
            });
              
            SRList_AgedThan30.appendChild(p).appendChild(a); 
          }   
          
          var link_AgedThan30 = document.getElementsByName("AgedThan30");
          if(link_AgedThan30.length == 0) {
            SRList_AgedThan30.innerText = "Great! No SR aged > 30 days in Non Solution offered /closed status ";
          }
        }
      }
    }

}, false);
/***click enter, get engineer's SR end***/