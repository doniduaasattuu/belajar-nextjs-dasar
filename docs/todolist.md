# Todolist API Spec

## Get All Todolist

Endpoint: GET /api/todolists

Request Header:

- X-API-TOKEN: token

Response Body (Success) :

```json
{
  "data": [
    {
      "username": "doni",
      "todo": "Belajar NextJS Dasar"
    },
    {
      "username": "doni",
      "todo": "Belajar NextJS RESTful API"
    }
  ]
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Create Todolist

Endpoint: POST /api/todolists

Request Header :

- X-API-TOKEN : token

Request Body:

```json
{
  "username": "doni",
  "todo": "Belajar NextJS Dasar"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "doni",
    "todo": "Belajar NextJS Dasar"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Todo cannot be duplicated, ..."
}
```

# Update Todolist

Endpoint: PATCH /api/todolists/[todolistId]

Request Header:

- X-API-TOKEN: token

Request Body:

```json
{
  "username": "doni",
  "todo": "Belajar NextJS Dasar"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "doni",
    "todo": "Belajar NextJS Dasar"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Todo cannot be duplicated, ..."
}
```

# Delete Todolist

Endpoint: DELETE /api/todolists/[todolistId]

Response Body (Success) :

```json
{
  "data": {
    "success": true
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Todo is not found, ..."
}
```
