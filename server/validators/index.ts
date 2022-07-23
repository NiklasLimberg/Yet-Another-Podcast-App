export function castToNumber<T>(value: string | string[] | undefined, defaultValue: T): number | T {
    if(value === undefined) {
        return defaultValue;
    }
    
    try {    
        if(Array.isArray(value)) {
            return parseInt(value[0], 10)     
        } else {
            return parseInt(value, 10)
        }
    } catch(e) {
        throw new Error('could not convert limit to number')
    }
}

export function castToString<T>(value: string | string[] | undefined, defaultValue: T): string | T {
    if(Array.isArray(value)) {
        return value[0]
    }

    if(typeof value === 'string') {
        return value
    }

    return defaultValue
}