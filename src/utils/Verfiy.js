const regs={
  email:/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/,
  number:/^([0]|[1-9][0-9]*)$/,
  password:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\\W]{6,18}$/,
  shareCode:/^[A-Za-z0-9]+$/
}

const verify=(rule,value,reg,callback)=>{
  if(value){
    if(reg.test(value)){
      callback();
    }else{
      callback(new Error(rule.message));
    }
  }else{
    callback()
  }
}

export default{
  email:(rule,value,callback)=>{
    return verify(rule,value,regs.email,callback)
  },
  number:(rule,value,callback)=>{
    return verify(rule,value,regs.number,callback)
  },
  password:(rule,value,callback)=>{
    return verify(rule,value,regs.password,callback)
  },
  shareCode:(rule,value,callback)=>{
    return verify(rule,value,regs.shareCode,callback)
  },
}