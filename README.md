# caelum
Caelum is a mix of different technologies
- Substrate: Governance and Interoperability
- Idspace: container in the cloud with the SSI Process Manager software. One for every organization.

One ecosystem has these elements

- Governor
- Trust Agents
- Organizations

## Governor
It’s the root of Authority in the ecosystem. It’s designed to disappear in time when the ecosystem grows to be replaced by community governance.

## Trust Agents
Nodes in the ecosystem with an Idspace. They are organizations with the capacity to add more organizations to the ecosystem.

## Organizations
Nodes in the ecosystem with an Idspace. They are organizations with our Caelum interoperable process manager.
It is also possible to create pools of Organizations inside one Idspace.

# Create our first organization
When an idspace for one organization it’s deployed it will add a basic DID information to Substrate.
- Basic Information : legalName and TaxID.
- Additional Information: address, certificates accepted...
- Certificates: Certificates issuable by this organization.
- Hashes: Integrity for documents, workflows and certificates.

```javascript
const Caelum = require("caelum-sdk");
const caelum = new Caelum('ws://localhost:9944/');
await caelum.connect();
```
