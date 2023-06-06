import { FetchResponse } from './FetchResponse';
import { Response } from './Response';

class CompositeResponse {
  constructor(doRequest, resolve) {
    let data;
    const fetchResponse = new FetchResponse(val => data = val);
    const response = new Response(() => data);

    fetchResponse.close = () => {
      resolve(response);
    };

    this.executeRequest = req => {
      doRequest(req, fetchResponse);
    };
  }
}

export { CompositeResponse };
