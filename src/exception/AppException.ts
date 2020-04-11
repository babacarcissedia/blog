export default class AppException extends Error {
    public status:number
    public message:string
    public data:any

    constructor({data={}, message='', status=400}) {
        super(message);
        this.data = data
        this.status = status || 500
        this.message = message || 'Something went wrong'
    }
}
