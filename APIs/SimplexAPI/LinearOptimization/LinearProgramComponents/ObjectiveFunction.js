//REMARK: When the solver is used as a library, this object should be used as long as it cannot be made sure that simplex tableau can be created flawlessly

//Internal representation of the objective function
class ObjectiveFunction {
    constructor(problemType, objectiveFunctionVariableName, constant) {
        this.problemType = problemType; //type: enum
        this.objectiveFunctionVariableName = objectiveFunctionVariableName; //type: string
        this.constant = constant; //already adjusted for the use in the tableau i.e. 
        this.terms = new Map(); //type: map - maps coefficient to variables
    }

    getProblemType() {
        return this.problemType;
    }

    getObjectiveFunctionVariableName() {
        return this.objectiveFunctionVariableName;
    }

    setConstant(constant) {
        this.constant = constant;
    }

    getConstant() {
        return this.constant;
    }

    addTerm(variable, coefficient) {
        this.terms.set(variable, coefficient);
    }

    getTerms() {
        return this.terms;
    }
}

//Transforms minimisation objective functions to maximisation objective functions by multiplying coefficients, the constant and altering the problem type
//Returns a new instance
function transformToMaxObjectiveFunction(objectiveFunction) {
    let problemType = objectiveFunction.getProblemType();
    let objectiveFunctionVariableName = objectiveFunction.getObjectiveFunctionVariableName();
    let constant = objectiveFunction.getConstant();


    let terms = objectiveFunction.getTerms();
    let transformedObjectiveFunction = new ObjectiveFunction(ProblemType.MAX, objectiveFunctionVariableName, constant);

    switch (problemType) {
        case ProblemType.MAX:
            terms.forEach((coefficient, variable) => {
                transformedObjectiveFunction.addTerm(variable, coefficient);
            });
            break;
        
        case ProblemType.MIN:
            transformedObjectiveFunction.setConstant(-1*transformedObjectiveFunction.getConstant());
            terms.forEach((coefficient, variable) => {
                transformedObjectiveFunction.addTerm(variable, -1*coefficient);
            });
            break;
    }

    return transformedObjectiveFunction;
}