
const process = require('process');


export function GetPrimaryConnectionKey():string{
        return String(process.env.CD_PK);
}

export function GetDataBaseName():string{
    return "test-banking-system-josh";
}

export function GetContainerName():string{
    return "clients";
}