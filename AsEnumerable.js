Object.defineProperty(Array.prototype, 'AsEnumerable', { value: function(){
  return new Enumerable(this);
}});

var Enumerable = function (set) {
    this.Set = set;
    this.Path = [];
    this.Paths = [];
};

(function(fn,undefined){
    function Break(){}
    var compares = {};
    compares["[object Number]"] = function (x, y, desc) {
        return !desc? x - y : y - x;
    };
    compares["[object String]"] = function (x, y, desc) {
        return !desc? x.localeCompare(y) : y.localeCompare(x);
    };
    compares["[object Date]"] = function (x, y, desc) {
        var r = x.split('/');
        var s = y.split('/');
        var g = (100 * r[0]) + (r[1] | 0) + (10000 * r[2]);
        var h = (100 * s[0]) + (s[1] | 0) + (10000 * s[2]);
        return !desc? g - h : h - g;
    };
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
    
    fn.Where = function(func)
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
    
    fn.Lookup = function(func){
     return this;
    };
    
    fn.OrderBy = function(func){
     if(this.Path.length > 0 ){
      this.Paths.push(this.Path);
      this.Path = [];
     }
     var f = function(array){
         array.sort(function(a,b){
             var x = func ? func(a) : a;
             var y = func ? func(b) : b;
             return compares[toString.call(x)](x, y, false);
         });
     };
     f.type = "order";
     this.Paths.push([f]);
     return this;
    };
    
    fn.OrderByDescending = function(func){
     if(this.Path.length > 0 ){
      this.Paths.push(this.Path);
      this.Path = [];
     }
     var f = function(array){
         array.sort(function(a,b){
             var x = func ? func(a) : a;
             var y = func ? func(b) : b;
             return compares[toString.call(x)](x, y, true);
         });
     };
     f.type = "order";
     this.Paths.push([f]);
     return this;
    };
    
    fn.ThenBy = function(func){
     
     return this;
    };
    
    fn.Take = function(count){
     this.Path.push(
         function(item,i){
          if( i >= count ) return Break;
          return item;
         }
     );
     return this;
    };
    
    fn.ToArray = function(){
     if(this.Path.length > 0 )this.Paths.push(this.Path);
     var array = [];
     var set = this.Set;
     for(var a = 0; a < this.Paths.length; a++)
     {
         var path = this.Paths[a];
         if(path[0].type == "order"){
          for(var i = 0; i < path.length; i++){ 
           path[i](set);  
          }
         }else{
             for(var i = 0; i < set.length; i++){ 
                 var result = (function walk(item,n){
                     if(n == path.length || item == undefined) return item;
                     return walk(path[n](item,i),n+1);
                 })(set[i],0);
                 if(result == Break)break;
                 if(result != undefined)array.push(result);
             }
             set = array;
             array = [];
         }
     }
     return set;
    };
})(Enumerable.prototype)
