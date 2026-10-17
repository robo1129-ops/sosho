(function(global){
  'use strict';

  var START_OF_FRAME=0xAB;
  var ESCAPE_BYTE=0xAC;
  var END_OF_FRAME=0xAD;

  function ZmkSerialTransport(options){
    options=options||{};
    this.onFrame=typeof options.onFrame==='function'?options.onFrame:function(){};
    this.onStatus=typeof options.onStatus==='function'?options.onStatus:function(){};
    this.port=null;
    this.reader=null;
    this.reading=false;
    this._disconnecting=false;
    this._inFrame=false;
    this._escaped=false;
    this._frameBytes=[];
  }

  Object.defineProperty(ZmkSerialTransport.prototype,'isConnected',{get:function(){return !!this.port&&this.reading;}});

  ZmkSerialTransport.prototype._setStatus=function(message){
    try{this.onStatus(message);}catch(e){}
  };

  ZmkSerialTransport.prototype.connect=async function(){
    if(this.isConnected)return true;
    if(typeof navigator==='undefined'||!navigator.serial){
      this._setStatus('Web Serial is not supported in this browser');
      return false;
    }
    this._disconnecting=false;
    try{
      this.port=await navigator.serial.requestPort();
      await this.port.open({baudRate:115200,dataBits:8,stopBits:1,parity:'none',flowControl:'none'});
      this.reading=true;
      this._setStatus('USB connected');
      this._readLoop();
      return true;
    }catch(error){
      var canceled=error&&(error.name==='AbortError'||error.name==='NotFoundError');
      this.port=null;
      this.reader=null;
      this.reading=false;
      this._setStatus(canceled?'USB connection canceled':'USB connection failed');
      return false;
    }
  };

  ZmkSerialTransport.prototype.disconnect=async function(){
    var hadConnection=!!this.port||!!this.reader;
    this._disconnecting=true;
    if(this.reader){try{await this.reader.cancel();}catch(e){}}
    if(this.port){try{await this.port.close();}catch(e){}}
    this.reader=null;
    this.port=null;
    this.reading=false;
    this._disconnecting=false;
    if(hadConnection)this._setStatus('USB disconnected');
  };

  ZmkSerialTransport.prototype._readLoop=async function(){
    try{
      while(this.port&&this.port.readable&&!this._disconnecting){
        var reader=this.port.readable.getReader();
        this.reader=reader;
        try{
          while(!this._disconnecting){
            var result=await reader.read();
            if(result.done)break;
            if(result.value)this._consume(result.value);
          }
        }catch(error){
          if(!this._disconnecting)this._setStatus('USB read error');
        }finally{
          try{reader.releaseLock();}catch(e){}
          if(this.reader===reader)this.reader=null;
        }
        if(!this._disconnecting)break;
      }
    }finally{
      this.reading=false;
      if(!this._disconnecting&&this.port){
        var port=this.port;
        this.port=null;
        try{await port.close();}catch(e){}
        this._setStatus('USB disconnected');
      }
    }
  };

  ZmkSerialTransport.prototype._consume=function(bytes){
    for(var i=0;i<bytes.length;i+=1){
      var byte=bytes[i];
      if(byte===START_OF_FRAME){
        this._frameBytes=[];
        this._inFrame=true;
        this._escaped=false;
        continue;
      }
      if(!this._inFrame)continue;
      if(this._escaped){
        this._frameBytes.push(byte);
        this._escaped=false;
      }else if(byte===ESCAPE_BYTE){
        this._escaped=true;
      }else if(byte===END_OF_FRAME){
        var frame=new Uint8Array(this._frameBytes);
        this._frameBytes=[];
        this._inFrame=false;
        try{this.onFrame(frame);}catch(e){this._setStatus('Frame callback error');}
      }else{
        this._frameBytes.push(byte);
      }
    }
  };

  global.ZmkSerialTransport=ZmkSerialTransport;
})(window);
