import db from  '../prisma-db'

import { castToNumber, castToString } from '../validators'

export default defineEventHandler(async event => {
    const { cursor: cursorRaw, limit: limitRaw } = useQuery(event.req)

    const limit = castToNumber(limitRaw, 25);
    const cursor = castToString(cursorRaw);

    if(!cursor) {    
        return db.episode.findMany({ 
            orderBy: { updated: 'desc' },
            take: limit
        })
    }
    
    return db.episode.findMany({ 
        orderBy: { updated: 'desc' },
        cursor: {
            id: cursor
        },
        skip: 1,
        take: limit
    })
}) 
  