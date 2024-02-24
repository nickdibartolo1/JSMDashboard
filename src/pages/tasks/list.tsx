import { KanbanBoardContainer, KanbanBoard } from "@/components/tasks/kanban/board";
import KanbanColumn from "@/components/tasks/kanban/column";
import React from "react";

const List = () => {
  return (
    <>
      <KanbanBoardContainer style={{}}>
        <KanbanBoard>

        <KanbanColumn>
        </KanbanColumn>

        <KanbanColumn>
        </KanbanColumn>

        </KanbanBoard>
      </KanbanBoardContainer>
    </>
  );
};

export default List;
