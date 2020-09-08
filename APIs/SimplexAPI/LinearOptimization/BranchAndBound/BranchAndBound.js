const LOW_MEMORY_USAGE = true;

class BranchAndBound {

    //The branch and bound algorithm takes a simplex tableau as input, which has been solved to optimality before. 
    //This simplex tableau is then used as the relaxation
    constructor(simplex, relaxationTableau) {
        this.relaxationTableau = relaxationTableau;
        this.rule = BranchingRule.MUB; //Rules: MUB, LIFO, FIFO
        this.simplex = simplex;

        this.headBranch; //set in calculateIntegerSolution()
        this.integerBranches = []; //type: array - stores all integer branches, even the bad ones

        this.candidateList = []; //type: array
        this.numberOfSubbranches = 0; //counts how many sub branches are created during branch and bound procedure
    }

    //Starts the branch and bound procedure and iteratively adds constraints to find an integer solution
    calculateIntegerSolution() {

        this.headBranch = new Branch(this, null, []);
        this.headBranch.setSimplexTableau(this.relaxationTableau);
        this.candidateList.push(this.headBranch);

        if (this.rule == BranchingRule.LIFO || this.rule == BranchingRule.FIFO) {
            while (!this.candidateList.isEmpty()) {
                let currentBranch = BranchingRule.FIFO ? this.candidateList.shift() : this.candidateList.pop();
                if (currentBranch != this.headBranch) { currentBranch.solve(); }
                currentBranch.evaluate();
            }
        }

        else {
            while (!this.candidateList.isEmpty()) {
                //Iterates through branches and continues with the most promising one
                //Sorts candidate List by objective function value
                //Efficiency when sorting could be improved by inserting each branch into its right slot
                //Here, a heap structure could be used to improve performance
                this.candidateList.sort((a, b) => a.getObjectiveFunctionValue() - b.getObjectiveFunctionValue()); // Is not accessed durig first iteration
                let mostPromisingBranch = this.candidateList[0];
                mostPromisingBranch.evaluate();
                this.candidateList.shift();
            }
        }

        this.integerBranches.sort((a, b) => a.getObjectiveFunctionValue() - b.getObjectiveFunctionValue());
        //Return simplexTableau and not the branch
        let bestIntegerBranch = this.integerBranches[0];
        let simplexTableau = bestIntegerBranch.getSimplexTableau();
        return simplexTableau;
    }

    addIntegerBranch(branch) {
        if (LOW_MEMORY_USAGE) {
            if (this.integerBranches.isEmpty()) {
                this.integerBranches.push(branch);

            } else if (branch.getObjectiveFunctionValue() > this.integerBranches[0].getObjectiveFunctionValue()) {
                this.integerBranches[0] = branch;
            }
        } else {
            this.integerBranches.push(branch);
        }
    }

    //Adds branch to candidate list
    //The behavior is different in case of using MUB, because in this case the branches are directly solved. 
    addToCandidateList(leftBranch, rightBranch) {
        this.numberOfSubbranches = this.numberOfSubbranches + 2;
        if (this.rule == BranchingRule.MUB) {
            leftBranch.solve();
            rightBranch.solve();

            if (leftBranch.isFeasible()) { this.candidateList.push(leftBranch); }
            if (rightBranch.isFeasible()) { this.candidateList.push(rightBranch); }

        } else {
            this.candidateList.push(leftBranch, rightBranch);
        }
    }

    getSimplex() {
        return this.simplex;
    }
}