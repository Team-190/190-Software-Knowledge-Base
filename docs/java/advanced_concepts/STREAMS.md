import useBaseUrl from '@docusaurus/useBaseUrl';

# Streams

A stream is a sequence of elements from a collection that supports processing data in
a declarative, chainable way. Rather than manually writing a loop to filter, transform,
and collect data, the Stream API lets you describe *what* you want done, and Java
handles *how* it gets done. For more information about the collections streams operate
on, see the Data Structures section.

<img
src={useBaseUrl("img/images/javaadvanced/water-stream.gif")}
alt="water-stream"
/>

## Creating a Stream

A stream is created by calling `.stream()` on a collection. Creating a stream doesn't
modify the original collection; it just opens a pipeline for processing its elements.

```java
ArrayList<Integer> canIds = new ArrayList<Integer>();
canIds.add(3);
canIds.add(7);
canIds.add(12);

canIds.stream(); // Creates a stream over the ArrayList's elements
```

## Intermediate Operations

Intermediate operations transform a stream into another stream, and can be chained
together. They aren't actually executed until a terminal operation is called.

### filter()

Keeps only the elements that match a given condition, provided as a lambda. For more
information about lambda expressions, see the Lambda Expressions section.

```java
canIds.stream()
      .filter(id -> id > 5); // Keeps only 7 and 12
```

### map()

Transforms each element into something else, such as converting a list of CAN IDs
into a list of their corresponding motor names.

```java
canIds.stream()
      .map(id -> "Motor " + id); // Transforms each int into a String
```

## Terminal Operations

Terminal operations end the stream pipeline and produce a result, such as a value, a
collection, or a side effect.

| Method            | Description                                    |
|-------------------|--------------------------------------------------|
| `forEach()`       | Performs an action on each element                |
| `count()`         | Returns the number of elements                     |
| `collect()`       | Gathers the results back into a collection          |

```java
canIds.stream()
      .filter(id -> id > 5)
      .forEach(id -> System.out.println(id));
```

Output:
```text
7
12
```

## Chaining It All Together

The real value of streams comes from chaining multiple operations into a single
readable pipeline, instead of nesting loops and if-statements.

```java
ArrayList<Integer> highCanIds = canIds.stream()
      .filter(id -> id > 5)
      .collect(Collectors.toList());
```

This reads almost like a sentence: "take the CAN IDs, filter for the ones greater
than 5, and collect them into a list." Streams are best suited for straightforward
data transformations; for more complex or performance-critical logic, a traditional
loop (see the Loops section) is often clearer.
