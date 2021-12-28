import { CosmosClient } from '@azure/cosmos';
import {Account, Client} from './Entities';
import {CallThrowError, print} from './Util';



export class AccountObj{
    private AccountName:string;
    private Amount:number;

    constructor(InitAccount:Account){
        print("Account Construction")
        this.AccountName = InitAccount.AccountName;
        this.Amount = InitAccount.Amount;
    }

    public ReconstructAccount():Account{
        print("Account Reconstruction")
        const AccountName:string = this.AccountName;
        const Amount:number =this.Amount;
        const TempAccount:Account ={AccountName, Amount};
        return TempAccount;
    }

    public ChangeName(NewName:string){
        this.AccountName = NewName;
        print("Account Name Change")
    }

    public Withdraw(WithdawAmount:number){
        console.log(`Exchange Balance: ${this.Amount}, Withdraw: ${WithdawAmount}`)       
        this.Amount-= WithdawAmount;
        print("Account Withdraw complete")

    }

    public Deposite(DepoisteAmount:number){
        if(DepoisteAmount<0)
            CallThrowError("Deposite Error","Please submit deposite amount as a positive number")
        
        this.Amount += DepoisteAmount;
    }

    public GetAmount():number{
        return this.Amount;
    }

    public GetName():string{
        return this.AccountName;
    }
}


export class ClientObj{
    private ClientID:string;
    private ClientFirstName:string;
    private ClientLastName:string
    private Accounts:AccountObj[] = [];

    constructor(InitClient:Client){
        print("Client Construction")
        this.ClientID=InitClient.id
        this.ClientFirstName=InitClient.FirstName
        this.ClientLastName=InitClient.LastName
        for(let i =0; i< InitClient.Accounts.length; i++){
            const TempAccountObj:AccountObj = new AccountObj(InitClient.Accounts[i]);
            if(TempAccountObj != undefined){
                console.log('--------------');
                console.log(this.Accounts);
            this.Accounts.push( TempAccountObj);
            }
        }
    }
    private GetAccountAmount(AccountIndex:number):number{
        return this.Accounts[AccountIndex].GetAmount();
    }

    /**Used to convert the class into interface form*/
    public ReconstructClient():Client{
        print("Client Reconstruction")
        const id:string = this.ClientID;
        const FirstName:string = this.ClientFirstName;
        const LastName:string = this.ClientLastName;
        let Accounts:Account[] =[];
        for(let i=0; i<this.Accounts.length;i++){
            if(this.Accounts[i] != undefined){
            Accounts.push( this.Accounts[i].ReconstructAccount() );
            }
        }
        const TempClient:Client ={id, FirstName, LastName, Accounts};
        return TempClient;
    }

    /**Used to change the first name of the Client*/
    public ChangeClientFirstNAme(NewFirstName:string){
        this.ClientFirstName = NewFirstName;
        print("Client First Name Change")
    }

    /**Used to change the last name of the Client*/
    public ChangeClientLastNAme(NewLastName:string){
        this.ClientLastName = NewLastName;
        print("Client Last Name Change")
    }

    /**Used tp Change the Account name of a Client*/
    public CreateNewClientAccount(AccountName:string){
        const Amount:number =0;
        const NewAccount:AccountObj = new AccountObj({AccountName, Amount})
        this.Accounts.push(NewAccount)
        print("Client New Account")
    }

    /**Used to delete a client account*/
    public DeleteClientAccount(AccountIndex:number){
        this.Accounts.splice(AccountIndex,1)
        print("Client Account Deleted")
    }

    /**Used to deposite amount to a client*/
    public Deposite(AccountIndex:number, Amount:number){
        this.Accounts[AccountIndex].Deposite(Amount);
        print("Client Deposite")
    }

    /**Used wot Withdraw amount from a client*/
    public ClientWithdraw(AccountIndex:number, Amount:number){
        console.log("Client Obj Withdraw");
        this.Accounts[AccountIndex].Withdraw(Amount);
        print("Client Withdraw Complete")
    }

    /**Used to change the account name of a client*/
    public ChangeAccountName(AccountIndex:number, AccountName:string){
        this.Accounts[AccountIndex].ChangeName(AccountName);
        print("Client Change Name")
    }
    
    
    public FilterAccounts(min:number, max:number = 10000000000):string{
        let TempString:string =`${this.ClientFirstName} ${this.ClientLastName}`;
        console.log("Filtering Accounts for "+ TempString);
        if(this.Accounts.length<1){
            TempString+= ` has no accounts between ${min} and ${max}`;
            return TempString;
        }
        TempString+=":";
        let Check:boolean = false;
        for(let i =0; i < this.Accounts.length; i++ ){
            if( this.GetAccountAmount(i)>=min && this.GetAccountAmount(i)<= max){
                Check=true;
                TempString+= `\n-- ${String(this.Accounts[i].GetName())}: ${Number(this.Accounts[i].GetAmount())}`
            }
        }
        console.log("Fitler Finished")

        return TempString;
    }
}

