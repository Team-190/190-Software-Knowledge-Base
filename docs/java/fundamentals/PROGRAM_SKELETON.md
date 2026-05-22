import useBaseUrl from '@docusaurus/useBaseUrl';

# Java Program Skeleton

When you first look at a Java program, you might notice that every file seems to follow a very similar structure. Why would every program need the same basic layout?

Computers need programs to be organized in a predictable way so they know where to begin executing code. This structure is known as the Java program skeleton, and it acts as the foundation that every Java application is built upon.

The Java program skeleton is as follows:

```
public class Main {
    public static void main(String[] args) {
        // Program code goes here
    }
}
```

Java standardizes an entry point where all programs written in the language start. This is the main method:
```public static void main(String[] args) {}```. As far as the skeleton goes, this is the entry for all Java programs. For more information about methods and classes, see the section about object oriented programming.

<img
src={useBaseUrl("img/images/javafundamentals/fireship-java-java.gif")}
alt="chrisevans"
/>