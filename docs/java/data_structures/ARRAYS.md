import useBaseUrl from '@docusaurus/useBaseUrl';

# Arrays

An array is a fixed-size collection of values that are all the same data type, stored
together in a single block of memory. Instead of creating a separate variable for
every value you need, an array lets you group them all under one name.

```java
int[] canIDs = { 1, 2, 3, 4 };
```

Here, `canIDs` holds four `int` values, one for each motor's CAN ID on a drivetrain.

## Creating an Array

### Array Formula

The general formula for creating an array is:

```java
[data type][] [array name] = new [data type][size];
```

Arrays can be created empty, with a specific size, and filled in later:

```java
int[] canIDs = new int[4]; // Creates an array that can hold 4 ints, all initialized to 0
canIDs[0] = 1;
canIDs[1] = 2;
canIDs[2] = 3;
canIDs[3] = 4;
```

Or they can be declared and filled all at once using an array literal:

```java
int[] canIDs = { 1, 2, 3, 4 };
```

Once an array is created, its size is locked in. You cannot add a fifth element to
`canIDs` later without creating a brand new array. For a collection that can grow and
shrink, see the ArrayList section.

## Indexing

Each value in an array is accessed using its **index**, which is its position in the
array. Java arrays are **zero-indexed**, meaning the first element is at index `0`,
not `1`.

```java
int[] canIDs = { 1, 2, 3, 4 };

System.out.println(canIDs[0]); // Prints 1
System.out.println(canIDs[3]); // Prints 4
```

<img
src={useBaseUrl("img/images/javadatastructures/arrays.png")}
alt="arrays"
/>

### Out of Bounds

Trying to access an index that doesn't exist, either negative or beyond the array's
last valid index, throws an `ArrayIndexOutOfBoundsException` at runtime.

```java
int[] canIDs = { 1, 2, 3, 4 };

System.out.println(canIDs[4]); // Throws ArrayIndexOutOfBoundsException
```

Since `canIDs` has 4 elements, its valid indices are `0` through `3`. Index `4` is one
past the end of the array, this is a very common mistake known as an **off-by-one
error**.

## The length Field

Every array has a `length` field that tells you how many elements it can hold. Note
that this is a field, not a method, so it's accessed without parentheses.

```java
int[] canIDs = { 1, 2, 3, 4 };

System.out.println(canIDs.length); // Prints 4
```

`length` is especially useful for looping through every element of an array without
hard-coding the number of elements. For more information about loops, see the Control
Flow section.

```java
int[] canIDs = { 1, 2, 3, 4 };

for (int i = 0; i < canIDs.length; i++) {
  System.out.println(canIDs[i]);
}
```

## Multi-Dimensional Arrays

Arrays can also hold other arrays, creating a grid-like, multi-dimensional structure.
A common use case is representing a 2D grid of positions on the field.

```java
int[][] fieldGrid = {
  { 0, 0, 0 },
  { 0, 1, 0 },
  { 0, 0, 0 }
};

System.out.println(fieldGrid[1][1]); // Prints 1
```

Here, `fieldGrid` is an array of `int[]` arrays. The first index selects the row, and
the second index selects the column within that row.
