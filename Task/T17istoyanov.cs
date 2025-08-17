using System;
using System.Collections.Generic;
using System.Linq;
using TL.Student.Interfaces;

namespace TL.Student.Implementations;

public class T17istoyanov : IT17
{
    private int n;
    private int[][] matrix;
    private int targetSum;

    public int[][] Solve(int[][] ms)
    {
        if (ms == null || ms.Length == 0)
            throw new ArgumentException("Matrix cannot be null or empty");

        n = ms.Length;
        matrix = CloneMatrix(ms);
        targetSum = CalculateMagicSquareSum();

        // Use linear equation system approach
        var solution = SolveWithLinearSystem();
        
        if (solution == null)
            throw new Exception("No solution found");
            
        return solution;
    }

    private int[][] SolveWithLinearSystem()
    {
        // Build linear system
        var liSys = new LiSys();
        
        // (1.1) Size-related equations (magic square rules)
        AddSizeRelatedEquations(liSys);
        
        // (1.2) Task-related equations (known values)
        AddTaskRelatedEquations(liSys);
        
        // Solve the system
        liSys.Solve();
        
        // Check solution type
        var solutionType = liSys.GetSolutionType();
        
        switch (solutionType)
        {
            case SolutionType.ExactSolution:
                return ExtractSolutionFromSystem(liSys);
                
            case SolutionType.NoSolution:
                return null;
                
            case SolutionType.MultipleSolutions:
                // Try to find a valid solution by trying different values for free variables
                return SolveMultipleSolutions(liSys);
                
            default:
                return null;
        }
    }

    private void AddSizeRelatedEquations(LiSys liSys)
    {
        // Rows: A1 + B1 + C1 = Sum
        for (int i = 0; i < n; i++)
        {
            var eq = new Eq();
            for (int j = 0; j < n; j++)
            {
                eq.Term(1, GetCellName(i, j));
            }
            eq.Term(-1, "Sum");
            liSys.Add(eq);
        }
        
        // Columns: A1 + A2 + A3 = Sum
        for (int j = 0; j < n; j++)
        {
            var eq = new Eq();
            for (int i = 0; i < n; i++)
            {
                eq.Term(1, GetCellName(i, j));
            }
            eq.Term(-1, "Sum");
            liSys.Add(eq);
        }
        
        // Main diagonal: A1 + B2 + C3 = Sum
        var diagEq = new Eq();
        for (int i = 0; i < n; i++)
        {
            diagEq.Term(1, GetCellName(i, i));
        }
        diagEq.Term(-1, "Sum");
        liSys.Add(diagEq);
        
        // Anti-diagonal: A3 + B2 + C1 = Sum
        var antiDiagEq = new Eq();
        for (int i = 0; i < n; i++)
        {
            antiDiagEq.Term(1, GetCellName(i, n - 1 - i));
        }
        antiDiagEq.Term(-1, "Sum");
        liSys.Add(antiDiagEq);
        
        // Sum constraint: Sum = targetSum
        var sumEq = new Eq();
        sumEq.Term(1, "Sum").Term(-targetSum, null);
        liSys.Add(sumEq);
    }

