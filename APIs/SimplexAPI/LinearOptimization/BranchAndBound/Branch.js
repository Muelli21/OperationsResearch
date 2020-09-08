class Branch {
    constructor(branchAndBound, parent, additionalConstraints) {
        this.branchAndBound = branchAndBound;
        this.additionalConstraints = additionalConstraints; //type: array - is initialized as an empty array
        this.simplexTableau = null; //Is set when branch and bound is initialized

        this.parent = parent; //parent type: branch
        this.leftChild; //type: branch
        this.rightChild; //type: branch

        this.feasible = false; //Indicates if the branch is feasible at all and can be processed further
        this.integerFeasible = false; //Indicates if the branch is integer feasible
    }

    //The "solve" and "evaluate" method have been put into two single methods, because we only have to evaluate a branch's feasibility
    //when we are actually evaluating it. On the other hand, we use the objective function value to choose the sequence in which we evaluate the branches.
    solve() {
        let simplex = this.branchAndBound.getSimplex();
        let constraint = this.additionalConstraints[this.additionalConstraints.length - 1];

        if (this.simplexTableau == null) {
            this.simplexTableau = this.parent.getSimplexTableau().copy();
        }

        //EXPERIMENTAL: Changes to decrease memory usage
        if (LOW_MEMORY_USAGE) { parent = null; }

        this.simplexTableau.addSimplexTableauState(SimplexTableauState.OPTIMAL);
        simplex.addConstraint(this.simplexTableau, constraint);
    }

    evaluate() {
        if (this.simplexTableau == null) {
            console.log("This branch could not be evaluated, because it has not been solved yet.");
            return;
        }

        if (this.isFeasible()) {
            this.checkIntegerFeasibility();
        } else if (LOW_MEMORY_USAGE) {
            //EXPERIMENTAL: Changes to decrease memory usage
            this.parent = null;
            this.leftChild = null;
            this.rightChild = null;
            this.simplexTableau = null;
            this.branchAndBound = null;
            this.additionalConstraints = null;
        }
    }

    //Either the variable names or the variables have to be put into the map -> decide for one!
    //In order to keep the program more lean, I have decided to use the variables names and not the variable-object itself. 
    //Both are unique anyways.
    split(decisionVariable, rightHandSideValue) {

        let leftConstraint = new Constraint(ConstraintType.SMALLER_THAN, Math.floor(rightHandSideValue));
        leftConstraint.addTerm(decisionVariable.getName(), 1);
        let leftChild = new Branch(this.branchAndBound, this, [...this.additionalConstraints, leftConstraint]);

        let rightConstraint = new Constraint(ConstraintType.BIGGER_THAN, Math.ceil(rightHandSideValue));
        rightConstraint.addTerm(decisionVariable.getName(), 1);
        let rightChild = new Branch(this.branchAndBound, this, [...this.additionalConstraints, rightConstraint]);

        if (!LOW_MEMORY_USAGE) {
            this.leftChild = leftChild;
            this.rightChild = rightChild;
        }

        this.branchAndBound.addToCandidateList(leftChild, rightChild);
    }

    //Evaluates whether each decision variable of type integer already is an integer value
    //Because there are not native integer values in javascript, but only floats, rounding errors make this task problematic. 
    //However, the problem can be bypassed by fixing the number
    checkIntegerFeasibility() {
        let simplexTableau = this.simplexTableau;
        let coefficientMatrix = simplexTableau.getCoefficientMatrix().getMatrix();
        let decisionVariablesMap = simplexTableau.getDecisionVariables();
        let decisionVariablesArray = [...decisionVariablesMap.values()];
        let basis = simplexTableau.getBasis();
        let variableTypeVector = simplexTableau.getVariableTypeVector();

        for (let index = 0; index < basis.length; index++) {
            let basisVariableIndex = basis[index];
            let variableType = variableTypeVector[basisVariableIndex];

            if (variableType != SimplexVariableType.DECISION_VARIABLE) {
                continue;
            }

            let decisionVariable = decisionVariablesArray[basisVariableIndex - 1];
            let variableTypes = decisionVariable.getVariableTypes();
            let rightHandSideValue = coefficientMatrix[index][0]
            let isIntegerVariable = variableTypes.has(VariableType.INTEGER);

            //Could be problematic, because JS is using floats -> weird fix using toFixed() method
            let isIntegerFeasible = Number.isInteger(Number(rightHandSideValue.toFixed(5)));

            if (isIntegerVariable && !isIntegerFeasible) {
                this.split(decisionVariable, rightHandSideValue);
                return;
            }
        }

        //EXPERIMENTAL: Changes to decrease memory usage
        if (LOW_MEMORY_USAGE) {
            this.parent = null;
            this.leftChild = null;
            this.rightChild = null;
        }

        this.integerFeasible = true;
        this.branchAndBound.addIntegerBranch(this);
    }

    //Returns the objective function value if the branch has been solved already. 
    //Otherwise, the branch is solved at first and the objective function value is returned afterwards. 
    getObjectiveFunctionValue() {
        if (this.simplexTableau == null) {
            this.solve();
        }

        if (this.isFeasible()) {
            let coefficientMatrixObject = this.simplexTableau.getCoefficientMatrix();
            let coefficientMatrix = coefficientMatrixObject.getMatrix();
            return coefficientMatrix[coefficientMatrixObject.getRows() - 1][0];
        }

        return null;
    }

    isFeasible() {
        if (this.simplexTableau != null) {
            return !this.simplexTableau.getSimplexTableauStates().has(SimplexTableauState.INFEASIBLE);
        }
        return false;
    }

    setSimplexTableau(simplexTableau) {
        this.simplexTableau = simplexTableau;
    }

    getSimplexTableau() {
        return this.simplexTableau;
    }

    getAdditionalConstraints() {
        return this.additionalConstraints;
    }
}