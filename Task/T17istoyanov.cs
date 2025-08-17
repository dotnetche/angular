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
        // Get free variables and try different combinations
        var freeVars = liSys.GetFreeVariables();
        var availableNumbers = GetAvailableNumbers();
        
        return TryAssignFreeVariables(liSys, freeVars, availableNumbers, 0);
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
        
        foreach (int value in available)
        {
            // Try assigning this value to the free variable
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