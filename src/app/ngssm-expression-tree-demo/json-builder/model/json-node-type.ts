export enum JsonNodeType {
  object = 'Object',
  value = 'Value'
}

export const getJsonNodeTypes = (): { key: JsonNodeType; label: string }[] => {
  return [JsonNodeType.object, JsonNodeType.value].map((v) => ({ key: v, label: v }));
};
