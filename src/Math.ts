export class Matrix {
  public matrix: number[][];
  public readonly row: number;
  public readonly col: number;
  constructor(matrix: number[][]) {
    this.matrix = matrix.map((value) => value.slice());
    this.row = matrix.length;
    this.col = matrix[0].length;
  }
  public copy(): Matrix {
    return new Matrix(this.matrix.map((value) => value.slice()));
  }
  public transposed(): Matrix {
    const mat: number[][] = [];
    for (let i = 0; i < this.col; i++) {
      mat.push([]);
      for (let j = 0; j < this.row; j++) {
        mat[i].push(this.matrix[j][i]);
      }
    }
    return new Matrix(mat);
  }
  public transpose(): Matrix {
    const mat: number[][] = [];
    for (let i = 0; i < this.col; i++) {
      mat.push([]);
      for (let j = 0; j < this.row; j++) {
        mat[i].push(this.matrix[j][i]);
      }
    }
    this.matrix = mat;
    return this;
  }
  private static det(mat: number[][], len: number): number {
    if (len === 1) return mat[0][0];
    if (len === 2) return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    if (len === 3)
      return (
        mat[0][0] * mat[1][1] * mat[2][2] -
        mat[0][0] * mat[1][2] * mat[2][1] +
        mat[0][1] * mat[1][2] * mat[2][0] -
        mat[0][1] * mat[1][0] * mat[2][2] +
        mat[0][2] * mat[1][0] * mat[2][1] -
        mat[0][2] * mat[1][1] * mat[2][0]
      );
    let ans = 0;
    const reduced = mat.map((value) => value.slice(1));
    for (let i = 0; i < len; i += 2) {
      ans += Matrix.det(
        reduced.filter((_value, index) => index != i),
        len - 1
      );
    }
    for (let i = 1; i < len; i += 2) {
      ans -= Matrix.det(
        reduced.filter((_value, index) => index != i),
        len - 1
      );
    }
    return ans;
  }
  public get determinant(): number {
    if (this.row !== this.col) throw 'not square';
    return Matrix.det(this.matrix, this.row);
  }
  public static zeros(row: number, col: number): Matrix {
    const mat: number[][] = [];
    for (let i = 0; i < row; i++) {
      mat.push([]);
      for (let j = 0; j < col; j++) {
        mat[i].push(0);
      }
    }
    return new Matrix(mat);
  }
  public static identity(row: number): Matrix {
    const mat: number[][] = [];
    for (let i = 0; i < row; i++) {
      mat.push([]);
      for (let j = 0; j < row; j++) {
        if (i == j) mat[i].push(1);
        else mat[i].push(0);
      }
    }
    return new Matrix(mat);
  }
  public static add(a: Matrix, b: Matrix): Matrix {
    if (a.row !== b.row || a.col !== b.col) throw 'dimension not match';
    const ans: Matrix = a.copy();
    for (let i = 0; i < ans.row; i++) {
      for (let j = 0; j < ans.col; j++) {
        ans.matrix[i][j] += b.matrix[i][j];
      }
    }
    return ans;
  }
  public add(b: Matrix): Matrix {
    if (this.row !== b.row || this.col !== b.col) throw 'dimension not match';
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.matrix[i][j] += b.matrix[i][j];
      }
    }
    return this;
  }
  public static sub(a: Matrix, b: Matrix): Matrix {
    if (a.row !== b.row || a.col !== b.col) throw 'dimension not match';
    const ans: Matrix = new Matrix(a.matrix.map((value) => value.slice()));
    for (let i = 0; i < ans.row; i++) {
      for (let j = 0; j < ans.col; j++) {
        ans.matrix[i][j] -= b.matrix[i][j];
      }
    }
    return ans;
  }
  public sub(b: Matrix): Matrix {
    if (this.row !== b.row || this.col !== b.col) throw 'dimension not match';
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.matrix[i][j] -= b.matrix[i][j];
      }
    }
    return this;
  }
  public static mul(a: Matrix, b: Matrix): Matrix {
    if (a.col !== b.row) throw 'dimension not match';
    const ans = Matrix.zeros(a.row, b.col);
    for (let i = 0; i < a.row; i++) {
      for (let j = 0; j < b.col; j++) {
        for (let k = 0; k < a.col; k++) {
          ans.matrix[i][j] += a.matrix[i][k] * b.matrix[k][j];
        }
      }
    }
    return ans;
  }
  public mul(a: Matrix): Matrix {
    if (a.col !== this.row) throw 'dimension not match';
    const ans = Matrix.zeros(a.row, this.col);
    for (let i = 0; i < a.row; i++) {
      for (let j = 0; j < this.col; j++) {
        for (let k = 0; k < a.col; k++) {
          ans.matrix[i][j] += a.matrix[i][k] * this.matrix[k][j];
        }
      }
    }
    this.matrix = ans.matrix;
    return this;
  }
  public scaled(scalar: number): Matrix {
    const ans = this.copy();
    for (let i = 0; i < ans.row; i++) {
      for (let j = 0; j < ans.col; j++) {
        ans.matrix[i][j] *= scalar;
      }
    }
    return ans;
  }
  public scale(scalar: number): Matrix {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        this.matrix[i][j] *= scalar;
      }
    }
    return this;
  }
}

export class Vector extends Matrix {
  constructor(...values: number[]) {
    super(values.map((value) => [value]));
  }
  public get x(): number {
    return this.matrix[0][0];
  }
  public get y(): number {
    return this.matrix[1][0];
  }
  public get z(): number {
    return this.matrix[2][0];
  }
  public get length(): number {
    let ans = 0;
    for (let i of this.matrix) {
      ans += i[0] * i[0];
    }
    return Math.sqrt(ans);
  }
  override copy(): Vector {
    return new Vector(...this.matrix.map((value) => value[0]));
  }
  static override add(a: Vector, b: Vector): Vector {
    return new Vector(...super.add(a, b).matrix.map((value) => value[0]));
  }
  override add(b: Vector) {
    return new Vector(...super.add(b).matrix.map((value) => value[0]));
  }
  static override sub(a: Vector, b: Vector): Vector {
    return new Vector(...super.sub(a, b).matrix.map((value) => value[0]));
  }
  override sub(b: Vector) {
    return new Vector(...super.sub(b).matrix.map((value) => value[0]));
  }
  static override mul(a: Matrix, b: Vector): Vector {
    return new Vector(...super.mul(a, b).matrix.map((value) => value[0]));
  }
  override mul(a: Matrix) {
    return new Vector(...super.mul(a).matrix.map((value) => value[0]));
  }
  override scale(scalar: number): Vector {
    super.scale(scalar);
    return this;
  }
  override scaled(scalar: number): Vector {
    const ans = this.copy();
    return ans.scale(scalar);
  }
  public normalize(): Vector {
    this.scale(1 / this.length);
    return this;
  }
  public normalized(): Vector {
    return this.scaled(1 / this.length);
  }
  public static dot(a: Vector, b: Vector): number {
    return Matrix.mul(a.transposed(), b).matrix[0][0];
  }
  public static cross(a: Vector, b: Vector): Vector {
    if (a.row !== 3 || b.row !== 3) throw 'invalid cross';
    return new Vector(
      a.y * b.z - a.z * b.y,
      a.z * b.x - a.x * b.z,
      a.x * b.y - a.y * b.x
    );
  }
}
export const { sin, cos, tan, exp, pow, log } = Math;
