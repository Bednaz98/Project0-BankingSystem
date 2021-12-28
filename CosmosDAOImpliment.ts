import {Client, Account} from './Entities';
import {ClientObj} from './ClassManager';
import {CosmosDAOInterface} from './CosmosDAO';
import {CosmosDAO} from './CosmosDAO';
import {v4} from 'uuid';
import {print, CallThrowError} from './Util';

const CosCom:CosmosDAO = new CosmosDAO()

export default class CosmosManager implements CosmosDAOInterface {

    //client management
    async CreateNewClient(FirstName: string, LastName: string, ID?:string): Promise<Client> {
        print(`Try Created An Account`)
        if(FirstName.length<3)
            CallThrowError('Client Name Error','Please use more than 3 characters to for your first name');
        if(LastName.length<3)
            CallThrowError('Client Name Error','Please use more than 3 characters to for your last name');   
        const AccountName:string = "Checking";
        const Amount:number = 0;
        const TempAccount:Account = {AccountName, Amount}
        const Accounts:Account[] = [TempAccount]
        let id:string;
        if(ID !==""){id = ID;}
        else{id = v4();}
        const TempClient  = {id, FirstName, LastName, Accounts}
        const ReturnClient:Client = await CosCom.AddNewClient(TempClient);
        print(`New Account Created`)
        return ReturnClient;
    }
    async GetClient(ClientID: string): Promise<Client> {
        print(`Try Getting Account`) 
        const ReturnClient:Client = await CosCom.GetClientByID(ClientID);
        print(`Account Returned: ${ReturnClient.id}`)
        return ReturnClient;
    }
    async DeleteClient(ClientID: string): Promise<Client> {
        print(`Try Deleting Client`)
        const ReturnClient:Client = await CosCom.DeleteClient(ClientID);
        print(`Client Deleted: ${ReturnClient.id}`)
        return ReturnClient;
    }
    async ChangeClientName(ClientID:string ,FirstName: string, LastName: string): Promise<Client> {
        print(`Change Client Name`)
        if(FirstName.length<3)
            CallThrowError('Client Name Error','Please use more than 3 characters to for your first name');
        if(LastName.length<3)
            CallThrowError('Client Name Error','Please use more than 3 characters to for your last name'); 
        let TempClient:Client = await CosCom.GetClientByID(ClientID);
        const TempCObj:ClientObj = new ClientObj(TempClient);
        TempCObj.ChangeClientFirstNAme(FirstName),
        TempCObj.ChangeClientLastNAme(LastName)
        TempClient = TempCObj.ReconstructClient();
        const ReturnClient:Client = await CosCom.UpdateClient(TempClient);
        print(`Client name change: ${ReturnClient.id}`)
        return ReturnClient;
    }
    async GetAllClients(): Promise<Client[]> {
        print(`Try get All Clients`)
        const ReturnClients:Client[]= await CosCom.GetAllClients();
        print(`Clients returned: ${ReturnClients.length}`)
        return ReturnClients;
    }

