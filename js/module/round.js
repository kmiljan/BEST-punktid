const ROUND_DIGITS = 2;
export { round, truncate };
const round = (val) => {
    return +(Math.round(val + "e+" + ROUND_DIGITS) + "e-" + ROUND_DIGITS);
};
const truncate = (val) => {
    return +(Math.floor(val));
};
