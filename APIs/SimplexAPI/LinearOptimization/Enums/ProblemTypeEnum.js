//The problem type enum determines whether a problem is a maximisation or a minimisation problem
var ProblemType = {
    MAX: "maximize",
    MIN: "minimize",

    properties: {
        "maximize": {
            name: "maximize",
            expressions: ["maximize", "max"]
        },
        "minimize": {
            name: "minimize", 
            expressions: ["minimize", "min"]
        }
    }
}

//Array that can be used to iterate over all Enum types
const problemTypes = [
    ProblemType.MAX,
    ProblemType.MIN
];