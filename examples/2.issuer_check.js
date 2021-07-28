const Caelum = require('../src/index')
const GOVERNANCE = 'wss://substrate.tabit.caelumapp.com'
const STORAGE = 'https://api.bigchaindb.caelumapp.com/api/v1/'
const orgJson = require('./orgs/5GerGGPciAGfgmHj6zW4fDR7d4FedyX4sTCgNmbSrcenhcbg.json')
const chalk = require('chalk')
const log = console.log

const main = async () => {
  const caelum = new Caelum(STORAGE, GOVERNANCE)
  const org = await caelum.importOrganization(orgJson, 'test')
  await org.loadInformation()

  console.log('\n' + chalk.grey('Empresa : ') + chalk.cyan('Caelum Labs'))
  log(chalk.grey(' - DID  : ') + chalk.magenta(org.did))
  log(chalk.grey(' - TxID : ') + chalk.magenta(org.createTxId))
  process.exit()
}

main()
