//Enum declaring the range of variables, i.e. whether they are non-negative, integer-valued, or can obtain real numbers
var VariableType = {
    NON_NEGATIVE: "non-negative",
    INTEGER: "integer",
    REAL: "real",

    properties: {
        "non-negative": {
            name: "non-negative",
            expression: "non-negative"
        },
        "integer": {
            name: "positive integer",
            expression: "element of I"
        },
        "real": {
            name: "real",
            expression: "element of R"
        }
    }
}

//Array used to easily iterate over the enum types
const variableTypes = [
    VariableType.NON_NEGATIVE,
    VariableType.INTEGER,
    VariableType.REAL
];