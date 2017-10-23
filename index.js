const memo = (fn, options = {}) =>
{
    options.cacheSize = options.cacheSize || 100;
    options.cacheDuration = options.cacheDuration || 5 * 60 * 1000 // 5 minutes
    const cache = [];
    
    return function(...args)
    {
        let result, destructure, params;

        const lookup = (keys) =>
        {
            for(let i=0; i < cache.length; i++)
            {
                let count = 0;

                for(const key of keys)
                {
                    const obj = destructure ? args[0][key] : args[key];

                    if(cache[i].arguments[key] === obj)
                    {
                        count++;
                    }
                }

                if(count === keys.length)
                {
                    return {index: i, value: cache[i].value};
                }
            }
        }

        if(args.length === 1 && typeof args[0] === 'object')
        {
            destructure = true;
            params = Object.keys(args[0]);
        }

        else
        {
            if(!args.length)
            {
                params = [undefined];
            }

            else
            {
                params = args.map((value, index) => index);
            }
        }

        result = lookup(params);

        if(result)
        {
            return result.value;
        }

        else
        {
            result =
            {
                arguments: destructure ? args[0] : args,
                value: fn.apply(this, args),
                timer: setTimeout(() =>
                {
                    const _result = lookup(params);
    
                    if(_result)
                    {
                        cache.splice(_result.index, 1);
                    }
                }, options.cacheDuration)
            };
            
            if(result.timer.unref)
            {
                result.timer.unref();
            }

            if(cache.length >= options.cacheSize)
            {
                clearTimeout(cache[0].timer);
                cache.shift();
            }

            cache.push(result);
            return result.value;
        }
    };
};

if(typeof module !== 'undefined' && module.exports)
{
    module.exports = memo;
}

else if(typeof define === 'function' && define.amd)
{
    define('memo', () => memo);
}

else if(window)
{
    window.memo = memo;
}