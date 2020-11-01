function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function formatNumber(number: number): string {
    return number.toFixed(2)
}

const formatter = {
    formatDate,
    formatNumber
}

export {formatter}
