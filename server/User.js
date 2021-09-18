class UserManager{
  constructor(){
    this.users=[];
  }
  addUser(id,username,room){
    this.users.push({id,username,room});
  }
  leaveUser(username){
    const index=this.users.find(u=>u.username===username);
    if(index!=1){
      this.users.splice(index,1);
    }
  }
  getCurrentUser(newID){
    return this.users.find(u=>u.id===newID);
  }
  getRoomUsers(newRoom){
    return this.users.filter(u=>u.room===newRoom);
  }
}
module.exports=UserManager;