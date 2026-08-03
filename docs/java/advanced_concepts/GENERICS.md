import useBaseUrl from '@docusaurus/useBaseUrl';

# Generics

You've already used generics informally throughout the Data Structures section, every
time you wrote something like `ArrayList<Integer>`. Generics allow a class or method
to operate on a type that is specified later, when the class or method is actually
used, instead of being locked into one specific type.

<img
src={useBaseUrl("img/images/javaadvanced/mad-libs.gif")}
alt="mad-libs"
/>

Think of a generic class like a Mad Libs template: the structure is written once,
with a placeholder (`T`) left blank, and the actual type only gets filled in later
when the class is used.

## Why Generics?

Before generics existed, collections like `ArrayList` stored everything as a generic
`Object`, meaning you had to manually cast values back to their real type every time
you retrieved them.

```java
ArrayList list = new ArrayList(); // Raw type, no generics
list.add("hello");

String value = (String) list.get(0); // Manual cast required
```

This was risky, since nothing stopped you from accidentally adding the wrong type of
data into the list, which would only fail at runtime when the cast happened. Generics
solve this by letting the compiler check types ahead of time.

```java
ArrayList<String> list = new ArrayList<String>();
list.add("hello");

String value = list.get(0); // No cast needed, and adding an int would be a compile error
```

## Generic Type Parameters

A generic type parameter is a placeholder for a type, conventionally written as a
single uppercase letter such as `T` (type), `E` (element), or `K`/`V` (key/value).

### Generic Class Formula

```java
public class [ClassName]<T> {
    [fields and methods using T]
}
```

<details>
<summary>Show code</summary>

```java
public class Pair<T> {
    private T first;
    private T second;

    public Pair(T first, T second) {
        this.first = first;
        this.second = second;
    }

    public T getFirst() {
        return first;
    }
}
```
</details>

```java
Pair<Integer> canIds = new Pair<Integer>(3, 7);
int firstCanId = canIds.getFirst(); // Equal to 3
```

Here, `T` acts as a stand-in for whatever type is provided when the `Pair` is created.
For more information about classes, see the Object-Oriented Programming section.

## Generic Methods

Individual methods can also be generic, even inside a non-generic class. The type
parameter is declared right before the return type.

```java
public static <T> T getLast(ArrayList<T> list) {
    return list.get(list.size() - 1);
}
```

```java
ArrayList<String> names = new ArrayList<String>();
names.add("Gompei");

String lastName = getLast(names); // Works for any type of ArrayList
```

## Bounded Type Parameters

Sometimes you want to restrict a generic type to only accept certain kinds of types,
such as only numbers. This is done using the `extends` keyword, even when the bound
is an interface.

```java
public static double sum(ArrayList<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) {
        total += n.doubleValue();
    }
    return total;
}
```

Here, `<? extends Number>` means the list can hold `Integer`, `Double`, or any other
subclass of `Number`, but not something unrelated like `String`. For more information
about `extends` and subclasses, see the Inheritance section.

## Generics vs. Casting

The whole point of generics is to move type errors from runtime to compile time. Code
that relies on manual casting can compile successfully and still crash while the
robot is running. Code that relies on generics won't even compile if the types don't
match, catching mistakes long before they reach the field.
