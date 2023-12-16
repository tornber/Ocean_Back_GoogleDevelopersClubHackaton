
export const errorHandler = (error : Error,name : string,from : string) : void => {
    let loggerFunction = console.log;

    loggerFunction("-----start------")
    loggerFunction("error occured in " + name)

    if (from = 'axios') {
        if (isAxiosError(error)) { 
            if(error.response) {
                loggerFunction("error.response.data: " + error.response.data)
                loggerFunction("error.response.status: " + error.response.status)
                loggerFunction("error.response.headers: " + error.response.headers)
            } else if (error.request) {
                loggerFunction("error.request: " + error.request)
            } else {
                loggerFunction("error.message: " + error.message)
            }
            loggerFunction(error.toJSON())
        }

    } else {
        loggerFunction(error)
    }

    loggerFunction("-----end------")
}

const isAxiosError = (error: any): error is import('axios').AxiosError => {
    return error.isAxiosError === true;
};


// module.exports = {
//     errorHandler
// }