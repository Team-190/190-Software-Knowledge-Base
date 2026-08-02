import useBaseUrl from '@docusaurus/useBaseUrl';

# Iteration

Now that you know several different ways to store a collection of data, the next
question is: how do you visit every element inside one? This process is called
**iteration**, and Java offers a few different tools for it.

<img
src={useBaseUrl("img/images/javadatastructures/iterator.webp")}
alt="iterator"
/>

## The Enhanced For-Loop

The enhanced for-loop (sometimes called a "for-each" loop) was briefly introduced in
the Control Flow section, but now that you have real collections to work with, it's
worth revisiting. It automatically walks through every element of an array or
collection, without needing to manually track an index.

```
ArrayList<Integer> scoredPieces = new ArrayList<Integer>();
scoredPieces.add(1);
scoredPieces.add(2);
scoredPieces.add(3);

for (int piece : scoredPieces) {
  System.out.println(piece);
}
```

This works for arrays, `ArrayList`, `LinkedList`, `HashSet`, and just about every
other collection type in Java.

## The Iterator Interface

The enhanced for-loop is convenient, but it has one major limitation: you can't
safely add or remove elements from a collection while iterating over it with a
for-each loop. Doing so throws a `ConcurrentModificationException`.

```
ArrayList<Integer> scoredPieces = new ArrayList<Integer>();
scoredPieces.add(1);
scoredPieces.add(2);
scoredPieces.add(3);

for (int piece : scoredPieces) {
  if (piece == 2) {
    scoredPieces.remove(Integer.valueOf(2)); // Throws ConcurrentModificationException
  }
}
```

To safely remove elements while iterating, Java provides the `Iterator` interface,
which gives you direct, manual control over the traversal.

### Iterator Formula

```
Iterator<[type]> [iterator name] = [collection name].iterator();
```

```
import java.util.Iterator;

ArrayList<Integer> scoredPieces = new ArrayList<Integer>();
scoredPieces.add(1);
scoredPieces.add(2);
scoredPieces.add(3);

Iterator<Integer> iterator = scoredPieces.iterator();

while (iterator.hasNext()) {
  int piece = iterator.next();
  if (piece == 2) {
    iterator.remove(); // Safely removes the current element
  }
}
```

| Method       | Description                                         |
|--------------|--------------------------------------------------------|
| `hasNext()`  | Returns `true` if there are more elements to visit      |
| `next()`     | Returns the next element and advances the iterator      |
| `remove()`   | Safely removes the last element returned by `next()`    |

In fact, the enhanced for-loop is really just a shorthand for exactly this pattern,
Java automatically creates an `Iterator` behind the scenes and calls `hasNext()` and
`next()` for you. Understanding `Iterator` helps explain why the for-each loop has the
limitations it does, and gives you an escape hatch for the cases where those
limitations get in the way.
