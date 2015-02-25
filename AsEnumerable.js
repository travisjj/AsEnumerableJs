Array.prototype.AsEnumerable = function(){
  return new Enumerable(this);
};

var Enumerable = function (set) {
    this.Set = set;
    this.Path = [];
};

(function(fn,undefined){
    fn.Any = function(func)
    {
        if(func == undefined && this.Set.length > 0) return true;
        for(var i = 0; i < this.Set.length; i++){
         if(func(this.Set[i],i))return true;
        }
        return false;
    };
    
    fn.All = function(func)
    {
        if(func == undefined) throw new Error("No expression");
        for(var i = 0; i < this.Set.length; i++){
         if(!func(this.Set[i],i))return false;
        }
        return true;
    };
    
    fn.Count = function(func)
    {
        if(func == undefined) return this.Set.length;
        var count = 0;
        for(var i = 0; i < this.Set.length; i++){
         if(func(this.Set[i],i))count++;
        }
        return count;
    };
    
    fn.Sum = function(func)
    {
        if(func == undefined) return this.Set.length;
        var sum = 0;
        for(var i = 0; i < this.Set.length; i++){
            if(func == undefined){
             sum += this.Set[i];
            }else{
             sum += func(this.Set[i],i);   
            }
        }
        return sum;
    };
    
    fn.Where = function(func,i)
    {
     this.Path.push(
         function(item,i){
             if(func(item,i))return item;
         }
     );
     return this;
    };
    
    fn.Select = function(func)
    {
     this.Path.push(
         function(item,i){
             return func(item,i);
         }
     );
     return this;
    };
    
    fn.ToArray = function(){
     var array = [];
     var path = this.Path;
     for(var i = 0; i < this.Set.length; i++){ 
      var result = (function walk(item,i){
       if(i == path.length || item == undefined) return item;
       return walk(path[i](item,i),i+1);
      })(this.Set[i],0);
      if(result != undefined)array.push(result);
     }
     return array;
    };
})(Enumerable.prototype)
