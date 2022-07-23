import { Episode } from '~types/Episode'
import db from  '../prisma-db'

import { castToNumber, castToString } from '../validators'


function queryEpisodes(cursor: string | false, limit : number) {
    if(!cursor) {    
        return db.episode.findMany({
            orderBy: { pubDate: 'desc' },
            take: limit,
            include: {
                series: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },           
        })
    }
    
    return db.episode.findMany({ 
        orderBy: { pubDate: 'desc' },
        cursor: {
            id: cursor
        },
        skip: 1,
        take: limit,
        include: {
            series: {
                select: {
                    id: true,
                    title: true
                }
            }
        },
    })
}

export default defineEventHandler(async (event): Promise<Episode[]> => {
    const { cursor: cursorRaw, limit: limitRaw } = useQuery(event.req);

    const limit = castToNumber(limitRaw, 25);
    const cursor = castToString(cursorRaw, false);

    const episodes = await queryEpisodes(cursor, limit);

    return episodes.map(episode => {
        return {
            id: episode.id,
            title: episode.title,
            seriesId: episode.series.id,
            seriesTitle: episode.series.title,
            descriptionHTML: episode.descriptionHTML,
            pubDate: episode.pubDate,
            enclosure: episode.enclosure,
            image: episode.image,
            link: episode.link,
            duration: episode.duration,
            lastPlayed: undefined,
            progress: undefined,
            created: episode.created,
            updated: episode.updated
        }
    })
}) 