    private void AddTaskRelatedEquations(LiSys liSys)
    {
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (matrix[i][j] != 0)
                {
                    // A1 = 8 => A1 - 8 = 0
                    var eq = new Eq();
                    eq.Term(1, GetCellName(i, j)).Term(-matrix[i][j], null);
                    liSys.Add(eq);
                }
            }
        }
    }

    private string GetCellName(int row, int col)
    {
        char colChar = (char)('A' + col);
        return $"{colChar}{row + 1}";
    }

    private int[][] ExtractSolutionFromSystem(LiSys liSys)
    {
        var result = CloneMatrix(matrix);
        
        foreach (var eq in liSys.GetEquations())
        {
            if (eq.IsVariableAssignment(out string variable, out double value))
            {
                var (row, col) = ParseCellName(variable);
                if (row >= 0 && col >= 0)
                {
                    result[row][col] = (int)Math.Round(value);
                }
            }
        }
        
        return result;
    }

    private int[][] SolveMultipleSolutions(LiSys liSys)
    {
        // For large matrices with many free variables, use mathematical construction
        if (n >= 4 && liSys.GetFreeVariables().Count > n)
        {
            return SolveUsingMagicSquareConstruction();
        }
        else
        {
            // For smaller cases, try systematic assignment
            var freeVars = liSys.GetFreeVariables();
            var availableNumbers = GetAvailableNumbers();
            
            return TryAssignFreeVariablesOptimized(liSys, freeVars, availableNumbers);
        }
    }

    private int[][] SolveUsingMagicSquareConstruction()
    {
        // Use Siamese method for odd n, or other construction methods
        if (n % 2 == 1)
        {
            return ConstructOddMagicSquare();
        }
        else if (n % 4 == 0)
        {
            return ConstructDoublyEvenMagicSquare();
        }
        else
        {
            return ConstructSinglyEvenMagicSquare();
        }
    }

    private int[][] ConstructOddMagicSquare()
    {
        // Siamese method for odd n
        var result = new int[n][];
        for (int i = 0; i < n; i++)
            result[i] = new int[n];

        // Copy known values first
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                result[i][j] = matrix[i][j];
            }
        }

        // If we have constraints, try to build around them
        if (GetAvailableNumbers().Count < n * n - 5)
        {
            // Too many constraints for construction method, fall back to optimized search
            return TryConstrainedConstruction(result);
        }

        // Standard Siamese method
        var tempSquare = new int[n][];
        for (int i = 0; i < n; i++)
            tempSquare[i] = new int[n];

        int row = 0;
        int col = n / 2;

        for (int num = 1; num <= n * n; num++)
        {
            tempSquare[row][col] = num;

            int newRow = (row - 1 + n) % n;
            int newCol = (col + 1) % n;

            if (tempSquare[newRow][newCol] != 0)
            {
                row = (row + 1) % n;
            }
            else
            {
                row = newRow;
                col = newCol;
            }
        }

        // Try to adapt to constraints
        return AdaptMagicSquareToConstraints(tempSquare, result);
    }

    private int[][] ConstructDoublyEvenMagicSquare()
    {
        // For n divisible by 4
        var result = new int[n][];
        for (int i = 0; i < n; i++)
            result[i] = new int[n];

        // Fill with natural order
        int num = 1;
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                result[i][j] = num++;
            }
        }

        // Apply doubly even transformation
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                bool inMainDiag = (i % 4 == j % 4);
                bool inAntiDiag = ((i % 4) + (j % 4) == 3);
                
                if (inMainDiag || inAntiDiag)
                {
                    result[i][j] = n * n + 1 - result[i][j];
                }
            }
        }

        return AdaptMagicSquareToConstraints(result, matrix);
    }

    private int[][] ConstructSinglyEvenMagicSquare()
    {
        // For n = 4k+2, use LUX method
        int half = n / 2;
        var oddSquare = ConstructOddMagicSquareOfSize(half);
        
        var result = new int[n][];
        for (int i = 0; i < n; i++)
            result[i] = new int[n];

        // Fill quadrants
        for (int i = 0; i < half; i++)
        {
            for (int j = 0; j < half; j++)
            {
                int val = oddSquare[i][j];
                result[i][j] = val;                           // A
                result[i][j + half] = val + 2 * half * half;  // B
                result[i + half][j] = val + 3 * half * half;  // D
                result[i + half][j + half] = val + half * half; // C
            }
        }

        // Apply LUX transformations
        int k = (n - 2) / 4;
        for (int i = 0; i < half; i++)
        {
            for (int j = 0; j < k; j++)
            {
                if (i != k)
                {
                    // Swap A and D
                    (result[i][j], result[i + half][j]) = (result[i + half][j], result[i][j]);
                }
            }
        }

        return AdaptMagicSquareToConstraints(result, matrix);
    }

    private int[][] ConstructOddMagicSquareOfSize(int size)
    {
        var result = new int[size][];
        for (int i = 0; i < size; i++)
            result[i] = new int[size];

        int row = 0;
        int col = size / 2;

        for (int num = 1; num <= size * size; num++)
        {
            result[row][col] = num;

            int newRow = (row - 1 + size) % size;
            int newCol = (col + 1) % size;

            if (result[newRow][newCol] != 0)
            {
                row = (row + 1) % size;
            }
            else
            {
                row = newRow;
                col = newCol;
            }
        }

        return result;
    }

    private int[][] AdaptMagicSquareToConstraints(int[][] magicSquare, int[][] constraints)
    {
        // Try to adapt the constructed magic square to match constraints
        var constraintPositions = new List<(int r, int c, int val)>();
        
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (constraints[i][j] != 0)
                {
                    constraintPositions.Add((i, j, constraints[i][j]));
                }
            }
        }

        // If no constraints, return the constructed square
        if (constraintPositions.Count == 0)
            return magicSquare;

        // Try to find a permutation that satisfies constraints
        return FindPermutationForConstraints(magicSquare, constraintPositions);
    }

    private int[][] FindPermutationForConstraints(int[][] magicSquare, List<(int r, int c, int val)> constraints)
    {
        // Create a mapping from values to positions in the magic square
        var valueToPositions = new Dictionary<int, List<(int r, int c)>>();
        
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                int val = magicSquare[i][j];
                if (!valueToPositions.ContainsKey(val))
                    valueToPositions[val] = new List<(int, int)>();
                valueToPositions[val].Add((i, j));
            }
        }

        // Try to find valid swaps
        var result = CloneMatrix(magicSquare);
        
        foreach (var (r, c, val) in constraints)
        {
            if (result[r][c] != val)
            {
                // Find where this value currently is
                if (valueToPositions.ContainsKey(val))
                {
                    var positions = valueToPositions[val];
                    foreach (var (vr, vc) in positions)
                    {
                        // Try swapping
                        int currentVal = result[r][c];
                        result[r][c] = val;
                        result[vr][vc] = currentVal;
                        
                        if (IsValidMagicSquare(result))
                        {
                            // Update mapping
                            valueToPositions[val] = new List<(int, int)> { (r, c) };
                            if (!valueToPositions.ContainsKey(currentVal))
                                valueToPositions[currentVal] = new List<(int, int)>();
                            valueToPositions[currentVal].Add((vr, vc));
                            break;
                        }
                        else
                        {
                            // Revert swap
                            result[r][c] = currentVal;
                            result[vr][vc] = val;
                        }
                    }
                }
            }
        }

        return IsValidMagicSquare(result) ? result : null;
    }

    private int[][] TryConstrainedConstruction(int[][] constraints)
    {
        // For heavily constrained cases, use a more targeted approach
        var result = CloneMatrix(constraints);
        var available = GetAvailableNumbers();
        var empties = new List<(int r, int c)>();
        
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (result[i][j] == 0)
                    empties.Add((i, j));
            }
        }

        // Sort by constraint level (positions with more constraints first)
        empties.Sort((a, b) => GetConstraintLevel(a.r, a.c).CompareTo(GetConstraintLevel(b.r, b.c)));
        
        return TryFillConstrainedPositions(result, empties, available, 0);
    }

    private int[][] TryFillConstrainedPositions(int[][] current, List<(int r, int c)> empties, List<int> available, int index)
    {
        if (index == empties.Count)
        {
            return IsValidMagicSquare(current) ? current : null;
        }

        var (r, c) = empties[index];
        var candidates = GetValidCandidates(current, r, c, available);
        
        foreach (int val in candidates.Take(Math.Min(5, candidates.Count))) // Limit candidates
        {
            current[r][c] = val;
            var newAvailable = available.Where(x => x != val).ToList();
            
            var result = TryFillConstrainedPositions(current, empties, newAvailable, index + 1);
            if (result != null)
                return result;
                
            current[r][c] = 0;
        }

        return null;
    }

    private List<int> GetValidCandidates(int[][] current, int row, int col, List<int> available)
    {
        var candidates = new List<int>();
        
        foreach (int val in available)
        {
            current[row][col] = val;
            if (IsCurrentlyValidOnAllDirections(current, row, col))
            {
                candidates.Add(val);
            }
            current[row][col] = 0;
        }
        
        return candidates;
    }

    private int GetConstraintLevel(int row, int col)
    {
        int level = 1; // Base level for row and column
        
        if (row == col) level++; // Main diagonal
        if (row + col == n - 1) level++; // Anti-diagonal
        
        return level;
    }

    private int[][] TryAssignFreeVariablesOptimized(LiSys liSys, List<string> freeVars, List<int> available)
    {
        // For smaller cases with few free variables
        if (freeVars.Count > 10) return null; // Too many free variables
        
        return TryAssignFreeVariables(liSys, freeVars, available, 0);
    }

    private int[][] TryAssignFreeVariables(LiSys liSys, List<string> freeVars, List<int> available, int index)
    {
        if (index == freeVars.Count)
        {
            var candidate = ExtractSolutionFromSystem(liSys);
            if (IsValidMagicSquare(candidate))
                return candidate;
            return null;
        }
        
        string variable = freeVars[index];
        
        foreach (int value in available.Take(Math.Min(8, available.Count))) // Limit search
        {
            var tempSys = liSys.Clone();
            var assignEq = new Eq();
            assignEq.Term(1, variable).Term(-value, null);
            tempSys.Add(assignEq);
            tempSys.Solve();
            
            if (tempSys.GetSolutionType() != SolutionType.NoSolution)
            {
                var newAvailable = available.Where(x => x != value).ToList();
                var result = TryAssignFreeVariables(tempSys, freeVars.Skip(1).ToList(), newAvailable, 0);
                if (result != null)
                    return result;
            }
        }
        
        return null;
    }

    private bool IsCurrentlyValidOnAllDirections(int[][] current, int row, int col)
    }

    private List<int> GetAvailableNumbers()
    {
        var used = new HashSet<int>();
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                if (matrix[i][j] != 0)
                    used.Add(matrix[i][j]);
            }
        }
        
        var available = new List<int>();
        for (int i = 1; i <= n * n; i++)
        {
            if (!used.Contains(i))
                available.Add(i);
        }
        
        return available;
    }

    private (int row, int col) ParseCellName(string cellName)
    {
        if (string.IsNullOrEmpty(cellName) || cellName.Length < 2)
            return (-1, -1);
            
        char colChar = cellName[0];
        if (colChar < 'A' || colChar > 'Z')
            return (-1, -1);
            
        if (!int.TryParse(cellName.Substring(1), out int row))
            return (-1, -1);
            
        return (row - 1, colChar - 'A');
    }

    private bool IsValidMagicSquare(int[][] candidate)
    {
        if (candidate == null) return false;
        
        // Check for zeros and duplicates
        var allElements = candidate.SelectMany(row => row).ToList();
        if (allElements.Any(x => x == 0) || allElements.Count != allElements.Distinct().Count())
            return false;
        
        // Check if all elements are in range 1 to n²
        if (allElements.Any(x => x < 1 || x > n * n))
            return false;
        
        return IsMagic(candidate);
    }

    private bool IsMagic(int[][] candidate)
    {
        // Check rows
        for (int i = 0; i < n; i++)
        {
            if (candidate[i].Sum() != targetSum)
                return false;
        }
        
        // Check columns
        for (int j = 0; j < n; j++)
        {
            int colSum = 0;
            for (int i = 0; i < n; i++)
            {
                colSum += candidate[i][j];
            }
            if (colSum != targetSum)
                return false;
        }
        
        // Check main diagonal
        int diagSum = 0;
        for (int i = 0; i < n; i++)
        {
            diagSum += candidate[i][i];
        }
        if (diagSum != targetSum)
            return false;
        
        // Check anti-diagonal
        int antiDiagSum = 0;
        for (int i = 0; i < n; i++)
        {
            antiDiagSum += candidate[i][n - 1 - i];
        }
        if (antiDiagSum != targetSum)
            return false;
        
        return true;
    }

    public bool IsMagic()
    {
        return IsMagic(matrix);
    }

    private int CalculateMagicSquareSum()
    {
        return n * (n * n + 1) / 2;
    }

    private int[][] CloneMatrix(int[][] original)
    {
        int[][] clone = new int[n][];
        for (int i = 0; i < n; i++)
        {
            clone[i] = new int[n];
            Array.Copy(original[i], clone[i], n);
        }
        return clone;
    }
}

