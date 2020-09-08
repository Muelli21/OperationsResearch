//REMARK: When the solver is used as a library, this object should be used as long as it cannot be made sure that simplex tableau can be created flawlessly

//Object meant to store information on variables that are used in constraints and the objective function value
class Variable {
    constructor(name) {
        this.name = name;
        this.variableTypes = new Set([VariableType.NON_NEGATIVE]); //Types: non-negative, real, integer
    }

    getName() {
        return this.name;
    }

    addVariableType(variableType) {
        this.variableTypes.add(variableType);
    }

    getVariableTypes() {
        return this.variableTypes;
    }
}

