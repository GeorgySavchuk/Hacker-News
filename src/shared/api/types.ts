export interface Story {
    id: number;
    type: "story";
    by: string;
    time: number;
    url?: string;
    score: number;
    title: string;
    text?: string;
    kids?: number[];
    descendants: number;
}

export interface Comment {
    id: number;
    type: "comment";
    by: string;
    parent: number;
    text: string;
    time: number;
    kids?: number[];
    deleted?:boolean;
}