class TravellingSalesman {
    constructor(geoDataArray) {
        this.geoDataArray = geoDataArray;
        this.solvingMethod = SolvingMethod.MILLER_TUCKER_ZEMLIN;
    }

    solve() {
        switch (this.solvingMethod) {
            case SolvingMethod.NEAREST_NEIGHBOR:
                return this.applyNearestNeighbor();
            case SolvingMethod.MILLER_TUCKER_ZEMLIN:
                return this.applyMillerTuckerZemlin();
            case SolvingMethod.DANTZIG_FULKERSON_JOHNSON:
                return this.applyDantzigFulkersonJohnson();
        }
    }

    applyMillerTuckerZemlin() {
        let geoDataArray = this.geoDataArray;
        let numberOfLocations = geoDataArray.length;
        let distanceMatrixObject = this.createDistanceMatrix();
        let distanceMatrix = distanceMatrixObject.getMatrix();

        let decisionVariablesMap = new Map();
        let constraints = [];
        let objectiveFunction = new ObjectiveFunction(ProblemType.MIN, "distance", 0);

        // Creates binary decision variables (x_ij)
        // by creating an integer decision variable and adding an upper and lower binary constraint
        // Adds objective-function-terms using the distance matrix
        for (let i = 0; i < numberOfLocations; i++) {
            for (let j = 0; j < numberOfLocations; j++) {
                if (i == j) { continue; }

                let name = "x_" + i + "" + j;
                let decisionVariable = new Variable(name);
                decisionVariable.addVariableType(VariableType.INTEGER);
                decisionVariablesMap.set(name, decisionVariable);

                let upperBinaryConstraint = new Constraint(ConstraintType.SMALLER_THAN, 1);
                upperBinaryConstraint.addTerm(name, 1);

                let lowerBinaryConstraint = new Constraint(ConstraintType.BIGGER_THAN, 0);
                lowerBinaryConstraint.addTerm(name, 1);

                constraints.push(upperBinaryConstraint, lowerBinaryConstraint);

                //Objective function terms
                let distance = distanceMatrix[i][j];
                objectiveFunction.addTerm(name, distance);
            }
        }

        // Creates integer decision variables (u_ij)
        // and creates "0 <= u_i <= n - 1"-constraints
        // NOTE: indexing does not start at 0, but at 1
        for (let index = 1; index < numberOfLocations; index++) {
            let name = "u_" + index;
            let decisionVariable = new Variable(name);
            decisionVariable.addVariableType(VariableType.INTEGER);
            decisionVariablesMap.set(name, decisionVariable);

            let upperConstraint = new Constraint(ConstraintType.SMALLER_THAN, numberOfLocations - 1);
            upperConstraint.addTerm(name, 1);

            let lowerConstraint = new Constraint(ConstraintType.BIGGER_THAN, 0);
            lowerConstraint.addTerm(name, 1);

            constraints.push(upperConstraint, lowerConstraint);
        }

        // Creates outgoing-edges constraints
        for (let i = 0; i < numberOfLocations; i++) {
            let constraint = new Constraint(ConstraintType.EQUAL, 1);
            constraints.push(constraint);

            for (let j = 0; j < numberOfLocations; j++) {
                let name = "x_" + i + "" + j;
                constraint.addTerm(name, 1);
            }
        }

        // Creates ingoing-edges constraints 
        for (let j = 0; j < numberOfLocations; j++) {
            let constraint = new Constraint(ConstraintType.EQUAL, 1);
            constraints.push(constraint);

            for (let i = 0; i < numberOfLocations; i++) {
                let name = "x_" + i + "" + j;
                constraint.addTerm(name, 1);
            }
        }

        // Creates subtour-elimination constraints
        // NOTE: indexing does not start at 0, but at 1
        for (let i = 1; i < numberOfLocations; i++) {
            for (let j = 1; j < numberOfLocations; j++) {
                if (i == j) { continue; }

                let nameXij = "x_" + i + "" + j;
                let nameUi = "u_" + i;
                let nameUj = "u_" + j;
                let constraint = new Constraint(ConstraintType.SMALLER_THAN, numberOfLocations - 1);

                constraint.addTerm(nameXij, numberOfLocations);
                constraint.addTerm(nameUi, 1);
                constraint.addTerm(nameUj, -1);

                constraints.push(constraint);
            }
        }

        let simplex = new Simplex(objectiveFunction, decisionVariablesMap, constraints);
        let simplexTableau = simplex.apply();
        console.log(simplexTableau);

        // Translates the simplex tableau into a tour matrix
        let resultMap = simplexTableau.getResult();
        let entries = [...resultMap.values()];

        let tourMatrixObject = new Matrix(numberOfLocations, numberOfLocations);
        let tourMatrix = tourMatrixObject.getMatrix();

        let entryIndex = 0;
        for (let i = 0; i < numberOfLocations; i++) {
            for (let j = 0; j < numberOfLocations; j++) {
                if (i == j) { continue; }

                tourMatrix[i][j] = Number(entries[entryIndex].toFixed(5))
                entryIndex++;
            }
        }

        return[distanceMatrixObject, tourMatrixObject];
    }

    applyNearestNeighbor() {
        let geoDataArray = this.geoDataArray;
        let numberOfLocations = geoDataArray.length;
        let distanceMatrixObject = this.createDistanceMatrix();
        let distanceMatrix = distanceMatrixObject.getMatrix();

        let tourMatrixObject = new Matrix(numberOfLocations, numberOfLocations);
        let tourMatrix = tourMatrixObject.getMatrix();

        // Here, I could simply start iterating over the second array at the first instead of the zeroth position using the first one as the start value
        // -> in that case it would be more complex to deal with equal indices and the already visited nodes

        let visited = new Array(numberOfLocations).fill(false);
        let i = 0;

        visited[0] = true;

        while (visited.includes(false)) {
            let smallestDistance = Number.MAX_VALUE;
            let indexOfSmallestDistance = -1;

            for (let j = 0; j < numberOfLocations; j++) {
                if (i == j || visited[j] == true) { continue; }
                if (smallestDistance > distanceMatrix[i][j]) {
                    smallestDistance = distanceMatrix[i][j];
                    indexOfSmallestDistance = j;
                }
            }

            tourMatrix[i][indexOfSmallestDistance] = 1;
            visited[indexOfSmallestDistance] = true;
            i = indexOfSmallestDistance;
        }

        tourMatrix[i][0] = 1;
        return [distanceMatrixObject, tourMatrixObject];
    }

    createDistanceMatrix() {
        let geoDataArray = this.geoDataArray;
        let numberOfLocations = geoDataArray.length;

        let distanceMatrixObject = new Matrix(numberOfLocations, numberOfLocations);
        let distanceMatrix = distanceMatrixObject.getMatrix();

        for (let i = 0; i < numberOfLocations; i++) {
            for (let j = 0; j < numberOfLocations; j++) {
                if (i == j) { continue; }

                let geoData1 = geoDataArray[i];
                let geometry1 = geoData1.geometry;
                let coordinates1 = geometry1.coordinates;

                let geoData2 = geoDataArray[j];
                let geometry2 = geoData2.geometry;
                let coordinates2 = geometry2.coordinates;

                let distance = sphericalDistance(coordinates1[0], coordinates1[1], coordinates2[0], coordinates2[1]);
                distanceMatrix[i][j] = distance;
            }
        }

        return distanceMatrixObject;
    }

    setSolvingMethod(solvingMethod) {
        this.solvingMethod = solvingMethod;
    }
}