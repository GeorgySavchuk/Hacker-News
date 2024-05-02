import {FC} from 'react';
import {ContentCard} from "@vkontakte/vkui";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";
import {Story} from "../../shared/api/types.ts";
import {getPublicationDate, useAppDispatch, useAppSelector} from "../../shared/lib";
import {setStory} from "../../shared/model/slices";

interface StoryCardProps {
    story: Story;
    mode: "outline-tint" | "tint" | "shadow" | "outline"
}

export const StoryCard: FC<StoryCardProps> = ({story, mode}) => {
    const routeNavigator = useRouteNavigator()
    const dispatch = useAppDispatch()
    let {currentPage} = useAppSelector(state => state.storyReducer)
    return <ContentCard
        subtitle={story.by}
        header={story.title}
        caption={`${getPublicationDate(story.time)} - ${story.score}★`}
        mode={mode}
        onClick={() => {
            localStorage.setItem("story", JSON.stringify(story))
            localStorage.setItem("currentPage", JSON.stringify(currentPage))
            if (!story.kids) {
                localStorage.setItem("storyComments", JSON.stringify([]))
            }
            dispatch(setStory(story))
            routeNavigator.push(`story/${story.id}`)
        }}
    />
};
