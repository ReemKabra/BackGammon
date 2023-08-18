class user{
    constructor(username, password, email,lastlogin,token="") {
        this.username = username;
        this.password = password;
        this.email = email;
        this.lastlogin = lastlogin;
        this.token = token;
}
}
export default user