//REMARK: When the solver is used as a library, this object should be used as long as it cannot be made sure that simplex tableau can be created flawlessly

//Object representation of a constraint that is primarily used to store the problem internally. 
//Except for transforming equal and bigger than constraints to smaller than constraints, there are no 
//calculations performed directly on those constraints
class Constraint {
    constructor(constraintType, rightHandSideValue) {
        this.rightHandSideValue = rightHandSideValue;
        this.constraintType = constraintType; //Types: smaller than, bigger than or equal
        this.terms = new Map(); //Map of coefficient and variables
    }

    getConstraintType() {
        return this.constraintType;
    }

    getRightHandSideValue() {
        return this.rightHandSideValue;
    }

    getTerms() {
        return this.terms;
    }

    setTerms(terms) {
        this.terms = terms;
    }

    addTerm(variable, coefficient) {
        this.terms.set(variable, coefficient);
    }

    //Creates a deep copy of the constraint and returns it
    clone() {
        let copy = new Constraint(this.constraintType, this.rightHandSideValue);
        this.terms.forEach((coefficient, variable) => {
            copy.addTerm(variable, coefficient);
        });
        return copy;
    }

    //Multiplies all coefficients in the constraint with a factor
    //Handles constraint type, i.e. the constraint type changes when multiplying with a negative factor
    multiply(factor) {
        this.rightHandSideValue = this.rightHandSideValue * factor;
        this.terms.forEach((coefficient, variable) => {
            this.terms.set(variable, coefficient*factor);
        });

        if (factor < 0) {
            switch (this.constraintType) {
                case ConstraintType.SMALLER_THAN:
                    this.constraintType = ConstraintType.BIGGER_THAN;
                    break;
            
                case ConstraintType.BIGGER_THAN:
                    this.constraintType = ConstraintType.SMALLER_THAN;
                    break;
            }
        }
    }
}