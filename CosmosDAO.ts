// Needed for Cosmose code to work
import {CosmosClient, ItemResponse}  from '@azure\\cosmos';
import {CallThrowError, print} from './Util';
// Get variables needed for server connection
import {GetPrimaryConnectionKey, GetDataBaseName, GetContainerName} from "./DataBaseStringValues";

//relevant objects for minimal operations
import {Client, Account} from "./Entities";


// Initlize Data Base Connection
const client = new CosmosClient(  String(GetPrimaryConnectionKey())  ); // Primary key from Cosmose
const database = client.database( GetDataBaseName() ); // Name of th DataBase
const DataContainer = database.container( GetContainerName() ); // Container name

// Add New Item to Data Base
interface CosmosInteractionInterFace{
    AddNewClient(TempClient:Client): Promise<Client>;
    GetAllClients(): Promise<Client[]>
    GetClientByID(CID:string): Promise<Client>
    UpdateClient(Client:Client): Promise<Client>
    DeleteClient(CID:string): Promise<Client>
}

export class CosmosDAO implements CosmosInteractionInterFace{

    async AddNewClient(TempClient: Client): Promise<Client> {
        const Response = await DataContainer.items.create( TempClient );
        const id:string = Response.resource.id;
        const FirstName:string = Response.resource.FirstName;
        const LastName:string = Response.resource.LastName;
        const Accounts:Account[] = Response.resource.Accounts;
        const ReturnClient:Client = {id, FirstName,LastName,Accounts};
        print(`New Client Added: ${ReturnClient.id}, ${ReturnClient.FirstName} ${ReturnClient.LastName}`);
        return ReturnClient;
    }
    
    async GetAllClients(): Promise<Client[]> {
        const Response = await DataContainer.items.readAll<Client>().fetchAll();
        const TempClients:Client[] = Response.resources;
        if(!TempClients){
            CallThrowError("Client Creation Error","Server having issue creating a new client");
        }
        print(`Get All Client Return from Database`)
        return TempClients;
    }

    async GetClientByID(CID: string): Promise<Client> {
        const Response = await DataContainer.item(CID,CID).read<Client>();
        console.log("Get Response: "+Response)
        const id = Response.resource.id;
        const FirstName = Response.resource.FirstName;
        const LastName = Response.resource.LastName;
        const Accounts = Response.resource.Accounts
        const TempClient:Client = {id, FirstName,LastName,Accounts};
        print(`Get Client Return from Database: ${TempClient.id}`)
        return TempClient;
    }

    async UpdateClient(Client: Client): Promise<Client> {
        const Response = await DataContainer.items.upsert<Client>(Client);
        const id = Response.resource.id;
        const FirstName = Response.resource.FirstName;
        const LastName = Response.resource.LastName;
        const Accounts = Response.resource.Accounts
        const TempClient:Client = {id, FirstName,LastName,Accounts};
        print(`Get Client updated from Database ${TempClient.id}`)
        return TempClient;
    }

    async DeleteClient(CID: string): Promise<any> {
        const Response:any = await DataContainer.item(CID,CID).delete();
        return Response;
    }
}

export interface CosmosDAOInterface {
    // Client Level
    CreateNewClient(FirstName:string, LastName:string):Promise<Client>;
    GetClient(ClientID): Promise<Client>
    DeleteClient(CleintID:string): Promise <Client>;
    ChangeClientName(ClientID:string ,FirstName:string, LastName:string): Promise<Client>;
    GetAllClients():Promise<Client[]>;

    // Account Level
    CreateNewClientAccount(ClientID:string, AccountName:string):Promise<Client>;
    GetClientAccount(ClientID:string, AcconutIndex:number): Promise<Account>;
    DeleteClientAccount(ClientID:string, AccountIndex:number): Promise<Client>
    ChangeClientAccountName(ClientID:string, AccountIndex:number, NewAccountName:String):Promise<Client>
    GetAllAccountsFromClient(ClientID:string): Promise<Account[]>;
    Despoite(ClientID:string, AccountIndex:number, Amount:number): Promise<Client>;
    Withdraw(ClientID:string, AccountIndex:number, Amount:number): Promise<Client>;
    GetAccountsByRange(ClientID:string, MinRange:number, MaxRange:number):Promise<string>;

} 