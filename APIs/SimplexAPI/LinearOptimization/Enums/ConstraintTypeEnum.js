//Enum value that defines whether a constraint is a smaller than, bigger than or equal constraint
var ConstraintType = {

    SMALLER_THAN: "smaller than",
    BIGGER_THAN: "bigger than",
    EQUAL: "equal",

    properties: {
        "smaller than": {
            name: "smaller than",
            expression: "<="
        },
        "bigger than": {
            name: "bigger than",
            expression: ">="
        },
        "equal": {
            name: "equal",
            expression: "="
        }
    }
}

//Array that can be used to iterate over all Enum types
const constraintTypes = [
    ConstraintType.SMALLER_THAN,
    ConstraintType.BIGGER_THAN,
    ConstraintType.EQUAL
];