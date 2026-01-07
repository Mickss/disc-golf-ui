import { DiscGolfEvent } from "./DiscGolfEvent";

export type TableColumn = {
  header: string;
  field: string;
  width?: string;
  minWidth?: string;
  visual?: (row: DiscGolfEvent) => React.ReactNode;
};