    // Account Management
    async CreateNewClientAccount(ClientID: string, AccountName: string): Promise<Client> {
        let TempClient:Client = await CosCom.GetClientByID(ClientID);
        print(`Client Trying to Create Account`)
        if(AccountName.length<3)
            CallThrowError('Account Name Error','Please use more than 3 characters to for your account name');
        const TempCObj:ClientObj = new ClientObj(TempClient);
        TempCObj.CreateNewClientAccount(AccountName);
        TempClient = TempCObj.ReconstructClient();
        const ReturnClient:Client = await CosCom.UpdateClient(TempClient);
        print(`Client Created Account: ${ReturnClient.Accounts.length}`)
        return ReturnClient;
    }
    async GetClientAccount(ClientID: string, AcconutIndex: number): Promise<Account> {
        print(`Try Get Account`)
        const TempClient:Client = await CosCom.GetClientByID(ClientID);
        const TempAccounts:Account = TempClient.Accounts[AcconutIndex]; 
        print(`Accounts returned: ${TempAccounts.AccountName}`)
        return TempAccounts;
    }
    async DeleteClientAccount(ClientID:string, AccountIndex:number): Promise<Client> {
        print(`deleting client`)
        let TempClient:Client = await CosCom.GetClientByID(ClientID)
        if(TempClient.Accounts.length <2)
            CallThrowError("Account Error","You can not delete an account unless you have more than 2");
        const TempCObj:ClientObj = new ClientObj(TempClient)
        TempCObj.DeleteClientAccount(AccountIndex);
        TempClient = TempCObj.ReconstructClient();
        const ReturnClient:Client = await CosCom.UpdateClient(TempClient);
        print(`Client Deleted: ${ReturnClient.id}`)
        return ReturnClient;


    }
    async ChangeClientAccountName(ClientID: string, AccountIndex: number, NewAccountName: any): Promise<Client> {
        print(`Account  name change`)
        if(NewAccountName.length<3)
            CallThrowError('Account Name Error','Please use more than 3 characters to for your account name');
        let TempClient:Client = await CosCom.GetClientByID(ClientID);
        const TempCObj:ClientObj = new ClientObj(TempClient)
        TempCObj.ChangeAccountName(AccountIndex, NewAccountName);
        TempClient = TempCObj.ReconstructClient();
        const ReturnClient:Client = await CosCom.UpdateClient(TempClient);
        print(`Acccount name change: ${ReturnClient.Accounts[AccountIndex].AccountName}`)
        return ReturnClient;
    }
    async GetAllAccountsFromClient(ClientID: string): Promise<Account[]> {
        print(`Getting All accounts`)
        const ReturnClient:Client = await CosCom.GetClientByID(ClientID);
        const ReturnAccounts:Account[] = ReturnClient.Accounts;
        print(`Accounts returned: ${ReturnAccounts.length}`)
        return ReturnAccounts;
    }
    async Despoite(ClientID:string, AccountIndex:number, Amount: number): Promise<Client> {
        print(`Depositing Amount`)
        if(Amount <1)
            CallThrowError('Account Deposite Error','You must deposite more than $0');
        let TempClient:Client = await CosCom.GetClientByID(ClientID);
        const TempCObj:ClientObj = new ClientObj(TempClient);
        TempCObj.Deposite(AccountIndex, Amount);
        TempClient = TempCObj.ReconstructClient();
        const ReturnClient:Client = await CosCom.UpdateClient(TempClient);
        print(`New Balance: ${ReturnClient.Accounts[AccountIndex].AccountName} ${ReturnClient.Accounts[AccountIndex].Amount}`)
        return ReturnClient;
    }
    async Withdraw(ClientID: string, AccountIndex:number, Amount: number): Promise<Client> {
        if(Amount <1)
            CallThrowError('Account Withdraw Error','You must withdraw more than $0, please check that you input a positive amount');
        print(`Withdraw Amount: ${Amount}`)

        let TempClient:Client = await CosCom.GetClientByID(ClientID);
        if(TempClient.Accounts[AccountIndex].Amount <1)
            CallThrowError(`Account Withdraw Error`,`Not enough funds to withdraw, Current Balance: ${TempClient.Accounts[AccountIndex].Amount}`);
        if(TempClient.Accounts[AccountIndex].Amount - Amount <0)
            CallThrowError('Account Withdraw Error',`Not Enough funds to withdraw, resulting balance overdraft: ${TempClient.Accounts[AccountIndex].Amount-Amount}`);
        const TempCObj:ClientObj = new ClientObj(TempClient);
        TempCObj.ClientWithdraw(AccountIndex, Amount);
        TempClient = TempCObj.ReconstructClient();
        const ReturnClient:Client = await CosCom.UpdateClient(TempClient);
        print(`New Balance: ${ReturnClient.Accounts[AccountIndex].AccountName} ${ReturnClient.Accounts[AccountIndex].Amount}`)
        return ReturnClient;
    }
    async GetAccountsByRange(ClientID:string, MinRange:number, MaxRange:number=10000000000):Promise<string>{
        print(`GetAccount In Range`)
        const TempClients:Client = await CosCom.GetClientByID(ClientID);
        if(TempClients == undefined)
            CallThrowError("Filter Error", `No Client was found with ID: ${ClientID}`)
        const TempCObj:ClientObj = new ClientObj(TempClients);
        const ReturnString:string = TempCObj.FilterAccounts(MinRange,MaxRange);
        print(ReturnString);
        return ReturnString;
    }
}



