import {Comment, Story} from "../../api/types.ts";

export const isStory = (item: Story | Comment): item is Story => {
    return (item as Story).type === "story"
}