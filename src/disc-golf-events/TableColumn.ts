import { DiscGolfEvent } from "./DiscGolfEvent";

export type TableColumn = {
  header: string;
  field: string;
  align?: "left" | "right" | "center";
  visual?: (row: DiscGolfEvent) => React.ReactNode;
};