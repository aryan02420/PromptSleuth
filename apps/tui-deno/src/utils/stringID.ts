export async function stringID(str: string): Promise<string> {
  const message = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-1", message);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return hashHex;
}
