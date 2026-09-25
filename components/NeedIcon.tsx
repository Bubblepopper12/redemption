import {
  BedDouble,
  Briefcase,
  Church,
  IdCard,
  Medal,
  Scale,
  ShowerHead,
  Stethoscope,
  Utensils,
  Wifi,
  BookOpen,
  Building2,
  Sun,
  Hospital,
  type LucideProps,
} from "lucide-react";
import type { Category, NeedKey } from "@/lib/resources";

const NEED_ICONS: Record<NeedKey, React.ComponentType<LucideProps>> = {
  food: Utensils,
  shelter: BedDouble,
  showers: ShowerHead,
  id: IdCard,
  internet: Wifi,
  church: Church,
  medical: Stethoscope,
  jobs: Briefcase,
  veterans: Medal,
  legal: Scale,
};

const CATEGORY_ICONS: Record<Category, React.ComponentType<LucideProps>> = {
  library: BookOpen,
  shelter: BedDouble,
  "day-center": Sun,
  food: Utensils,
  church: Church,
  clinic: Stethoscope,
  hospital: Hospital,
  "id-office": IdCard,
  jobs: Briefcase,
  veterans: Medal,
  legal: Scale,
};

export function NeedIcon({ need, ...props }: { need: NeedKey } & LucideProps) {
  const Icon = NEED_ICONS[need];
  return <Icon aria-hidden="true" focusable="false" {...props} />;
}

export function CategoryIcon({ category, ...props }: { category: Category } & LucideProps) {
  const Icon = CATEGORY_ICONS[category] ?? Building2;
  return <Icon aria-hidden="true" focusable="false" {...props} />;
}
