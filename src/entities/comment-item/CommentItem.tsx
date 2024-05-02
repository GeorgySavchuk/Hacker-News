import {Avatar, InfoRow, Link, SimpleCell} from "@vkontakte/vkui";
import {FC, useEffect, useRef, useState} from "react";
import styles from './styles.module.css'
import {Comment} from "../../shared/api/types.ts";
import {Icon24User} from "@vkontakte/icons";

interface CommentItemProps {
    comment: Comment;
    openChildComments: (parentId: number, childCommentsId: number[]) => void;
    closeChildComments: (parentId: number) => void;
    isChildCommentsOpen: boolean;
}

export const CommentItem: FC<CommentItemProps> =
    ({
         comment,
         openChildComments,
         isChildCommentsOpen,
         closeChildComments
     }) => {
        let commentTextRef = useRef<HTMLDivElement>(null)
        let [isChildCommentsLoading, setIsChildCommentsLoading] = useState<boolean>(false)
        useEffect(() => {
            if (commentTextRef.current) {
                commentTextRef.current.innerHTML += comment.text
            }
        }, []);

        const showChildComments = async () => {
            setIsChildCommentsLoading(true)
            await openChildComments(comment.id, comment.kids as number[])
            setIsChildCommentsLoading(false)
        }

        const hideChildComments = () => {
            closeChildComments(comment.id)
        }

        return (
            comment.deleted
                ? <SimpleCell multiline className={styles.commentLayout} before={<Avatar size={38} fallbackIcon={<Icon24User/>}/>}>
                    <InfoRow header={'user'} className={styles.commentContent}>Comment has been deleted</InfoRow>
                </SimpleCell>
                : <SimpleCell multiline className={styles.commentLayout} before={<Avatar size={38} initials={comment.by[0]}/>}>
                    <InfoRow header={comment.by} getRootRef={commentTextRef} className={styles.commentContent}></InfoRow>
                    {comment.kids && <Link onClick={!isChildCommentsOpen ? showChildComments : hideChildComments}>
                        {isChildCommentsLoading
                            ? 'Loading...'
                            : isChildCommentsOpen
                                ? 'Hide responses'
                                : 'Show responses'
                        }
                    </Link>}
                </SimpleCell>
        );
    };
