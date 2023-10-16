import {
    ActivityItem,
    ActivityReportItem,
    BestInGroupItem,
    Group,
    PersonalDataResponse,
    PersonalMetaData,
    PodiumItem,
    PodiumItemOptimized,
    ReferenceData
} from "../types";

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

    requestMethodText(pathWithQuery: string): Promise<string> {
        const url = new URL(pathWithQuery, window.location.origin);
        return fetch(url, {})
            .then(res => {
                    return res.text();
                }
            )
            .catch(reason => {
                console.error(`request to url ${pathWithQuery} failed. Reason: ${reason}`)
                throw "failed request";
            });
    };

    groups():Promise<Group[]> {
        return this.getRequest<Group[]>('/api/groups')
    }

    personalData(name: string): Promise<PersonalDataResponse> {
        return this.getRequest<PersonalDataResponse>(`/api/personalData?personName=${encodeURI(name)}`);
    }

    personalStatus(name: string): Promise<string> {
        return this.getRequest<string>(`/api/personalStatus?personName=${encodeURI(name)}`);
    }

    personalMetadata(name: string):Promise<PersonalMetaData> {
        name=encodeURI(name);

        return this.getRequest<PersonalMetaData>(`/api/personalMetadata?personName=${name}`);
    }

    placement(name: string, referenceData: ReferenceData): Promise<PodiumItem> {
        const url = `/api/podium/personPlacement?personName=${encodeURI(name)}&referenceData=${referenceData}`
        return this.getRequest<PodiumItem>(url);
    }

    allPodium(podiumSize: number, referenceData: ReferenceData): Promise<PodiumItemOptimized[]> {
        const url = `/api/podium/all?podiumSize=${podiumSize}&referenceData=${referenceData}`;
        return this.getRequest<PodiumItemOptimized[]>(url);
    }

    bestInGroups(referenceData: string): Promise<BestInGroupItem[]> {
        const url = `api/podium/getBestInGroups?referenceData=${referenceData}`;
        return this.getRequest<BestInGroupItem[]>(url);
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

    svg(fileName: string): Promise<string> {
        return this.requestMethodText(`/resource/${fileName}`);
    }
}