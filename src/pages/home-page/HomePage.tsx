import {NavIdProps, Panel, PanelHeader, ScreenSpinner} from "@vkontakte/vkui";
import {useGetLatestStoriesIDQuery, useLazyGetItemByIdQuery} from "../../shared/api";
import {FC, useCallback, useEffect, useState} from "react";
import {Story} from "../../shared/api/types.ts";
import {StoryList} from "../../widgets/story-list";
import {isStory, useAppDispatch, useAppSelector} from "../../shared/lib";
import {setCurrentPage} from "../../shared/model/slices";


export const HomePage: FC<NavIdProps> = ({id}) => {
    const {data: latestStoriesID, isFetching: isStoriesIDFetching, refetch} = useGetLatestStoriesIDQuery()
    const [fetchStoryById] = useLazyGetItemByIdQuery()
    const dispatch = useAppDispatch()
    let [latestStories, setLatestStories] = useState<Story[]>([])
    let {currentPage} = useAppSelector(state => state.storyReducer)
    let [isStoriesLoading, setIsStoriesLoading] = useState<boolean>(true)
    let [wasAutoUpdate, setWasAutoUpdate] = useState<boolean>(false)
    let [wasPaginationClick, setWasPaginationClick] = useState<boolean>(false)
    let [wasManualUpdate, setWasManualUpdate] = useState<boolean>(false)


    const getAllLatestStories = useCallback(async (latestStoriesID: number[]): Promise<Story[]> => {
        let stories: Story[] = []
        for (let i = 0; i < latestStoriesID.length; i++) {
            const res = (await fetchStoryById(latestStoriesID[i])).data
            if (res !== undefined && isStory(res)) {
                stories.push(res)
            }
        }
        stories.sort((a, b) => b.time - a.time)
        return stories
    }, [])

    const handlePageChange = (page: number) => {
        setWasPaginationClick(true)
        dispatch(setCurrentPage(page))
    }

    const updateManualStoryList = () => {
        setWasManualUpdate(true)
        refetch()
    }

    const updateAutoStoryList = () => {
        setWasAutoUpdate(true)
        refetch()
    }


    useEffect(() => {
       if(isStoriesIDFetching && wasAutoUpdate){
            setIsStoriesLoading(false)
       }
    }, [isStoriesIDFetching, wasAutoUpdate]);

    useEffect(() => {
        if (latestStoriesID) {
            if (!wasAutoUpdate || wasPaginationClick || wasManualUpdate) {
                setIsStoriesLoading(true)
            }
            getAllLatestStories(latestStoriesID.slice(10 * (currentPage - 1), 10 * currentPage)).then((stories) => {
                setLatestStories(stories)
                if (wasManualUpdate) {
                    setWasManualUpdate(false)
                } else if (!wasAutoUpdate || wasPaginationClick) {
                    setIsStoriesLoading(false)
                }
                if (wasPaginationClick) {
                    setWasPaginationClick(false)
                }
            })
        }
    }, [latestStoriesID, currentPage, wasManualUpdate]);

    useEffect(() => {
        const interval = setInterval(updateAutoStoryList, 60000);
        return () => {
            clearInterval(interval)
        };
    }, [latestStoriesID]);

    return (
        <Panel id={id}>
            <PanelHeader>Hacker News</PanelHeader>
            {
                isStoriesLoading
                    ? <ScreenSpinner state="loading"/>
                    : <StoryList
                        latestStories={latestStories}
                        currentPage={currentPage}
                        handlePageChange={handlePageChange}
                        updateStoryList={updateManualStoryList}
                    />
            }
        </Panel>
    );
};
