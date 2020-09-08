//Enum that determines whether the tableau is solved using the primal-, dualsimplex or big-M method
var SimplexType = {
    PRIMAL: "primal",
    DUAL: "dual",
    BIG_M: "big-M",

    properties: {
        "primal": {
            name: "primal",
        },
        "dual": {
            name: "dual",
        },
        "big-M": {
            name: "big-M" //Is implemented as real abstract big-M-values, not simply big numbers
        }
    }
}