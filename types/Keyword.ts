import zod from 'zod';

export const keywordOutput = zod.object({
    id: zod.string(),
    name: zod.string(),
    created: zod.date(),
})

export type Keyword = zod.infer<typeof keywordOutput>;