// Equation class for building linear equations
public class Eq
{
    private Dictionary<string, double> terms = new Dictionary<string, double>();
    private double constant = 0;

    public Eq Term(double coefficient, string variable)
    {
        if (variable == null)
        {
            constant += coefficient;
        }
        else
        {
            if (terms.ContainsKey(variable))
                terms[variable] += coefficient;
            else
                terms[variable] = coefficient;
        }
        return this;
    }

    public Dictionary<string, double> GetTerms() => new Dictionary<string, double>(terms);
    public double GetConstant() => constant;

    public bool IsVariableAssignment(out string variable, out double value)
    {
        variable = null;
        value = 0;
        
        if (terms.Count == 1 && Math.Abs(constant) > 1e-10)
        {
            var term = terms.First();
            if (Math.Abs(term.Value - 1.0) < 1e-10)
            {
                variable = term.Key;
                value = -constant;
                return true;
            }
        }
        
        return false;
    }

    public bool IsConflict()
    {
        return terms.Count == 0 && Math.Abs(constant) > 1e-10;
    }

    public bool HasMultipleVariables()
    {
        return terms.Count > 1;
    }

    public Eq Clone()
    {
        var clone = new Eq();
        clone.terms = new Dictionary<string, double>(terms);
        clone.constant = constant;
        return clone;
    }
}

