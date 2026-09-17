import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';

interface SortableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const SortableItem = ({ id, children, className = '', disabled = false }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className="relative group">
        {/* Drag handle */}
        {!disabled && (
          <button
            className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full z-10 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-accent cursor-grab active:cursor-grabbing transition-opacity duration-150"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

// Inline drag handle variant — for when the handle needs to be inside the card
interface DragHandleProps {
  id: string;
  disabled?: boolean;
}

export const InlineDragHandle = ({ id, disabled = false }: DragHandleProps) => {
  const { attributes, listeners } = useSortable({ id, disabled });

  if (disabled) return null;

  return (
    <button
      className="p-1 rounded-md hover:bg-accent cursor-grab active:cursor-grabbing transition-colors"
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </button>
  );
};

export const SortableCard = ({ id, children, disabled = false }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag handle overlay at top-left */}
      {!disabled && (
        <button
          className="absolute left-2 top-2 z-10 p-1.5 rounded-md bg-background/80 backdrop-blur-sm border shadow-sm opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity duration-150"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
      {children}
    </div>
  );
};
