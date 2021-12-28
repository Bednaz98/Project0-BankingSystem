//Helper Functions
export function print(S:string){ // For console Debugging
    console.log("Log - "+Date()+":     " +S);
}
export function CallThrowError(Name:string, Message:string){ // quick Error Throwing and print at execution
    print(`****** Error Thrown  ===================================`);
    console.log(`ErrorType: ${Name}`);
    console.log(`-- ${Message}`)
    console.log('==============================================')
    const error:Error= Error(Name+"\n  --"+Message);
    throw error;
}