// Linear System class for building and solving systems of linear equations
public class LiSys
{
    private List<Eq> equations = new List<Eq>();

    public LiSys Add(Eq equation)
    {
        equations.Add(equation);
        return this;
    }

    public void Solve()
    {
        // Gaussian elimination with partial pivoting
        bool changed = true;
        while (changed)
        {
            changed = false;
            
            // Look for equations with single variables
            for (int i = 0; i < equations.Count; i++)
            {
                var eq = equations[i];
                if (eq.IsVariableAssignment(out string variable, out double value))
                {
                    // Substitute this variable in all other equations
                    for (int j = 0; j < equations.Count; j++)
                    {
                        if (i != j)
                        {
                            SubstituteVariable(equations[j], variable, value);
                        }
                    }
                    changed = true;
                }
            }
            
            // Remove redundant equations (0 = 0)
            equations.RemoveAll(eq => eq.GetTerms().Count == 0 && Math.Abs(eq.GetConstant()) < 1e-10);
        }
    }

    private void SubstituteVariable(Eq equation, string variable, double value)
    {
        var terms = equation.GetTerms();
        if (terms.ContainsKey(variable))
        {
            double coeff = terms[variable];
            equation.Term(-coeff * value, null); // Add to constant
            equation.Term(-coeff, variable); // Remove variable term
        }
    }

