import { DiscGolfEvent } from "./DiscGolfEvent";

export type TableColumn = {
  header: string;
  field: string;
  width?: string;
  visual?: (row: DiscGolfEvent) => React.ReactNode;
};