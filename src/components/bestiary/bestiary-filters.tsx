import { BestiaryFilters } from "@/types/bestiary";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  filters: BestiaryFilters;
  onChange: (filters: BestiaryFilters) => void;
};

export function BestiaryFiltersComponent({ filters, onChange }: Props) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Buscar por nome, tipo ou charms"
        value={filters.search}
        onChange={(e) =>
          onChange({ ...filters, search: e.target.value })
        }
      />

      <Select
        value={filters.completed === null ? "all" : filters.completed ? "complete" : "incomplete"}
        onValueChange={(value) =>
          onChange({
            ...filters,
            completed:
              value === "all" ? null : value === "complete",
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="complete">Completos</SelectItem>
          <SelectItem value="incomplete">Incompletos</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
