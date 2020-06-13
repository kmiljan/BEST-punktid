function requestData(dataType, parameters) {
    //If data already exists, use that instead
    switch(dataType) {
        case 'personalData':
            URL_params='get_data.php?type=personaldata&person_name='+encodeURI(parameters.name);
            break;
        case 'personalMetadata':
            URL_params='get_data.php?type=personalmetadata&person_name='+encodeURI(parameters.name);
            break;
        case 'groupMetaData':
            URL_params='get_data.php?type=groupmetadata';
            break;
        case 'placement':
            if(parameters.exemptBasedOnStatus==undefined) {
                parameters.exemptBasedOnStatus=false;
            }
            URL_params='get_data.php?type=podium&person_name='+encodeURI(parameters.name)+'&group='+encodeURI(parameters.group)+'&referencedata='+encodeURI(parameters.referencedata)+'&podiumsize='+encodeURI(parameters.podiumsize)+'&exemptBasedOnStatus='+encodeURI(parameters.exemptBasedOnStatus);
            break;
        case 'podium':
            if(parameters.exemptBasedOnStatus==undefined) {
                parameters.exemptBasedOnStatus=false;
            }
            URL_params='get_data.php?type=podium&group='+encodeURI(parameters.group)+'&referencedata='+encodeURI(parameters.referencedata)+'&podiumsize='+encodeURI(parameters.podiumsize)+'&exemptBasedOnStatus='+encodeURI(parameters.exemptBasedOnStatus);
            break;
        case 'activityreport':
            if(parameters.name) {
                URL_params='get_data.php?type=activityreport&person_name='+encodeURI(parameters.name)+'&group='+encodeURI(parameters.group);
            }
            else {
                URL_params='get_data.php?type=activityreport&group='+encodeURI(parameters.group);
            }
            break;
        case 'exempt':
            URL_params='get_data.php?type=exempt&person_name='+encodeURI(parameters.name);
            break;
        case 'lastactivities':
            URL_params='get_data.php?type=lastactivities&person_name='+encodeURI(parameters.name)+'&group='+encodeURI(parameters.group)+'&amount='+encodeURI(parameters.amount);
            break;
        default:
            return new Promise((resolve, reject) => {
                notify('Incorrectly specified datatype: '+dataType, 'request');
                reject("INCORRECT_DATATYPE");
            });
            break;
    }
    return new Promise((resolve, reject) => {
      $.getJSON(URL_params, function(response){
          //console.log(response);
      })
      .done( function(response){
        notify("SUCCESS: JSON request for "+URL_params, "request");
        resolve(response);
      })
      .fail( function(jqxhr, textStatus, response){
        debugger;
        notify("FAILURE: JSON request for "+URL_params, "request");
        console.log(jqxhr);
        reject(response);
      });
    }); 
}