
//=========================================

//=========================================
// Unit Account Interface
export interface Account{
    AccountName:string,
    Amount:number

}
// Unit client Interface
export interface Client{
    id:string,
    FirstName:string,
    LastName:string,
    Accounts:Account[];
}
//=========================================


