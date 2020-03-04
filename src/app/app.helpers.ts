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

