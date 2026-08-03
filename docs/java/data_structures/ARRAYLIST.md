import useBaseUrl from '@docusaurus/useBaseUrl';

# ArrayList

Arrays are fast, but they have one major limitation: their size is fixed the moment
they're created. If you don't know ahead of time how many elements you'll need, for
example, how many game pieces get scored during a match, an array isn't flexible
enough. This is where `ArrayList` comes in.

<img
src={useBaseUrl("img/images/javadatastructures/growing-slime.gif")}
alt="growing-slime"
/>

An `ArrayList` is a resizable array, provided by Java as part of the `java.util`
package. It automatically grows and shrinks as elements are added and removed.

```java
import java.util.ArrayList;
```

For more information about imports and packages, see the Object-Oriented Programming
section.

## Creating an ArrayList

### ArrayList Formula

The general formula for creating an `ArrayList` is:

```java
ArrayList<[wrapper type]> [list name] = new ArrayList<[wrapper type]>();
```

```java
ArrayList<Integer> scoredPieces = new ArrayList<Integer>();
```

### Generics and Wrapper Types

The `<Integer>` part is called a **generic type parameter**, and it tells Java what
type of object the `ArrayList` will hold. Notice that this is `Integer`, not `int`.
`ArrayList` (and most of Java's built-in collections) can only hold objects, not
primitives, so primitive types are automatically converted to their **wrapper type**
equivalent, a process called **autoboxing**.

| Primitive | Wrapper Type |
|-----------|---------------|
| `int`     | `Integer`     |
| `double`  | `Double`      |
| `boolean` | `Boolean`     |
| `char`    | `Character`   |

Generics are covered in much more detail in the Advanced Concepts section, but for
now, just know that the type inside the angle brackets tells Java what the list is
allowed to hold.

## Common Methods

| Method            | Description                                      |
|--------------------|---------------------------------------------------|
| `add(value)`       | Adds a value to the end of the list                |
| `get(index)`       | Returns the value at the given index               |
| `set(index, value)`| Replaces the value at the given index              |
| `remove(index)`    | Removes the value at the given index               |
| `size()`           | Returns the number of elements in the list         |
| `contains(value)`  | Returns `true` if the list contains the value      |

<details>
<summary>Show code</summary>

```java
ArrayList<Integer> scoredPieces = new ArrayList<Integer>();

scoredPieces.add(1);
scoredPieces.add(2);
scoredPieces.add(3);

System.out.println(scoredPieces.get(0)); // Prints 1
System.out.println(scoredPieces.size()); // Prints 3

scoredPieces.remove(0);

System.out.println(scoredPieces.size()); // Prints 2
```
</details>

Unlike arrays, trying to `get()` or `set()` an index that's out of bounds still throws
an exception, `ArrayList` just prevents that boundary from being fixed in place.

## ArrayList vs. Array

| | Array | ArrayList |
|---|---|---|
| Size | Fixed | Resizable |
| Holds | Primitives or objects | Objects only (via autoboxing) |
| Access syntax | `arr[i]` | `list.get(i)` |

If you know exactly how many elements you need ahead of time and that number won't
change, an array is simpler and slightly more efficient. If the number of elements
changes while the program runs, `ArrayList` is almost always the better choice.
