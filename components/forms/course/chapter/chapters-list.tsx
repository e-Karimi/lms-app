"use client";

import type { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updatedData: { id: string; position: number }[]) => void;
}

export default function ChaptersList({ items, onEdit, onReorder }: ChaptersListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  //* prevent to display on server side rendering in order to hinder hydreation error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setChapters(items);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);
    const updatedChapters = items.slice(startIndex, endIndex + 1);

    const bulkUpdatedData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdatedData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {chapters.map((chapter, index) => (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                      )}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-00 rounded-l-md transition",
                          chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                        )}
                      >
                        <Grip className="w-5 h-5 text-slate-500" />
                      </div>
                      {chapter.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree && (
                          <Badge className="text-slate-100 font-normal bg-sky-500 hover:bg-sky-500">Free</Badge>
                        )}
                        <Badge
                          className={cn(
                            "text-slate-50 font-normal bg-slate-500 hover:bg-slate-500",
                            chapter.isPublished && "bg-indigo-600 hover:bg-indigo-600  text-slate-200"
                          )}
                        >
                          {chapter.isPublished ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={() => onEdit(chapter.id)}
                          className="w-4 h-4 text-slate-600 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <p className="text-xs text-muted-foreground mt-4">Drag and drop to reorder the chapters</p>
    </>
  );
}
