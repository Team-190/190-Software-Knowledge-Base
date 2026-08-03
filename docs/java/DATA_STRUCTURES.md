import useBaseUrl from '@docusaurus/useBaseUrl';

# 🗄️ Data Structures

A data structure is simply a way of organizing data in memory so that it can be
accessed and modified efficiently. So far, working with individual variables has been
enough, but real programs usually need to work with *collections* of data: every
motor's CAN ID on a mechanism, every waypoint in an autonomous path, every team
scouted at competition.

<img
src={useBaseUrl("img/images/javadatastructures/drawers.gif")}
alt="drawers"
/>

Java provides many different ways to store a collection, and each one makes different
trade-offs between speed, memory, and how the data is organized. Picking the right
data structure for the job is one of the most important skills in writing efficient,
readable code, using the wrong one can turn a simple operation into a slow or
error-prone mess.

This section covers Java's core data structures, starting with the fixed-size array,
moving through resizable and linked lists, restricted-access stacks and queues, and
finishing with key-based lookups using `HashMap` and `HashSet`, along with the tools
Java provides for iterating through all of them.
