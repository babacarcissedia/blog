export function slugify (value: string): string {
    if (!value) {
        return ''
    }
    return value.toLowerCase().split(' ').join('-')
}

export function isSureArray (data: any): any[] | any {
    if (!data) {
        return []
    }
    if (!Array.isArray(data)) {
        data = [data]
    }
    return data
}

export function onlyOn (data: any, fields: string[]): any {
    let dump: any = {}
    fields.forEach((field: string) => {
        if (field in data) {
            dump[field] = data[field]
        }
    })
    return dump
}

