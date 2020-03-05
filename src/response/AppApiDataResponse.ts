import AppApiResponse from "./AppApiResponse"

export default class AppApiDataResponse extends AppApiResponse{
  constructor(data:any, type:string = AppApiResponse.TYPE_SUCCESS) {
      super(data, type, '')
  }
}
