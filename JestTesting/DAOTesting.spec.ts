import {Client, Account} from '../Entities';
import {GetPrimaryConnectionKey, GetDataBaseName, GetContainerName} from "../DataBaseStringValues";
import CosmosManager from '../CosmosDAOImpliment';
import {CosmosDAO} from '../CosmosDAO';

const CosCom:CosmosDAO = new CosmosDAO();
const com:CosmosManager = new CosmosManager()

let TempClient:Client;
const TestingID:string = 'TESTINGID';

describe("Test", ()=>{

    it("Check Primary Key", async ()=>{
        const Temp:string = String(GetPrimaryConnectionKey());
        expect(Temp).toBeTruthy()
    })

    it("Check Database Name", async ()=>{
        const Temp:string = GetDataBaseName();
        expect(Temp).toBeTruthy()
    })

    it("Check Container Name", async ()=>{
        const Temp:string = GetContainerName();
        expect(Temp).toBeTruthy()
    })

    it("Check DataBase Client Creation", async ()=>{
        let TempAccount:Account[] = [{AccountName:'Checking', Amount:500}];
        const TestingClient:Client = {id:TestingID, FirstName:'Jack', LastName:"Johnson", Accounts:TempAccount};
        const ReturnClient:Client = await CosCom.AddNewClient(TestingClient);
        TempClient=ReturnClient;
        expect(ReturnClient).toBeTruthy()
    })

    it("Check DataBase Client ChangeName", async ()=>{
        let ReturnClient:Client = await CosCom.GetClientByID(TempClient.id);
        ReturnClient.FirstName = "NewFirstName";
        ReturnClient.LastName = "NewLastName";
        TempClient= await CosCom.UpdateClient(ReturnClient);
        expect(TempClient.FirstName).toBe("NewFirstName");
        expect(TempClient.LastName).toBe("NewLastName");
    })

    it("Check Create New Account", async ()=>{
        let ReturnClient:Client = await com.CreateNewClientAccount(TempClient.id,"TestAccount");
        expect(ReturnClient.Accounts.length).toBe( (TempClient.Accounts.length +1) );
    })

    it("Check Account New Name", async ()=>{
        const Index:number =TempClient.Accounts.length 
        let ReturnClient:Client = await com.ChangeClientAccountName(TempClient.id, Index ,"NewAccountName")
        expect(ReturnClient.Accounts[Index].AccountName).toBe("NewAccountName");
    })

    it("Check Account Withdraw No Funds Error", async ()=>{
        const Index:number =TempClient.Accounts.length 
        try {
            await com.Withdraw(TempClient.id, (Index), 10)
        } catch (error) {
            expect(  error ).toThrowError
        }
        
    })

    it("Check Account Deposite", async ()=>{
        const Index:number =TempClient.Accounts.length 
        let ReturnClient:Client = await com.Despoite(TempClient.id, Index, 5000);
        expect(ReturnClient.Accounts[Index].Amount).toBe( 5000 );
    })
    it("Check Account Withdraw Overdraft Error", async ()=>{
        const Index:number =TempClient.Accounts.length 
        try {
            await com.Withdraw(TempClient.id, (Index), 5001)
        } catch (error) {
            expect(  error ).toThrowError
        }
    })

    it("Check Account Withdraw Sucess", async ()=>{
        const Index:number =TempClient.Accounts.length 
        const ReturnClient:Client = await com.Withdraw(TempClient.id, (Index), 200);
        expect(  ReturnClient.Accounts[Index].Amount ).toBe( 4800 )
        
    })

    it("Check Account Withdraw Complete", async ()=>{
        const Index:number =TempClient.Accounts.length 
        const ReturnClient:Client = await com.Withdraw(TempClient.id, (Index), 4800);
        expect(  ReturnClient.Accounts[Index].Amount ).toBe( 0 )
        
    })

    

    it("Check DataBase Client Deletion", async ()=>{
        const GetReturn = await CosCom.DeleteClient(TestingID);
        expect(GetReturn).toBeTruthy();
    })

}) 