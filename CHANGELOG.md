# Changelog

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
