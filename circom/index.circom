pragma circom 2.1.5;
template recover (arr) {
    signal output out;
    out <== 3;
}

function slice(arr, start, end){
    var sliced[25];
    for(var i = start; i < end; i++) sliced[i] = arr[i]; 
    return sliced;
}

function _recover(m_queue, len){
    if(len == 0) return 0;
    var size = m_queue[0];
    return size;
}

template JSON (num) {  
   signal input json[num];  
   signal input path;  
   signal output hash[3];
   var len = json[0];
   var blen = json[1];
   var meta[num] = slice(json, 2, len + 2);
   var body[num] = slice(json, len + 2, len + 2 + blen);
   var b_queue[num] = slice(body, 0, blen);
   var x = _recover(meta, len);
   hash[0] <== json[0] * path + 3;  
   hash[1] <== json[1] * hash[0]; 
   hash[2] <== hash[1];  
}

 component main = JSON(25);