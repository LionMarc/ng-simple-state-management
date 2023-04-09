import { JsonNodeType } from './json-node-type';

export interface JsonNode {
  type: JsonNodeType;
  name?: string;
}
