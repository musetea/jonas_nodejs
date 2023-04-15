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

#### 서버에서 쿠키전송

```ts
// 쿠키옵션
const CookieOptions = {
	expires: new Date(Date.now() + +JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
	secure: false, // HTTPS
	httpOnly: true,
};
// jwt 토큰생성
const signToken = (id: string) => {
	return sign(
		{
			id: id,
		},
		JWT_SECRET,
		{
			expiresIn: JWT_EXPIRES_IN,
		}
	);
};
// 쿠키를 만들어서 전송(브라우저에서 자동관리 )
const token = signToken(id);
res.cookie("jwt", token, CookieOptions);
```

#### RATE LIMITER

```sh
    npm i express-rate-limit

```

#### HELMET

```sh
    npm i helmet
    npm install @types/helmet --save-dev
```

#### NOSQL INJECTION

```sh
    # "^2.2.0"
    npm i express-mongo-sanitize  # @types 포함
```

#### XSS

TODO:타입스크립트에서 사용 방법 찾기

```sh
    npm i xss
    npm i xss-clean
```

#### HPP

```sh
    npm i hpp
    npm i --save-dev @types/hpp
```

### 모델링

- 데이터모델링

1. Different types of relationships between data

- 1:1, 1:M, M:M

2. referencing/normalizatin & embedding/denormalization
3. embedding or referecing other document
4. types of referencing

#### 몽구스

- `Population` 는 문서의 경로를 다른 컬렉션의 실제 문서로 자동으로 바꾸는 방법

#### Express

- 계층적 구조의 라우터를 사용할 때,
  라우터의 선언 시 Router({ mergeParams: true }) 를 사용해야,
  이전 라우터에서 전달된 path parameter를 사용할 수 있다

#### 인증 과 권한

-
