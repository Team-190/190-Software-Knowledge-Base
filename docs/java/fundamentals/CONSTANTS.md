import useBaseUrl from '@docusaurus/useBaseUrl';

# Constants

A constant is a variable that's value cannot be changed once it is assigned. It's
basically a value that is "set in stone" and cannot be modified while the code is
running. 

<img
src={useBaseUrl("img/images/javafundamentals/constant-dino.jpeg")}
alt="constant-dino"
/>

### Why use Constants?

Constants are used to prevent hard-coding values. For example, imagine having a 
gear ratio hard coded in 20 different places across your codebase. Then, if you 
need to change the gear ratio, you need to change it 20 different times. 
That's why constants are used: to "hard code" values, but only in one spot.
Using a constant instead a regular variable also prevents accidentally changing 
the value. 

## Creating a Constant

Constants in java are created by using the `final` keyword.

### Constant Formula

The general formula for creating a constant is:

```
final [data type] [constant name] = [value];
```

<img
src={useBaseUrl("img/images/javafundamentals/constant-java.png")}
alt="constant-java"
width="400"
/>

### More Keywords

Typically, constants are also created with the `static` keyword, so that they can be accessed
globally without needing to create an "instance" of the class every time. 

For example,
you can access `Math.PI` without writing `Math math1 = new Math();` first.

For more information about keywords and variable scope, see the object oriented
programming section. 

### Naming Conventions

- Constants should be written in uppercase with words separated by underscores: `ROLLER_SLOW_VOLTAGE` instead of `rollerSlowVoltage`
- Constants should have units in the name: `MAX_VELOCITY_METERS_PER_SECOND` instead of `MAX_VELOCITY`