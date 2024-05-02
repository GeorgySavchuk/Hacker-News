import {Comment} from "../../shared/api/types.ts";

import {FC, Fragment, useCallback, useState} from "react";
import {Group, Separator} from "@vkontakte/vkui";
import {CommentItem} from "../../entities/comment-item";
import styles from './styles.module.css'
import {useLazyGetItemByIdQuery} from "../../shared/api";
import {isComment} from "../../shared/lib";

interface CommentListProps {
    comments: Comment[];
}
export const CommentList: FC<CommentListProps> = ({comments}) => {
    const [fetchCommentById] = useLazyGetItemByIdQuery();
    let [childComments, setChildComments] = useState<Record<number, Comment[]>>({})

    const displayCommentsTree = useCallback((comment: Comment, treeLevel: number = 0) => {
        if ((!comment.kids && treeLevel === 0) || (comment.kids && !childComments[comment.id] && treeLevel === 0)) {
            return (
                <Fragment key={comment.id}>
                    <Separator/>
                    <CommentItem
                        comment={comment}
                        openChildComments={openChildComments}
                        closeChildComments={closeChildComments}
                        isChildCommentsOpen={childComments[comment.id] && childComments[comment.id].length !== 0}
                    />
                </Fragment>
            )
        }
        else if ((!comment.kids && treeLevel > 0) || (comment.kids && !childComments[comment.id] && treeLevel > 0)) {
            return (
                <li key={comment.id}>
                    <Separator/>
                    <CommentItem
                        comment={comment}
                        openChildComments={openChildComments}
                        closeChildComments={closeChildComments}
                        isChildCommentsOpen={childComments[comment.id] && childComments[comment.id].length !== 0}
                    />
                </li>
            )
        } else if (comment.kids && childComments[comment.id]) {
            let childCommentsId: Comment[] = childComments[comment.id]
            return (
                <Fragment key={comment.id}>
                    <Separator/>
                    <CommentItem
                        comment={comment}
                        openChildComments={openChildComments}
                        closeChildComments={closeChildComments}
                        isChildCommentsOpen={childComments[comment.id] && childComments[comment.id].length !== 0}
                    />
                    <ul>
                        {childCommentsId.map(childComment => {
                            return displayCommentsTree(childComment, treeLevel + 1)
                        })}
                    </ul>
                </Fragment>
            )
        }
    },[childComments])


    const openChildComments = async (parentId: number, childCommentsId: number[]) => {
        let fetchedComments: Comment[] = []
        for(let i = 0; i < childCommentsId.length; i++) {
            let res = (await fetchCommentById(childCommentsId[i])).data
            if (res !== undefined && isComment(res)) {
                fetchedComments.push(res)
            }
        }
        setChildComments({
            ...childComments,
            [parentId]: fetchedComments
        })
    }

    const closeChildComments = (parentId: number) => {
        setChildComments({
            ...childComments,
            [parentId]: []
        })
    }

    return (
        <Group
            mode="plain"
            className={styles.commentList}
        >
            {
                comments.map((comment => displayCommentsTree(comment)))
            }
        </Group>
    );
};
