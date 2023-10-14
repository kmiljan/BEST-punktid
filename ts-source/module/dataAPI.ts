import notify from '../module/debug.js';
import {ActivityItem, ActivityReportItem, Group, PersonalMetaData, PodiumItem, ReferenceData} from "../types";
export default class DataAPI {
    constructor(){};

    getRequest<TResponse>(pathWithQuery: string): Promise<TResponse> {
        const url = new URL(pathWithQuery, window.location.origin);
        return fetch(url, {})
            .then(res => {
                return res.json();
            })
            .catch(reason => {
                console.error(`request to url ${pathWithQuery} failed. Reason: ${reason}`)
                throw "failed request";
            });
    }


    requestMethod(URL: string):Promise<object> {
        return fetch(URL, {}).then(
            res=>{
                if(res.ok){
                    return res.text();
                }
            }
        ).then(str=>{
            return new Promise(
                (resolve, reject)=>{
                    let data;
                    try{
                        data=JSON.parse(str);
                        resolve(data);
                    }
                    catch(e){
                        notify("Request to URL: "+URL+" came back with \n"+str, "request");
                        reject(e);
                    }
                }
            )
        });
    };
    requestMethodText(URL: string):Promise<string> {
        return fetch(URL, {}).then(
            res=>{
                if(res.ok){
                    return res.text();
                }
            }
        );
    };

    groups():Promise<Group[]> {
        return this.getRequest<Group[]>('/api/groups')
    }

    personalData(name: string):Promise<object> {
        name=encodeURI(name);
        return this.requestMethod(`/get_data.php?type=personaldata&person_name=${name}`);
    };
    personalStatus(name: string):Promise<string> {
        return this.getRequest<string>(`/api/personalStatus?personName=${encodeURI(name)}`);
    };
    personalMetadata(name: string):Promise<PersonalMetaData> {
        name=encodeURI(name);

        return this.getRequest<PersonalMetaData>(`/api/personalMetadata?personName=${name}`);
    };
    groupMetaData():Promise<object> {
        return this.requestMethod(`/get_data.php?type=groupmetadata`);
    };

    placementBetter(name: string, referenceData: ReferenceData): Promise<PodiumItem> {
        const url = `/api/podium/personPlacement?personName=${encodeURI(name)}&referenceData=${referenceData}`
        return this.getRequest<PodiumItem>(url);
    }

    placement(group: string, name: string, exemptBasedOnStatus: boolean,  referenceData: string):Promise<object> {
        name=encodeURI(name);
        referenceData=encodeURI(referenceData);
        group=encodeURI(group);
        const exemptBasedOnStatusString=encodeURI(String(exemptBasedOnStatus));
        return this.requestMethod(`/get_data.php?type=podium&person_name=${name}&exemptBasedOnStatus=${exemptBasedOnStatusString}&referencedata=${referenceData}&group=${group}`);
    };
    podium(group: string, referenceData: string, podiumSize: number, exemptBasedOnStatus: boolean ):Promise<object> {
        group=encodeURI(group);
        referenceData=encodeURI(referenceData);
        const podiumSizeString=encodeURI(String(podiumSize));
        const exemptBasedOnStatusString=encodeURI(String(exemptBasedOnStatus));


        return this.requestMethod(`/get_data.php?type=podium&group=${group}&referencedata=${referenceData}&podiumsize=${podiumSizeString}&exemptBasedOnStatus=${exemptBasedOnStatusString}`);
    }

    allPodium(podiumSize: number, from: Date|null): Promise<PodiumItem[]> {
        let url = `api/podium/all?podiumsize=${podiumSize}`;
        if (from !== null) {
            url += `&from=${from.toISOString()}`
        }

        return this.getRequest<PodiumItem[]>(url);
    }

    groupPodium(group: string, podiumSize: number, from: Date|null): Promise<PodiumItem[]> {
        let url = `api/podium/group/allTime?group=${encodeURI(group)}&podiumsize=${podiumSize}`;
        if (from !== null) {
            url += `&from=${from.toISOString()}`
        }
        return this.getRequest<PodiumItem[]>(url);
    }

    activityReport(name: string|null):Promise<ActivityReportItem[]> {
        let url = `/api/activityReport`;

        if (name) {
            url += `?personName=${encodeURI(name)}`
        }

        return this.getRequest<ActivityReportItem[]>(url);
    }

    lastActivities(name: string, amount: number): Promise<ActivityItem[]> {
        return this.getRequest<ActivityItem[]>(`/api/lastActivities?personName=${encodeURI(name)}&count=${amount}`)
    }

    svg(URL){
        return this.requestMethodText(`/resource/${URL}`);
    }
}