export async function runSearch(account: string, query: string) {
  try {
    // TODO:

    console.log({ account, query });
  } catch (e: any) {
    console.log(e.response.data.message);
  }
}

export default {
  runSearch,
};
