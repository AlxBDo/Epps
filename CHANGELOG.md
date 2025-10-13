# Changelog

## [0.4.7] - 2025-10-13

Improved plugin performance and simplified setting of persistence options.

## [0.4.6] - 2025-10-12

Improved plugin performance.

## [0.4.4] - 2025-10-03

Simplification of Epps store usage: removal of type definitions.

## [0.4.3] - 2025-10-03

Actions flow history improvment

## [0.4.2] - beta feature - 2025-09-13

Create action flows: execute a function before or after an action is performed in your store.

- added actionFlows options

## [0.4.0] - Major change - 2025-09-13

The Epps class is no longer used to define store options or to access parent stores.
Options are declared as the third parameter of the defineEppsStore function.
Access to stores is no longer permitted. You can access the extended store, containing the properties and methods of parent stores, using the getEppsStore function.

- removed Epps class
- added getEppsStore function
- added actionsToRename options
- added propertiesToRename options

## [0.3.4] - 2025-08-28

You can define a custom database for a Store using the persist.dbName parameter of the Epps class.

- added Epps constructor parameter persist.dbName

## [0.3.2] - 2025-08-21

Improved the getErrors method of useErrorStore, fixed the issue of persistent data being deleted when calling the $reset method, and added tests.

## [0.3.1] - Major change - 2025-08-18

Epps options are defined by creating an instance of Epps class, and parent stores are defined by creating instances of ParentStore class.
It is easier to use a parent store in the definition of the child store.
Using the extendedState function to define Store options is deprecated.

- added class Epps
- added class ParentStore


## [0.2.2] - 2025-08-03
Added New stores: useErrorStore, useResourceIdStore and useWebUserStore


## [0.2.1] - Major change - 2025-07-07
The Epps package has no external dependencies. Now the createPlugin function accepts two parameters: 
database name and encryption key

- Remove crypto-js dependency
- Use native crypto-api


## [0.1.91] - 2025-06-10
optionApi store declaration supported
