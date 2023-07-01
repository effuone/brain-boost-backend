export default function extractJSONObjectFromString(
  str: string,
): object | null {
  const regex = /{(?:[^{}]|(?R))*}/g;

  const matches = str.match(regex);

  if (!matches || matches.length === 0) {
    return null;
  }

  const jsonObject = JSON.parse(matches[0]);
  return jsonObject;
}
