import useBaseUrl from '@docusaurus/useBaseUrl';

# LinkedList

An array (and `ArrayList`) stores its elements in one contiguous block of memory,
back to back. A `LinkedList` takes a completely different approach: instead of one
block of memory, it stores each element in its own small object, called a **node**,
and each node holds a reference (a "link") to the next node in the list.

<img
src={useBaseUrl("img/images/javadatastructures/dog-conga-line.gif")}
alt="dog-conga-line"
/>

Think of it like a conga line: each node only knows about the node directly behind
it, but following the chain from node to node gets you through the entire list.

## Creating a LinkedList

Java's `LinkedList` class lives in the `java.util` package, just like `ArrayList`,
and implements the same `List` interface. This means it supports all the same core
methods, `add()`, `get()`, `remove()`, `size()`, and so on, with the same generic
syntax used by `ArrayList`.

```
import java.util.LinkedList;

LinkedList<Integer> autonWaypoints = new LinkedList<Integer>();

autonWaypoints.add(1);
autonWaypoints.add(2);
autonWaypoints.add(3);
```

For more information about interfaces, see the Object-Oriented Programming section.

## ArrayList vs. LinkedList

Since they both implement the `List` interface, `ArrayList` and `LinkedList` are
mostly interchangeable in terms of what code you write to use them. The difference is
in how they perform:

- **ArrayList**: Fast at accessing a random element by index (`get(i)`), since it's
  backed by a contiguous block of memory. Slower at inserting or removing elements
  from the middle of the list, since every following element has to shift over.
- **LinkedList**: Fast at inserting or removing elements, since it just has to update
  a couple of links. Slower at accessing a random element by index, since it has to
  walk the chain of nodes from the beginning (or end) to get there.

In practice, `ArrayList` is used far more often, since most FRC code reads elements
more often than it inserts or removes them in the middle of a list. `LinkedList`
becomes useful when your code is constantly adding and removing elements, such as a
queue of commands waiting to run. For more on that use case, see the Stacks and
Queues section.
