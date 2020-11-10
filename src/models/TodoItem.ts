export default interface TodoItem {
  partitionKey: string;
  rowKey: string;
  name: string;
  isComplete: boolean;
}
