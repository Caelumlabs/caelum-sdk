# Playground

First you need to setup the basic token for an Ecosystem

```bash
cp .env.example .env
export DEBUG="did:*"
```

Edit .env and change the name of the token and the organization you want to register.

## Setup -> let's create the Basic token for the ecosystem.
```bash
node 1.setup.js
```

## Init ORG -> Regsiter the first organization
```bash
node 2.check.js
```

## Root
If you are the root of an ecosystem (or in devel mode). You need to 
1. Setup The Token : returns the new seed for the admin of the token (minter).
2. Add yout first Trusted Organization
3. Update the fields : taxId and legalName
4. Send tokens to the TO.
