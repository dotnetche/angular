using System;
using System.Collections.Generic;
using System.Linq;

namespace TL.Student.Implementations
{
    public class T17istoyanov : IT17
    {
        private int n;
        private int[][] matrix;
        private List<(int r, int c)> empties = new List<(int, int)>();
        private HashSet<int> used = new HashSet<int>();
        private int targetSum;

        public int[][] Solve(int[][] ms)
        {
            if (ms == null || ms.Length == 0)
                throw new ArgumentException("Matrix cannot be null or empty");

            n = ms.Length;
            matrix = CloneMatrix(ms);
            
            // Find empty positions and used numbers
            FindEmptyPositionsAndUsedNumbers();
            
            // Calculate target sum
            targetSum = CalculateTargetSum();
            
            // Use different strategies based on matrix size
            if (n <= 3)
            {
                return SolveSmallMatrix();
            }
            else
            {
                return SolveLargeMatrix();
            }
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

        private void FindEmptyPositionsAndUsedNumbers()
        {
            empties.Clear();
            used.Clear();
            
            for (int i = 0; i < n; i++)
            {
                for (int j = 0; j < n; j++)
                {
                    if (matrix[i][j] == 0)
                        empties.Add((i, j));
                    else
                        used.Add(matrix[i][j]);
                }
            }
        }

        private int CalculateTargetSum()
        {
            // Try to determine target sum from complete rows/columns/diagonals
            for (int i = 0; i < n; i++)
            {
                if (matrix[i].All(x => x != 0))
                    return matrix[i].Sum();
            }
            
            for (int j = 0; j < n; j++)
            {
                bool colComplete = true;
                int colSum = 0;
                for (int i = 0; i < n; i++)
                {
                    if (matrix[i][j] == 0)
                    {
                        colComplete = false;
                        break;
                    }
                    colSum += matrix[i][j];
                }
                if (colComplete) return colSum;
            }
            
            // Check main diagonal
            bool diagComplete = true;
            int diagSum = 0;
            for (int i = 0; i < n; i++)
            {
                if (matrix[i][i] == 0)
                {
                    diagComplete = false;
                    break;
                }
                diagSum += matrix[i][i];
            }
            if (diagComplete) return diagSum;
            
            // Check anti-diagonal
            bool antiDiagComplete = true;
            int antiDiagSum = 0;
            for (int i = 0; i < n; i++)
            {
                if (matrix[i][n - 1 - i] == 0)
                {
                    antiDiagComplete = false;
                    break;
                }
                antiDiagSum += matrix[i][n - 1 - i];
            }
            if (antiDiagComplete) return antiDiagSum;
            
            // If no complete line found, calculate expected sum for magic square
            int totalNumbers = n * n;
            int expectedSum = totalNumbers * (totalNumbers + 1) / 2;
            return expectedSum / n;
        }

        private int[][] SolveSmallMatrix()
        {
            // Use backtracking for small matrices (n <= 3)
            if (TryBacktrack(0))
                return matrix;
            
            throw new Exception("No solution found for small matrix");
        }

        private bool TryBacktrack(int idx)
        {
            if (idx == empties.Count)
                return IsMagic();

            var (r, c) = empties[idx];
            
            // Try numbers from 1 to n*n
            for (int val = 1; val <= n * n; val++)
            {
                if (used.Contains(val)) continue;

                matrix[r][c] = val;
                used.Add(val);

                if (IsCurrentlyValid(r, c) && TryBacktrack(idx + 1))
                    return true;

                used.Remove(val);
                matrix[r][c] = 0;
            }

            return false;
        }

        private int[][] SolveLargeMatrix()
        {
            // For larger matrices, use constraint-based approach
            return SolveWithConstraints();
        }

        private int[][] SolveWithConstraints()
        {
            // Create a list of available numbers
            var availableNumbers = new List<int>();
            for (int i = 1; i <= n * n; i++)
            {
                if (!used.Contains(i))
                    availableNumbers.Add(i);
            }

            // Sort empty positions by constraint level (most constrained first)
            var sortedEmpties = empties.OrderByDescending(pos => CountConstraints(pos.r, pos.c)).ToList();

            return SolveWithConstrainedBacktrack(sortedEmpties, availableNumbers, 0);
        }

        private int[][] SolveWithConstrainedBacktrack(List<(int r, int c)> positions, List<int> available, int idx)
        {
            if (idx == positions.Count)
            {
                return IsMagic() ? matrix : null;
            }

            var (r, c) = positions[idx];
            
            // Get valid candidates for this position
            var candidates = GetValidCandidates(r, c, available);
            
            foreach (int val in candidates)
            {
                matrix[r][c] = val;
                available.Remove(val);

                if (IsCurrentlyValid(r, c))
                {
                    var result = SolveWithConstrainedBacktrack(positions, available, idx + 1);
                    if (result != null)
                        return result;
                }

                available.Add(val);
                available.Sort();
                matrix[r][c] = 0;
            }

            return null;
        }

        private List<int> GetValidCandidates(int row, int col, List<int> available)
        {
            var candidates = new List<int>();
            
            foreach (int val in available)
            {
                // Quick constraint check
                if (CanPlaceValue(row, col, val))
                {
                    candidates.Add(val);
                }
            }
            
            return candidates;
        }

        private bool CanPlaceValue(int row, int col, int val)
        {
            // Check if placing val at (row, col) violates any immediate constraints
            
            // Check row constraint
            int rowSum = val;
            int rowZeros = 0;
            for (int j = 0; j < n; j++)
            {
                if (j != col)
                {
                    if (matrix[row][j] == 0)
                        rowZeros++;
                    else
                        rowSum += matrix[row][j];
                }
            }
            
            if (rowZeros == 0 && rowSum != targetSum) return false;
            if (rowZeros > 0 && rowSum >= targetSum) return false;
            
            // Check column constraint
            int colSum = val;
            int colZeros = 0;
            for (int i = 0; i < n; i++)
            {
                if (i != row)
                {
                    if (matrix[i][col] == 0)
                        colZeros++;
                    else
                        colSum += matrix[i][col];
                }
            }
            
            if (colZeros == 0 && colSum != targetSum) return false;
            if (colZeros > 0 && colSum >= targetSum) return false;
            
            // Check main diagonal if applicable
            if (row == col)
            {
                int diagSum = val;
                int diagZeros = 0;
                for (int i = 0; i < n; i++)
                {
                    if (i != row)
                    {
                        if (matrix[i][i] == 0)
                            diagZeros++;
                        else
                            diagSum += matrix[i][i];
                    }
                }
                
                if (diagZeros == 0 && diagSum != targetSum) return false;
                if (diagZeros > 0 && diagSum >= targetSum) return false;
            }
            
            // Check anti-diagonal if applicable
            if (row + col == n - 1)
            {
                int antiDiagSum = val;
                int antiDiagZeros = 0;
                for (int i = 0; i < n; i++)
                {
                    if (i != row)
                    {
                        if (matrix[i][n - 1 - i] == 0)
                            antiDiagZeros++;
                        else
                            antiDiagSum += matrix[i][n - 1 - i];
                    }
                }
                
                if (antiDiagZeros == 0 && antiDiagSum != targetSum) return false;
                if (antiDiagZeros > 0 && antiDiagSum >= targetSum) return false;
            }
            
            return true;
        }

        private int CountConstraints(int row, int col)
        {
            int constraints = 2; // row and column
            
            if (row == col) constraints++; // main diagonal
            if (row + col == n - 1) constraints++; // anti-diagonal
            
            return constraints;
        }

        private bool IsCurrentlyValid(int row, int col)
        {
            // Check if current placement doesn't violate any completed lines
            
            // Check row
            if (matrix[row].All(x => x != 0) && matrix[row].Sum() != targetSum)
                return false;

            // Check column
            int colSum = 0;
            bool colComplete = true;
            for (int i = 0; i < n; i++)
            {
                if (matrix[i][col] == 0)
                    colComplete = false;
                colSum += matrix[i][col];
            }
            if (colComplete && colSum != targetSum)
                return false;

            // Check main diagonal
            if (row == col)
            {
                int diagSum = 0;
                bool diagComplete = true;
                for (int i = 0; i < n; i++)
                {
                    if (matrix[i][i] == 0)
                        diagComplete = false;
                    diagSum += matrix[i][i];
                }
                if (diagComplete && diagSum != targetSum)
                    return false;
            }

            // Check anti-diagonal
            if (row + col == n - 1)
            {
                int antiDiagSum = 0;
                bool antiDiagComplete = true;
                for (int i = 0; i < n; i++)
                {
                    if (matrix[i][n - 1 - i] == 0)
                        antiDiagComplete = false;
                    antiDiagSum += matrix[i][n - 1 - i];
                }
                if (antiDiagComplete && antiDiagSum != targetSum)
                    return false;
            }

            return true;
        }

        public bool IsMagic()
        {
            if (matrix == null || matrix.Length == 0)
                return false;

            // Check for duplicates and zeros
            var allElements = matrix.SelectMany(row => row).ToList();
            if (allElements.Any(x => x == 0) || allElements.Count != allElements.Distinct().Count())
                return false;

            // Check all rows
            for (int i = 0; i < n; i++)
            {
                if (matrix[i].Sum() != targetSum)
                    return false;
            }

            // Check all columns
            for (int j = 0; j < n; j++)
            {
                int colSum = 0;
                for (int i = 0; i < n; i++)
                {
                    colSum += matrix[i][j];
                }
                if (colSum != targetSum)
                    return false;
            }

            // Check main diagonal
            int diagSum = 0;
            for (int i = 0; i < n; i++)
            {
                diagSum += matrix[i][i];
            }
            if (diagSum != targetSum)
                return false;

            // Check anti-diagonal
            int antiDiagSum = 0;
            for (int i = 0; i < n; i++)
            {
                antiDiagSum += matrix[i][n - 1 - i];
            }
            if (antiDiagSum != targetSum)
                return false;

            return true;
        }
    }
}