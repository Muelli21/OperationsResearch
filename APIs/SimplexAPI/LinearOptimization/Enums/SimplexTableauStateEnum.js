//Enum used to determine a simplex tableau state
var SimplexTableauState = { 

    FEASIBLE: "feasible", //If problem is primal feasible
    DUAL_FEASIBLE: "dual-feasible",//If problem is dual feasible
    BIG_M_FEASIBLE: "bigM-feasible",//If problem is big-M feasible
    OPTIMAL: "optimal",//If problem is optimal
    INFEASIBLE: "infeasible",//If problem is primal infeasible, dual infeasible and big-M infeasible
    PRIMAL_DEGENERATED: "primal degenerated",//If problem is primal degenerated, i.e. has an overdefined edge
    DUAL_DEGENERATED: "dual degenerated",//If problem is dual degenerated, i.e. has multiple optimal solutions due to an objective function vector perpendicular to a constraint
    UNBOUND: "unbound",//If problem is unbound, i.e. the objective function value can be increased (max) or decreased (min) infinitely

    properties: {
        "feasible": {
            name: "feasible",
            log: "the simplex tableau is feasible but not yet optimal"
        },
        "dual-feasible": {
            name: "dual-feasible",
            log: "the simplex tableau is dual feasible but not yet optimal"
        },
        "bigM-feasible": {
            name: "bigM-feasible",
            log: "the simplex tableau can be solved using the bigM-method and is not yet optimal"
        },
        "optimal": {
            name: "optimal",
            log: "the simplex algorithm has terminated with an optimal solution"
        },
        "infeasible": {
            name: "infeasible",
            log: "the given linear programming problem is infeasible"
        },
        "primal degenerated": {
            name: "primal degenerated",
            log: "the simplex algorithm has an overdefined edge"
        },
        "dual degenerated": {
            name: "dual degenerated",
            log: "the simplex algorithm has several optimal solutions"
        },
        "unbound": {
            name: "unbound",
            log: "the simplex algorithm has terminated without a specific optimal solution; the problem is unbound. Hence, it exists an infinite amount of optimal solutions"
        },
        "cycling": {
            name: "cycling",
            log: "the simplex algorithm is cycling"
        }
    }
};