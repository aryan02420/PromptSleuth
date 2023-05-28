// deno-lint-ignore no-explicit-any
export async function writeJSON<TData extends any>(
  filename: string,
  data: TData,
  options: {
    showWritingMessage: boolean;
  },
) {
  if (options.showWritingMessage) {
    console.log(`Writing ${filename} ...`);
  }
  await Deno.writeTextFile(filename, JSON.stringify(data, null, 2));
}
