import * as dayjs from "dayjs";


export const getPublicationDate = (date: number): string => {
    return dayjs.unix(date).format('MMMM DD, YYYY HH:mm')
}