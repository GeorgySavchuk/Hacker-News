import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
    Div,
    Group,
    Header,
    Link,
    NavIdProps,
    Panel,
    PanelHeader,
    Separator,
    SimpleCell,
    Spinner,
    SubnavigationBar,
    SubnavigationButton,
} from "@vkontakte/vkui";
import {getPublicationDate, isComment, isStory, useAppDispatch, useAppSelector} from "../../shared/lib";
import styles from './styles.module.css'
import {Comment} from "../../shared/api/types.ts";
import {useLazyGetItemByIdQuery} from "../../shared/api";
import {CommentList} from "../../widgets/comment-list";
import {setCurrentPage, setStory} from "../../shared/model/slices";
import {useRouteNavigator} from "@vkontakte/vk-mini-apps-router";

export const StoryPage: FC<NavIdProps> = ({id}) => {
    const {story} = useAppSelector(state => state.storyReducer)
    const dispatch = useAppDispatch()
    const routeNavigator = useRouteNavigator()
    const [fetchItemById] = useLazyGetItemByIdQuery()
    let [comments, setComments] = useState<Comment[]>([])
    let storyTextRef = useRef<HTMLDivElement>(null)
    let [isCommentsLoading, setIsCommentsLoading] = useState<boolean>(true)


    const getRootComments = useCallback(async (rootCommentsId: number[]): Promise<Comment[]> => {
        let comments: Comment[] = []
        for (let i = 0; i < rootCommentsId.length; i++) {
            const res = (await fetchItemById(rootCommentsId[i])).data
            if (res !== undefined && isComment(res)) {
                if (res.by && res.text) {
                    comments.push(res)
                }
            }
        }
        return comments
    }, [story])

    useEffect(() => {
        let savedStory = localStorage.getItem("story")
        if (savedStory) {
            dispatch(setStory(JSON.parse(savedStory)))
        }

        let savedRootComments = localStorage.getItem("storyComments")
        if (savedRootComments) {
            setComments(JSON.parse(savedRootComments))
        }
    }, []);

    useEffect(() => {
        if (storyTextRef.current && story.text) {
            storyTextRef.current.innerHTML = story.text
        }

        if (story.kids) {
            getRootComments(story.kids).then(comments => {
                localStorage.setItem("storyComments", JSON.stringify(comments))
                setComments(comments)
            })
        }

        setIsCommentsLoading(false)
    }, [story]);

    const redirectToHomePage = () => {
        let savedCurrentPage = localStorage.getItem("currentPage")
        if (savedCurrentPage) {
            dispatch(setCurrentPage(JSON.parse(savedCurrentPage)))
        } else {
            dispatch(setCurrentPage(1))
        }
        routeNavigator.push('/')
    }

    const updateStory = async () => {
        setIsCommentsLoading(true)
        let res = (await fetchItemById(story.id)).data
        if (res !== undefined && isStory(res)) {
            localStorage.setItem("story", JSON.stringify(res))
            dispatch(setStory(res))
            setIsCommentsLoading(false)
        }
    }

    return (
        <Panel id={id}>
            <PanelHeader>Hacker News</PanelHeader>
            <Group className={styles.navigationBar}>
                <SubnavigationBar mode={"overflow"} showArrows={"always"}>
                    <SubnavigationButton onClick={redirectToHomePage}>Go back to the news list</SubnavigationButton>
                    <SubnavigationButton onClick={updateStory}>Update comments</SubnavigationButton>
                </SubnavigationBar>
            </Group>
            <Group
                mode="card"
                className={styles.storyBlockHeader}
                header={
                    <Header
                        mode="primary"
                        subtitle={`By ${story.by} • Published at ${getPublicationDate(story.time)}`}
                        multiline
                    >
                        {story.title}
                    </Header>
                }
            >
                {
                    story.text && <SimpleCell multiline getRootRef={storyTextRef} className={styles.storyText}></SimpleCell>
                }
                {
                    story.url && <Div className={styles.storyHref}>
                        <SimpleCell multiline>Link to the news: <Link href={story.url}>{story.url}</Link></SimpleCell>
                    </Div>
                }
                <SimpleCell className={styles.commentsCount}>
                    {`Comments(${story.descendants}):`}
                </SimpleCell>
                <Separator/>
                {
                    isCommentsLoading && <Spinner size={"medium"} className={styles.loader}/>
                }
                {
                    comments.length !== 0 && <Group mode="plain" className={`${styles.comments} ${isCommentsLoading ? styles.hidden : ''}`}>
                        <CommentList comments={comments}/>
                    </Group>
                }
            </Group>
        </Panel>
    );
};
