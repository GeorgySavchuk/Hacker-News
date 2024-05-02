import {Comment, Story} from "../../api/types.ts";

export const isComment = (item: Story | Comment): item is Comment => {
    return (item as Comment).type === "comment"
}