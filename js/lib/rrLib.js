// String formatter C#-style
// '{0} {1}!'.f('hello', 'world');
// => 'hello world!'
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

// Map method
// Array[a], (a -> b) -> Array[b]
if (!Array.prototype.map) {
    Array.prototype.map = function(f) {
        var result = [];
        for (var i = 0; i < this.length; i +=1) {
            result.push(f (this[i]));
        }
        return result;
    };
}


// Fold method
// Array[a], a, (a, b -> b) -> b
if (!Array.prototype.fold) {
    Array.prototype.fold = function(unit, f) {
        var result = unit;
        for (var i = 0; i < this.length; i +=1) {
            result = f(this[i], result);
        }
        return result;
    };
}

// ForEach method
// Array[a], (a -> void) -> Void
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(f) {
        for (var i = 0; i < this.length; i += 1) {
            f(this[i]);
        }
    };
}


// Filter method
// Array[a], (a -> Bool) -> Array[a]
if (!Array.prototype.filter) {
    Array.prototype.filter = function(pred) {
        var result = [];
        for (var i = 0; i < this.length; i +=1) {
            if (pred (this[i])) {
                result.push(this[i]);
            }
        }
        return result;
    };
}
