export function castToNumber(value: string | string[] | undefined, defaultValue: number): number {
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

export function castToString(value: string | string[] | undefined, defaultValue?: string): string | undefined {
    if(Array.isArray(value)) {
        return value[0]
    }

    if(typeof value === 'string') {
        return value
    }

    return defaultValue
}