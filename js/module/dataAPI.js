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
    requestMethodText(pathWithQuery) {
        const url = new URL(pathWithQuery, window.location.origin);
        return fetch(url, {})
            .then(res => {
            return res.text();
        })
            .catch(reason => {
            console.error(`request to url ${pathWithQuery} failed. Reason: ${reason}`);
            throw "failed request";
        });
    }
    ;
    groups() {
        return this.getRequest('/api/groups');
    }
    personalData(name) {
        return this.getRequest(`/api/personalData?personName=${encodeURI(name)}`);
    }
    personalStatus(name) {
        return this.getRequest(`/api/personalStatus?personName=${encodeURI(name)}`);
    }
    personalMetadata(name) {
        name = encodeURI(name);
        return this.getRequest(`/api/personalMetadata?personName=${name}`);
    }
    placement(name, referenceData) {
        const url = `/api/podium/personPlacement?personName=${encodeURI(name)}&referenceData=${referenceData}`;
        return this.getRequest(url);
    }
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
    lastActivities(name, amount) {
        return this.getRequest(`/api/lastActivities?personName=${encodeURI(name)}&count=${amount}`);
    }
    svg(fileName) {
        return this.requestMethodText(`/resource/${fileName}`);
    }
}
