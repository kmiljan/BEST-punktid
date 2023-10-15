export interface Group {
    identifier:string,
    properties:{
        name:string,
        colors:Array<string>
    }
}
/*const groups=[
    {identifier:'TTG', properties: {name: 'TTG', colors: ["blue", "lightblue"]}},
    {identifier:'MTG', properties: {name: 'MTG', colors: ["blue", "lightblue"]}},
    {identifier:'PRTG', properties: {name: 'DMTG', colors: ["#e0bc00", "#fdde10"]}},
    {identifier:'FRTG', properties: {name: 'FRTG', colors: ["75ae40", "#c3d8a1"]}},
    {identifier:'RV', properties: {name: 'RV', colors: ["blue", "lightblue"]}},
    {identifier:'HR_local', properties: {name: 'LBG Tallinn', colors: ["blue", "lightblue"]}},
    {identifier:'HR_teamwork', properties: {name: 'Tiimitöö', colors: ["blue", "lightblue"]}},
    {identifier:'HR_projects', properties: {name: 'Projektid', colors: ["blue", "lightblue"]}},
];*/

export interface PodiumItem {
    name: string,
    score: number,
    place: number
}

export interface BestInGroupItem {
    name: string,
    score: number
    groupName: string,
    groupIdentifier: string
}

export interface PersonalMetaData {
    [name: string]: PersonalMetaDataItem
}
export interface PersonalMetaDataItem {
    totalScore: number,
    totalScoreThisMonth: number
}
export interface ActivityReportItem {
    y: number,
    m: number,
    activities: number,
    score: number
}

export enum ReferenceData {
    totalScore = "totalScore",
    totalScoreThisSeason = "totalScoreThisSeason",
    totalScoreThisMonth = "totalScoreThisMonth"
}

export interface ActivityItem {
    name: string,
    count: number,
    score: number,
    timestamp: string
}

export interface PersonalDataResponse {
    [groupName: string]: {
        totalScore: number,
        breakdown: PersonalDataActivityItem[]
    }
}

interface PersonalDataActivityItem {
    name: string,
    count: number,
    score: number
}

// See on siin selleks, et tsc koodi kokku panemisel tekitaks samanimelise javascript faili
var _ = "mingi vaartus";