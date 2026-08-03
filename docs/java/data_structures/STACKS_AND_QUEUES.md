import useBaseUrl from '@docusaurus/useBaseUrl';

# Stacks and Queues

Stacks and queues are two data structures that restrict *how* you're allowed to add
and remove elements. Instead of accessing any index you want, you can only add or
remove elements from specific ends, which makes them perfect for problems that
naturally involve an ordered sequence of steps.

## Stacks

A stack works like a stack of pancakes: the last one you place on top is the first
one you take off. This behavior is called **LIFO**, Last In, First Out.

<img
src={useBaseUrl("img/images/javadatastructures/pancake-stack.gif")}
alt="pancake-stack"
/>

| Method     | Description                                  |
|------------|------------------------------------------------|
| `push(value)` | Adds a value to the top of the stack         |
| `pop()`       | Removes and returns the value on top of the stack |
| `peek()`      | Returns (without removing) the value on top   |

## Queues

A queue works like a line of people waiting for something: the first person to get in
line is the first person served. This behavior is called **FIFO**, First In, First
Out.

<img
src={useBaseUrl("img/images/javadatastructures/long-lines-long.webp")}
alt="long-lines-long"
/>

| Method       | Description                                    |
|--------------|--------------------------------------------------|
| `offer(value)` | Adds a value to the back of the queue            |
| `poll()`       | Removes and returns the value at the front       |
| `peek()`       | Returns (without removing) the value at the front |

An FRC-relevant example of a queue is a command scheduler: commands are often
processed in the order they were requested, with the oldest request handled first.

## Implementing Stacks and Queues in Java

Java has an older `Stack` class, but it's considered **legacy** and is generally
avoided in modern code because of some quirks in its design. Instead, both stacks and
queues are implemented using the `Deque` interface (pronounced "deck," short for
"double-ended queue") and its `ArrayDeque` implementation, which supports adding and
removing from both ends efficiently.

```
import java.util.ArrayDeque;
import java.util.Deque;

Deque<Integer> commandQueue = new ArrayDeque<Integer>();

// Using it as a queue (FIFO)
commandQueue.offer(1);
commandQueue.offer(2);
System.out.println(commandQueue.poll()); // Prints 1

// Using it as a stack (LIFO)
commandQueue.push(1);
commandQueue.push(2);
System.out.println(commandQueue.pop()); // Prints 2
```

Since `Deque` supports operations on both ends, the same object can be used as either
a stack or a queue, depending on which methods you call.
