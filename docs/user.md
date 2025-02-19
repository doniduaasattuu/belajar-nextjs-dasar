# User API Spec

## Register User

Endpoint: POST /api/users

Request Body:

```json
{
  "username": "doni",
  "password": "rahasia",
  "name": "Doni Darmawan"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "doni",
    "name": "Doni Darmawan"
  }
}
```

Response Body (Failed) :

```json
{
  "error": "Username already been taken, ..."
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "doni",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "doni",
    "name": "Doni Darmawan",
    "token": "uuid"
  }
}
```

## Get User

Endpoint : GET /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": {
    "username": "doni",
    "name": "Doni Darmawan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Update User

Endpoint : PATCH /api/users/current

Request Header :

- X-API-TOKEN : token

Request Body :

```json
{
  "password": "password", // tidak wajib
  "name": "Doni Darmawan" // tidak wajib
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "doni",
    "name": "Doni Darmawan"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```

## Logout User

Endpoint : DELETE /api/users/current

Request Header :

- X-API-TOKEN : token

Response Body (Success) :

```json
{
  "data": "OK"
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized, ..."
}
```
