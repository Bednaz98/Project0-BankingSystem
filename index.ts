import express from "express";

//import System from './BankSystem';
import {Client, Account} from './Entities';
import CosmosManagerDAO  from './CosmosDAOImpliment';

// Class Initilizaers=========================
// Server Init
const app = express(); // Server Init
// Interface Implimentation class
const com:CosmosManagerDAO = new CosmosManagerDAO() ;
//============================================

//Server Options================================
// Converts body to json Automatically
app.use(express.json());
const PortNumber:number = 3001;
//==============================================

  /** Used to creates a new Default client account, WILL THROW ERROR, Status code: 201 created, 400 Bad Request*/
  // CreateNewClient(FirstName:string, LastName:string):Promise<Client>; // Post, 
    /***/
   /**Returns all client information, WILL THROW ERROR, Status code: 200 created, 400 Bad Request*/
   //GetClientInfo(ClientID:string): Promise<Client>; // Get
   /***/
   //DetleClient(ClientID:string); // Delete Status code: 200 created, 400 Bad Request
   /***/
  // UpdateClientName(ClientID:string, NewFirstName:string, NewLastName:string); // Put Status code: 200 created, 400 Bad Request
   //Client Acount Management
   /***/
  // CreateNewClientAccount(ClientID:string, AccountName:String); // Patch Status code: 201 created, 400 Bad Request
   /***/
  // GetClientAccount(ClientID:string, AccountIndex:number); // Get Status code: 200 created, 400 Bad Request
   /***/
  // DeleteClientAccount(ClientID:string, AccountIndex:number); // Delete Status code: 200 created, 400 Bad Request
   //***/
   //GetAllClients(ClientID:string): Promise<Client[]>; // Get Status code: 200 created, 400 Bad Request
   //client Account management
   /***/
   //GetAllClientAccounts(ClientID:string): Promise<Account[]>; // Get Status code: 200 created, 400 Bad Request
   /***/
  // DepositeClientAccount(ClientID:string, AccountIndex:number, Amount:number):Promise<Account>; // Put Status code: 200 created, 400 Bad Request
   /***/ 
  // WithdrawClientAccount(ClientID:string, AccountIndex:number, Amount:number):Promise<Account>; // Put Status code: 200 created, 400 Bad Request
   /***/
   //ChangeClientAccountName(ClientID:string, AccountIndex:number, NewName:string):Promise<Account>; // Put Status code: 200 created, 400 Bad Request

// Post New Client
app.post('/Clients/:FirstName/:LastName', async (req,res)=>{
    try {
        const {FirstName,LastName} = req.params;
        const TempClient:Client =await com.CreateNewClient(FirstName,LastName);
        res.status(200)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(400)
        res.send(error.name+"  "+error.message);
    }
});

//Get Client Info
app.get('/Clients/:ClientID', async (req,res)=>{
    try {
        const {ClientID} = req.params;
        const TempClient:Client =await com.GetClient(ClientID);
        res.status(200)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(404)
        res.send(error.name+"  "+error.message);
    }
});

// Delete Client by ID
app.delete('/Clients/:ClientID', async (req,res)=>{
    try {
        const {ClientID} = req.params;
        const TempClient:Client =await com.DeleteClient(ClientID);
        res.status(205)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(405)
        res.send(error.name+"  "+error.message);
    }
});

// Put Client Name
app.put('/Clients/:ClientID/:NewFirstName/:NewLastName',async (req,res)=>{
    try {
        const {ClientID,NewFirstName, NewLastName} = req.params;
        const TempClient:Client =await com.ChangeClientName(ClientID,NewFirstName, String(NewLastName));
        res.status(200)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(404)
        res.send(error.name+"  "+error.message);
    }
});

//Post New Account
app.post('/Clients/:ClientID/Accounts/:AccountName',async (req,res)=>{
    try {
        const {ClientID,AccountName} = req.params;
        const TempClient:Client =await com.CreateNewClientAccount(ClientID, AccountName);
        res.status(201)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(400)
        res.send(error.name+"  "+error.message);
    }
});

