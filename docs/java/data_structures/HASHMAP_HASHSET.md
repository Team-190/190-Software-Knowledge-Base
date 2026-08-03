import useBaseUrl from '@docusaurus/useBaseUrl';

# HashMap and HashSet

So far, every data structure covered has organized its elements by position: index
`0`, index `1`, and so on. `HashMap` and `HashSet` instead organize elements based on
their **value**, which makes looking things up by a meaningful identifier extremely
fast.

<img
src={useBaseUrl("img/images/javadatastructures/hashmap.png")}
alt="hashmap"
/>

## HashMap

A `HashMap` stores **key-value pairs**. Instead of looking something up by its
position, you look it up by its key, similar to looking up a word in a dictionary.

### HashMap Formula

```java
HashMap<[key type], [value type]> [map name] = new HashMap<[key type], [value type]>();
```

```java
import java.util.HashMap;

HashMap<String, Integer> subsystemCANIDs = new HashMap<String, Integer>();

subsystemCANIDs.put("Elevator", 5);
subsystemCANIDs.put("Intake", 12);

System.out.println(subsystemCANIDs.get("Elevator")); // Prints 5
```

| Method                | Description                                       |
|------------------------|-----------------------------------------------------|
| `put(key, value)`      | Adds a key-value pair, or updates an existing key    |
| `get(key)`             | Returns the value associated with the key           |
| `containsKey(key)`     | Returns `true` if the map contains the key          |
| `remove(key)`          | Removes the key-value pair associated with the key  |

Every key in a `HashMap` must be unique. Calling `put()` with a key that already
exists overwrites its previous value rather than adding a duplicate entry.

## HashSet

A `HashSet` is similar to a `HashMap`, but it only stores values, no keys, and every
value is guaranteed to be unique. It's useful whenever you need to keep track of a
collection of items and quickly check whether something has already been seen.

```java
import java.util.HashSet;

HashSet<Integer> scoutedTeamNumbers = new HashSet<Integer>();

scoutedTeamNumbers.add(190);
scoutedTeamNumbers.add(190); // Ignored, 190 is already in the set

System.out.println(scoutedTeamNumbers.size()); // Prints 1
System.out.println(scoutedTeamNumbers.contains(190)); // Prints true
```

Unlike a `List`, a `HashSet` doesn't preserve the order elements were added in, and
doesn't allow you to access an element by index.

## Why Hashing Is Fast

Both `HashMap` and `HashSet` get their name (and their speed) from **hashing**. When
you add a key (or a value, for a `HashSet`), Java runs it through a hash function that
converts it into a number, which determines exactly where in memory that entry gets
stored. This means that looking something up doesn't require checking every single
element like a `List` would, Java can jump almost directly to where the entry lives.
This is what makes `containsKey()` and `get()` so much faster than searching through
a `List` for the same information.
