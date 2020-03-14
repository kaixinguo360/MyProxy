export function log(flag: any, ...messages: any[]) {
    console.log('[' + flag + ']', ...messages);
}

export function debug(flag: any, ...messages: any[]) {
    console.debug('[' + flag + ']', ...messages);
}
