import notify from '../module/debug.js';
export default class DataAPI {
    constructor() { }
    ;
    requestMethod(URL) {
        return fetch(URL, {}).then(res => {
            if (res.ok) {
                return res.text();
            }
        }).then(str => {
            return new Promise((resolve, reject) => {
                let data;
                try {
                    data = JSON.parse(str);
                    resolve(data);
                }
                catch (e) {
                    debugger;
                    notify("Request to URL: " + URL + " came back with \n" + str, "request");
                    reject(e);
                }
            });
        });
    }
    ;
    requestMethodText(URL) {
        return fetch(URL, {}).then(res => {
            if (res.ok) {
                return res.text();
            }
        });
    }
    ;
    groups() {
        return this.requestMethod(`/get_data.php?type=groups`);
    }
    ;
    names() {
        return this.requestMethod(`/cache/namelist.json`).then(arr => {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = decodeURIComponent(arr[i]);
            }
            return arr;
        });
    }
    ;
    personalData(name) {
        name = encodeURI(name);
        return this.requestMethod(`/get_data.php?type=personaldata&person_name=${name}`);
    }
    ;
    personalStatus(name) {
        name = encodeURI(name);
        return this.requestMethod(`/get_data.php?type=personalstatus&person_name=${name}`);
    }
    ;
    personalMetadata(name) {
        name = encodeURI(name);
        return this.requestMethod(`/get_data.php?type=personalmetadata&person_name=${name}`);
    }
    ;
    groupMetaData() {
        return this.requestMethod(`/get_data.php?type=groupmetadata`);
    }
    ;
    placement(group, name, exemptBasedOnStatus, referenceData) {
        name = encodeURI(name);
        referenceData = encodeURI(referenceData);
        group = encodeURI(group);
        const exemptBasedOnStatusString = encodeURI(String(exemptBasedOnStatus));
        return this.requestMethod(`/get_data.php?type=podium&person_name=${name}&exemptBasedOnStatus=${exemptBasedOnStatusString}&referencedata=${referenceData}&group=${group}`);
    }
    ;
    podium(group, referenceData, podiumSize, exemptBasedOnStatus) {
        group = encodeURI(group);
        referenceData = encodeURI(referenceData);
        const podiumSizeString = encodeURI(String(podiumSize));
        const exemptBasedOnStatusString = encodeURI(String(exemptBasedOnStatus));
        return this.requestMethod(`/get_data.php?type=podium&group=${group}&referencedata=${referenceData}&podiumsize=${podiumSizeString}&exemptBasedOnStatus=${exemptBasedOnStatusString}`);
    }
    ;
    activityReport(name, group) {
        group = encodeURI(group);
        if (name) {
            name = encodeURI(name);
            return this.requestMethod(`/get_data.php?type=activityreport&person_name=${name}&group=${group}`);
        }
        return this.requestMethod(`/get_data.php?type=activityreport&group=${group}`);
    }
    ;
    exempt(name) {
        name = encodeURI(name);
        return this.requestMethod(`/get_data.php?type=exempt&person_name=${name}`);
    }
    ;
    lastActivities(name, group, amount) {
        group = encodeURI(group);
        const amountString = encodeURI(String(amount));
        if (name) {
            name = encodeURI(name);
            return this.requestMethod(`/get_data.php?type=lastactivities&person_name=${name}&group=${group}&amount=${amountString}`);
        }
        else {
            return this.requestMethod(`/get_data.php?type=lastactivities&group=${group}&amount=${amountString}`);
        }
    }
    ;
    svg(URL) {
        return this.requestMethodText(`/resource/${URL}`);
    }
}
