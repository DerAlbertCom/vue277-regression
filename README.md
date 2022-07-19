# Compiletime Regression in Vue 2.7.7

With Vue 2.7.7 I get an error like this on `npm run serve`

```
 DONE  Compiled successfully in 1727ms                                                                       


  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.6.80:8080/

  Note that the development build is not optimized.
  To create a production build, run npm run build.

Issues checking in progress...
RangeError: Maximum call stack size exceeded
RangeError: Maximum call stack size exceeded
    at unwrapNondistributiveConditionalTuple (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:62529:85)
    at _loop_18 (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:62542:49)
    at getConditionalType (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:62656:31)
    at getConditionalTypeInstantiation (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:63621:25)
    at instantiateTypeWorker (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:63698:24)
    at instantiateTypeWithAlias (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:63646:26)
    at instantiateType (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:63629:37)
    at getTypeOfInstantiatedSymbol (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:56830:48)
    at getTypeOfSymbol (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:56897:24)
    at compareProperties (/Users/aweinert/src/private/vuejs-problem/the277/node_modules/typescript/lib/typescript.js:67273:33)

```

on `npm run test:unit` this happens

```
 PASS  tests/unit/example.spec.ts
 FAIL  tests/unit/ComponentContext.spec.ts
  ● Test suite failed to run

    RangeError: Maximum call stack size exceeded

      at getObjectTypeInstantiation (node_modules/typescript/lib/typescript.js:63402:44)
      at instantiateTypeWorker (node_modules/typescript/lib/typescript.js:63666:28)
      at instantiateTypeWithAlias (node_modules/typescript/lib/typescript.js:63646:26)
      at instantiateType (node_modules/typescript/lib/typescript.js:63629:37)
      at instantiateList (node_modules/typescript/lib/typescript.js:63257:34)
      at instantiateTypes (node_modules/typescript/lib/typescript.js:63271:20)
      at instantiateTypeWorker (node_modules/typescript/lib/typescript.js:63660:48)
      at instantiateTypeWithAlias (node_modules/typescript/lib/typescript.js:63646:26)
      at instantiateType (node_modules/typescript/lib/typescript.js:63629:37)
      at getMappedType (node_modules/typescript/lib/typescript.js:63300:91)
      at node_modules/typescript/lib/typescript.js:63432:82
      at Object.map (node_modules/typescript/lib/typescript.js:638:29)
      at getObjectTypeInstantiation (node_modules/typescript/lib/typescript.js:63432:40)
      at instantiateTypeWorker (node_modules/typescript/lib/typescript.js:63666:28)
      at instantiateTypeWithAlias (node_modules/typescript/lib/typescript.js:63646:26)
      at instantiateType (node_modules/typescript/lib/typescript.js:63629:37)

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        5.039 s
```

Both works with Vue 2.7.6. 

## Reproduction

Clone this repository


Switching to the Working branch

`git switch vue276`

Clearing node_modules, install node_modules and clearing jest cache
`./clear-npm.sh`

`npm run serve` no problem

`npm run test:unit` also no problem

For testing with vue 2.7.7

`git switch vue277`

Clearing node_modules, install node_modules and clearing jest cache

`./clear-npm.sh`

`npm run serve` see error above

`npm run test:unit` see error above

## Notes

I disabled webpack cache in the repro, also clearing jest cache.

This is the simplest reproduction I could find. In the real application `npm run serve` does not even compile starts 
the application it stops at 51% with a call stack size exceeded message. But the Unit Test are running.

In the vue276 branch I added the vue-template-compiler package in version 2.7.6 to force the version.











