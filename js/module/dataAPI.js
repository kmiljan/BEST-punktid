var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export default class DataAPI {
    constructor() {
        this.cache = {};
    }
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
        return __awaiter(this, void 0, void 0, function* () {
            const cached = this.cache[`personalData-${name}`];
            if (cached) {
                return cached;
            }
            const response = yield this.getRequest(`/api/personalData?personName=${encodeURI(name)}`);
            this.cache[`personalData-${name}`] = response;
            return response;
        });
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
    allPodium(podiumSize, referenceData) {
        const url = `/api/podium/all?podiumSize=${podiumSize}&referenceData=${referenceData}`;
        return this.getRequest(url);
    }
    bestInGroups(referenceData) {
        const url = `api/podium/getBestInGroups?referenceData=${referenceData}`;
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
