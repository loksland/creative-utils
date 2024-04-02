/*
async function myFn() {
    await delay(3000);
    ...
}
*/
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));
