
const process = require('process');

const LocalSource:boolean = false;

export function GetPrimaryConnectionKey():string{
    if(LocalSource)
        return String(process.env.CD_PK);
    else
        return String(CD_PK);
    
}

export function GetDataBaseName():string{
    return "test-banking-system-josh";
}

export function GetContainerName():string{
    return "clients";
}