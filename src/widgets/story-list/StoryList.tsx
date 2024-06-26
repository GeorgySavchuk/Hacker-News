import {FC} from 'react';
import {CardGrid, CellButton, Group, Header, Pagination} from "@vkontakte/vkui";
import {StoryCard} from "../../entities/story-card";
import {Story} from "../../shared/api/types.ts";
import styles from './styles.module.css'

interface StoryListProps {
    latestStories: Story[];
    currentPage: number;
    handlePageChange: (page: number) => void;
    updateStoryList: () => void;
}

export const StoryList: FC<StoryListProps> = ({latestStories, currentPage, handlePageChange, updateStoryList}) => {
    return (
        <Group
            mode="card"
            header={<Header mode="primary">Latest news</Header>}
        >
            <CellButton
                onClick={updateStoryList}
                className={styles.updateBtn}
            >
                Update the news list
            </CellButton>
            <CardGrid
                size="l"
            >
                {
                    latestStories.map(latestStory => (
                        <StoryCard
                            story={latestStory}
                            mode={"outline-tint"}
                            key={latestStory.id}
                        />
                    ))
                }
            </CardGrid>
            <Pagination
                currentPage={currentPage}
                siblingCount={0}
                boundaryCount={1}
                totalPages={10}
                disabled={false}
                onChange={handlePageChange}
                className={styles.pagination}
            />
        </Group>
    );
};