    public SolutionType GetSolutionType()
    {
        // Check for conflicts
        if (equations.Any(eq => eq.IsConflict()))
            return SolutionType.NoSolution;
        
        // Check if all remaining equations are variable assignments
        if (equations.All(eq => eq.IsVariableAssignment(out _, out _) || 
                               (eq.GetTerms().Count == 0 && Math.Abs(eq.GetConstant()) < 1e-10)))
            return SolutionType.ExactSolution;
        
        return SolutionType.MultipleSolutions;
    }

    public List<Eq> GetEquations() => equations;

    public List<string> GetFreeVariables()
    {
        var assignedVars = new HashSet<string>();
        var allVars = new HashSet<string>();
        
        foreach (var eq in equations)
        {
            foreach (var term in eq.GetTerms())
            {
                allVars.Add(term.Key);
            }
            
            if (eq.IsVariableAssignment(out string variable, out _))
            {
                assignedVars.Add(variable);
            }
        }
        
        return allVars.Except(assignedVars).ToList();
    }

    public LiSys Clone()
    {
        var clone = new LiSys();
        clone.equations = equations.Select(eq => eq.Clone()).ToList();
        return clone;
    }
}

public enum SolutionType
{
    ExactSolution,    // (4.1) exactly one solution
    NoSolution,       // (4.2) no solution (conflict)
    MultipleSolutions // (4.3) multiple solutions
}