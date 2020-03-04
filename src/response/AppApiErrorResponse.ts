import AppApiResponse from "./AppApiResponse"

export default class AppApiErrorResponse extends AppApiResponse {
    constructor(data:any, message:string) {
        super(data,AppApiResponse.TYPE_ERROR,message);
    }

}
