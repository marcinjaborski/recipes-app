import { Menu, MenuItem, PopoverPosition, TableCell, TableRow } from "@mui/material";
import _ from "lodash";
import { PointerEvent, ReactNode, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LongPressReactEvents, useLongPress } from "use-long-press";

type EditableRowProps<T extends string> = {
  columns: T[];
  data: Record<T, string | number | ReactNode>;
  onEdit: () => void;
  onDelete: () => void;
};

function EditableRow<T extends string>({ columns, data, onEdit, onDelete }: EditableRowProps<T>) {
  const { t } = useTranslation("Shared");
  const [holding, setHolding] = useState(false);
  const [menuPosition, setMenuPosition] = useState<PopoverPosition | undefined>(undefined);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const onLongPress = useCallback((event: LongPressReactEvents) => {
    setMenuPosition({ top: (event as PointerEvent).pageY, left: (event as PointerEvent).pageX });
    setHolding(false);
  }, []);

  const bind = useLongPress(onLongPress, {
    onStart: () => setHolding(true),
    onCancel: () => setHolding(false),
  });

  const onMenuClose = () => setMenuPosition(undefined);

  const handleEdit = () => {
    onEdit();
    onMenuClose();
  };

  const handleDelete = () => {
    onDelete();
    onMenuClose();
  };

  return (
    <>
      <TableRow ref={rowRef} {...bind()} hover={holding}>
        {columns.map((columnName) => (
          <TableCell
            key={columnName}
            align={typeof data[columnName] === "number" ? "right" : "inherit"}
            sx={{ position: "relative", "&>svg": { position: "absolute", top: "50%", translate: "0 -50%" } }}
          >
            {typeof data[columnName] === "number" ? _.round(data[columnName], 1) : data[columnName]}
          </TableCell>
        ))}
      </TableRow>
      <Menu
        open={!!menuPosition}
        anchorEl={rowRef.current}
        onClose={onMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={menuPosition}
      >
        <MenuItem onClick={handleEdit}>{t("edit")}</MenuItem>
        <MenuItem onClick={handleDelete}>{t("delete")}</MenuItem>
      </Menu>
    </>
  );
}

export default EditableRow;
