const ROUND_DIGITS=2;
export {round, truncate};

const round=(val:number)=>{
    return +(Math.round(val + "e+" + ROUND_DIGITS)  + "e-" + ROUND_DIGITS);
}
const truncate=(val:number)=>{
    return +(Math.floor(val));
}