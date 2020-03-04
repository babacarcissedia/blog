import AppApiResponse from "./AppApiResponse"

export default class AppApiSuccessResponse extends AppApiResponse {
    constructor(data: any,message: string) {
        super(data,AppApiResponse.TYPE_SUCCESS,message);
    }
}
