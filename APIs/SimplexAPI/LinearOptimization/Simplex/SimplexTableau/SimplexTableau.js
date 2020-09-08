const MAX_ARCHIVE_ENTRIES = 0;
const LIMIT_ARCHIVE = true;

//Central object of the algorithm. It is used to pass on information among primal-, dualsimplex, big-M-method and branch and bound procedure
class SimplexTableau {
    constructor(decisionVariables, simplexVariableTypeVector, coefficientMatrix, basis) {

        this.decisionVariables = decisionVariables; //type: map - key: variablename, value: variable
        this.simplexVariableTypeVector = simplexVariableTypeVector; //type: array - array of simplex variable type enums
        this.simplexTableauStates = new Set([]); //type: set - states: feasible, infeasible, dual-feasible, bigM-feasible, optimal, primal degenerated, dual degenerated, unbound

        this.coefficientMatrix = coefficientMatrix; //type: matrix
        this.bigMCoefficientMatrix = null; //type: matrix
        this.basis = basis; //Consists of variable indices

        this.previousBases = []; //type: array - array of arrays
        this.previousCoefficientMatrices = []; //type: array - array of matrices
        this.previousBigMCoefficientMatrices = []; //type: array - array of matrices
    }

    addSimplexTableauState(simplexTableauState) {
        this.simplexTableauStates.add(simplexTableauState);
    }

    removeSimplexTableauState(simplexTableauState) {
        this.simplexTableauStates.delete(simplexTableauState);
    }

    getSimplexTableauStates() {
        return this.simplexTableauStates;
    }

    getDecisionVariables() {
        return this.decisionVariables;
    }

    getCoefficientMatrix() {
        return this.coefficientMatrix;
    }

    getBigMCoefficientMatrix() {
        return this.bigMCoefficientMatrix;
    }

    setBigMCoefficientMatrix(bigMCoefficientMatrix) {
        this.bigMCoefficientMatrix = bigMCoefficientMatrix;
    }

    getBasis() {
        return this.basis;
    }

    getArchivedInformation() {
        return [this.previousBases, this.previousCoefficientMatrices, this.previousBigMCoefficientMatrices];
    }

    getVariableTypeVector() {
        return this.simplexVariableTypeVector;
    }

    getNumberOfArchivedEntries() {
        return this.previousBases.length;
    }

    //The tableau states and previous information is not copied along. 
    copy() {
        let copy = new SimplexTableau(new Map(this.decisionVariables), [...this.simplexVariableTypeVector], this.coefficientMatrix.copy(), [...this.basis]);

        if (this.bigMCoefficientMatrix != null) {
            copy.setBigMCoefficientMatrix(this.bigMCoefficientMatrix.copy());
        }

        return copy;
    }

    //Archives current coefficient-matrix, bigM-matrix and basis
    archiveCurrentInformation() {

        if(LIMIT_ARCHIVE && this.previousBases.length > MAX_ARCHIVE_ENTRIES) {
            this.previousBases.pop();
            this.previousCoefficientMatrices.pop();
            this.previousBigMCoefficientMatrices.pop();
        }

        this.previousCoefficientMatrices.push(this.coefficientMatrix.copy());
        this.previousBases.push(this.basis.clone());

        if (this.bigMCoefficientMatrix != null) {
            this.previousBigMCoefficientMatrices.push(this.bigMCoefficientMatrix.copy());
        }
    }

    //Removes on or several entries from the archive
    removeFromArchive(index, numberOfEntries) {
        if (index < 0 || index > this.previousBases.length - 1) {
            console.log("The index " + index + " does not belong to archived information!");
            return;
        }

        this.previousBases.splice(index, numberOfEntries);
        this.previousCoefficientMatrices.splice(index, numberOfEntries); //Experimental change - before: numberOfEntries = 1
        this.previousBigMCoefficientMatrices.splice(index, numberOfEntries);
    }

    //Returns a map that contains all decision variables and their value
    //NOTE: Can only produce resonable and sensible output if the simplexTableau is solved to optimality and is feasible
    getResult() {
        if (!this.simplexTableauStates.has(SimplexTableauState.OPTIMAL)) {
            return new Map();
        }

        let decisionVariablesArray = [...this.decisionVariables.values()];
        let basis = this.basis;
        let coefficientMatrixObject = this.coefficientMatrix;
        let coefficientMatrix = coefficientMatrixObject.getMatrix();

        let resultMap = new Map();

        let index = 0;
        for (let decisionVariable of decisionVariablesArray) {
            index++;

            if (basis.includes(index)) {
                let valueIndex = basis.indexOf(index);
                let value = coefficientMatrix[valueIndex][0];
                resultMap.set(decisionVariable, value);
            } else {
                resultMap.set(decisionVariable, 0);
            }
        }

        return resultMap;
    }
}
