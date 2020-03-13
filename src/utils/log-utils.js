export function log(flag, ...messages) {
    console.log('[' + flag + ']', ...messages);
}

export function debug(flag, ...messages) {
    console.debug('[' + flag + ']', ...messages);
}
