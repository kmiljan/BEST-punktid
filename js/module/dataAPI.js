import notify from '../module/debug.js';
export default class DataAPI {
    constructor() { }
    ;
    getRequest(pathWithQuery) {
        const url = new URL(pathWithQuery, window.location.origin);
        return fetch(url, {})
            .then(res => {
            return res.json();
        })
            .catch(reason => {
            console.error(`request to url ${pathWithQuery} failed. Reason: ${reason}`);
            throw "failed request";
        });
    }
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
        return this.getRequest('/api/groups');
    }
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
        return this.getRequest(`/api/personalMetadata?personName=${name}`);
    }
    ;
    groupMetaData() {
        return this.requestMethod(`/get_data.php?type=groupmetadata`);
    }
    ;
    placementBetter(name, referenceData) {
        const url = `/api/podium/personPlacement?personName=${encodeURI(name)}&referenceData=${referenceData}`;
        return this.getRequest(url);
    }
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
    allPodium(podiumSize, from) {
        let url = `api/podium/all?podiumsize=${podiumSize}`;
        if (from !== null) {
            url += `&from=${from.toISOString()}`;
        }
        return this.getRequest(url);
    }
    groupPodium(group, podiumSize, from) {
        let url = `api/podium/group/allTime?group=${encodeURI(group)}&podiumsize=${podiumSize}`;
        if (from !== null) {
            url += `&from=${from.toISOString()}`;
        }
        return this.getRequest(url);
    }
    activityReport(name) {
        let url = `/api/activityReport`;
        if (name) {
            url += `?personName=${encodeURI(name)}`;
        }
        return this.getRequest(url);
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
