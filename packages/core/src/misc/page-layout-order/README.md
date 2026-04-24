## Example with 3 pages

```js
const layouts = getPageLayoutOrder(3)

// The number of papers needed:
console.log(layouts.length) // 1

// The complete layout
console.table(layouts)
// ┌─────────┬──────────┬──────────┐
// │ (index) │ 0        │ 1        │
// ├─────────┼──────────┼──────────┤
// │ 0       │ [ 4, 1 ] │ [ 2, 3 ] │
// └─────────┴──────────┴──────────┘

```

Further visualization:

```
┌───────┬───────────────┬───────────────┐
│       │     Front     │      Back     │
│ Paper ├───────┬───────┼───────┬───────┤
│       │   L   │   R   │   L   │   R   │
├───────┼───────┼───────┼───────┼───────┤
│     1 │     4 │     1 │     2 │     3 │
└───────┴───────┴───────┴───────┴───────┘
```

```
     Front
           1   
-------•-------     <- Paper
   3       2
     Back
```

## Example with 8 pages

```js
const layouts = getPageLayoutOrder(3)

// The number of papers needed:
console.log(layouts.length) // 1

// The complete layout
console.table(layouts)
// ┌─────────┬──────────┬──────────┐
// │ (index) │ 0        │ 1        │
// ├─────────┼──────────┼──────────┤
// │ 0       │ [ 8, 1 ] │ [ 2, 7 ] │
// │ 1       │ [ 6, 3 ] │ [ 4, 5 ] │
// └─────────┴──────────┴──────────┘
```

Further visualization:

```
┌───────┬───────────────┬───────────────┐
│       │     Front     │      Back     │
│ Paper ├───────┬───────┼───────┬───────┤
│       │   L   │   R   │   L   │   R   │
├───────┼───────┼───────┼───────┼───────┤
│     1 │     8 │     1 │     2 │     7 │
│     2 │     6 │     3 │     4 │     5 │
└───────┴───────┴───────┴───────┴───────┘
```

```
     Front
   8       1   
-------•-------     <- Paper 1
   7       2
     Back

     Front
   6       3   
-------•-------     <- Paper 2
   5       4
     Back
```
