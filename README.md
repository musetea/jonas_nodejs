#

### Bcrypt

```
    npm i bcrypt
    npm i -D @types/bcrypt
```

### Json Web Token

```sh
    npm i jsonwebtoken
    npm i -D  @types/jsonwebtoken
```

```

    0) Https only
    1) Client : /login (email, password)
    2) Server : if(user) -> Create unique JWT
    3) Server : JWT ->
    4) Client : Store JWT (cookie or localStorage)
    //
    5) Clinet : Get /get ->
    6) Server : if(valid JWT) -> Allow access
    7) Server : DATA ->
```

### Email

```sh
    npm i nodemailer        # "^6.9.1",
    npm i @types/nodemailer # "^6.4.7"

```

### 보안

1. compromised database

- bcrypt : Strongly encrypt passwords with salt and hash.
- sha256 : Strongly encrypt password reset tokens

2. brute force attacks

- bcrypt : to make login reqeust slow
- express-rate-limit : 접속제한
- login attempts : 로그인 최대 횟수 제한

3. cross-site scripting(xss) attacks

- JWT in HTTPOnly cookies : 쿠키활용,
- Sanitize user input data
- Set special HTTP headers (helmet package)

4. denial-of-service (DOS) attack

- `express-rate-limit`
- `body-parser` limit payload : 사이즈 제한
- avoid evil regular expression

- 5. nosql query injection
- use mongoose for MongoDB (schema Types)
- sanitize user input data

- 6. other best pracices and suggestions
- use `https`
- create random password reset tokens with expiry dates
- dney access to jwt after password chage.
- don't commit sensitive cnfig data to git
- don't send error details to clients
- prevent cross-site request forgery (`csurf package`)
- require re-authenticaton before a high-value action
- blacklist of untrusted JWT.
- confirm user email address after first creating account.
- keep user logged in with refersh tokens
- tow-factor authentication
- prevent parameter pollution causing uncaugth exception.