//Get Account info
app.get('/Clients/:ClientID/Accounts/:AccountIndex', async (req,res)=>{
    try {
        const {ClientID,AccountIndex} = req.params;
        const TempAccount:Account =await com.GetClientAccount(ClientID, Number(AccountIndex));
        res.status(200)
        res.send({'return':TempAccount});
    } catch (error) {
        res.status(404)
        res.send(error.name+"  "+error.message);
    }
});

//Delete Client Account
app.delete('/Clients/:ClientID/Accounts/:AccountIndex', async (req,res)=>{
    try {
        const {ClientID,AccountIndex} = req.params;
        const TempClient:Client = await com.DeleteClientAccount(ClientID, Number(AccountIndex));
        res.status(205)
        res.send(JSON.stringify({'return':TempClient}));
    } catch (error) {
        res.status(405)
        res.send(error.name+"  "+error.message);
    }
});

// Get all Clients
app.get('/Clients', async (req,res)=>{
    try {
        const TempClientArray:Client[] =await com.GetAllClients();
        res.status(200)
        res.send({'return':TempClientArray});
    } catch (error) {
        res.status(400)
        res.send(error.name+"  "+error.message);
    }
});

//Get All Accounts from client
app.get('/Clients/:ClientID/Accounts', async (req,res)=>{
    const {IsGreaterthan, IsLessThan} = req.query;
    if(IsLessThan != undefined){
        try {
            const {ClientID} = req.params;
            const ReturnString:string = await com.GetAccountsByRange( ClientID, Number(IsLessThan), Number(IsGreaterthan) );
            res.status(200)
            res.send(ReturnString);
        } catch (error) {
            res.status(400)
            res.send(error.name+"  "+error.message);
        }

    }
    else{
        try {
            const {ClientID} = req.params;
            const TempAccounts:Account[] =await com.GetAllAccountsFromClient(ClientID);
            res.status(200)
            res.send({'return':TempAccounts});
        } catch (error) {
            res.status(400)
            res.send(error.name+"  "+error.message);
        }
    }
});

//patch deposite to account
app.patch('/Clients/:ClientID/Accounts/:AccountIndex/Deposite', async (req,res)=>{
    try {
        const {ClientID, AccountIndex} = req.params;
        const {Amount} = req.body;
        const TempClient:Client = await com.Despoite(ClientID, Number(AccountIndex), Number(Amount));
        res.status(200)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(400)
        res.send(error.name+"  "+error.message);
    }
});

//patch withdraw from account
app.patch('/Clients/:ClientID/Accounts/:AccountIndex/Withdraw', async (req,res)=>{
    try {
        const {ClientID, AccountIndex} = req.params;
        const {Amount} = req.body;
        const TempClient:Client =await com.Withdraw(ClientID, Number(AccountIndex), Number(Amount));
        res.status(200)
        console.log("Withdraw Successful return")
        res.send({'return':TempClient});
    } catch (error) {
        console.log("Withdraw error return")
        if(Error(error).message.includes("Balance") || Error(error).message.includes("overdraft") ){
            res.status(422)
        }
        res.status(404)
        res.send(error.name+"  "+error.message);
    }
});

// Put Account name
app.put('/Clients/:ClientID/Accounts/:AccountIndex/:NewName', async (req,res)=>{
    try {
        const {ClientID, AccountIndex, NewName} = req.params;
        const TempClient:Client = await com.ChangeClientAccountName(ClientID, Number(AccountIndex), String(NewName));
        res.status(200)
        res.send({'return':TempClient});
    } catch (error) {
        res.status(400)
        res.send(error.name+"  "+error.message);
    }
});



app.listen(PortNumber,  ()=>console.log("++++++++++++++ Banking Server Started ++++++++++++++++"));