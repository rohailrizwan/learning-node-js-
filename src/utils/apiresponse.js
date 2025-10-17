class Apiresponse {
    constructor(status,message="succcess",data=[]){
        this.status=status;
        this.message=message;
        this.success = status >= 200 && status < 300;
        this.data=data
    }
}
export default Apiresponse