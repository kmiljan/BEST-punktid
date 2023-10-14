interface Group {
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

interface PodiumItem {
    name: string,
    score: number,
    place: number
}