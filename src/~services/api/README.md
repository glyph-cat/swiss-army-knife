## Naming conventions for interfaces
* Prefer non-serialized as much as possible, only use when date/time types are involved.

### `API...Params`
* Used by client as parameter type
* Also used by handler as parameter type (prefer this whenever possible)

### `API...SerializedParams`
* Used by handler as parameter type (not preferable)
* This is only for cases where date types are automatically converted into strings

### `API...ReturnData`
* Used by handler as return type
* Used by client function as return type

### `API...SerializedReturnData`
* Used by handler as return type when there are date types in the payload (which will get automatically converted into strings)
