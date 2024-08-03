class ResponseContext {
  isDataSet = false;
  ok = false;

  constructor(doRequest, resolve, reject) {
    let data;

    this.close = function() {
      resolve(this);
    };

    this.error = function(error) {
      reject(error);
    };

    this.executeRequest = function(req, res) {
      doRequest(req, res);
    };

    this.getData = function() {
      return data;
    };

    this.setData = function(value) {
      data = value;
      this.isDataSet = true;
      this.ok = true;
    };
  }
}

export { ResponseContext };
