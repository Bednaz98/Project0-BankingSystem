
import {Client, Account} from './Entities';
import CosmosManagerDAO from './CosmosDAOImpliment';
const com:CosmosManagerDAO = new CosmosManagerDAO()


async function TestingNameChange(){
    console.log('Try Change Account Name')
    //const ClientList:Client[]= await com.GetAllClients()
    let TempClient:Client =  await com.GetClient('9e885d70-eb37-4629-b04b-1db4c13bb6a0');//ClientList[0];
    console.log("Initial Name: "+TempClient.FirstName+"  "+ TempClient.LastName);
    TempClient = await com.ChangeClientName(TempClient.id, "Josh", "Bednaz");
    console.log("New Name: "+TempClient.FirstName+"  "+ TempClient.LastName);
}

async function TestingAccountNameChange(){
    console.log('Try Change Account Name')
    const ClientList:Client[]= await com.GetAllClients()
    let TempClient:Client =  ClientList[0];
    let TempAccount:Account = TempClient.Accounts[0];
    console.log(`Current Name: ${TempAccount.AccountName}`)
    TempClient = await com.ChangeClientAccountName(TempClient.id, 0,"NewAccountName" )
    TempAccount = TempClient.Accounts[0];
    console.log(`New Name: ${TempAccount.AccountName}`)
}

async function TestingAccountDepsoite(){
    console.log('Try Deposite')
    const ClientList:Client[]= await com.GetAllClients()
    let TempClient:Client =  ClientList[0];
    let TempAccount:Account = TempClient.Accounts[0];
    console.log(`Current Account Balance: ${TempAccount.Amount}`)
    TempClient = await com.Despoite(TempClient.id, 0, 100);
    TempAccount = TempClient.Accounts[0];
    console.log(`NewAccount Balance: ${TempAccount.Amount}`)
}

async function TestingAccountWithdraw(){
    console.log('Try Withdraw')
    const ClientList:Client[]= await com.GetAllClients()
    let TempClient:Client =  ClientList[0];
    let TempAccount:Account = TempClient.Accounts[0];
    console.log(`Current Account Balance: ${TempAccount.Amount}`)
    TempClient = await com.Withdraw(TempClient.id, 0, 100);
    TempAccount = TempClient.Accounts[0];
    console.log(`NewAccount Balance: ${TempAccount.Amount}`)
}

TestingNameChange()