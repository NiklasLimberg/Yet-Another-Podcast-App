export interface Episode {
    id: string
    title: string
    seriesId: string
    seriesTitle: string
    descriptionHTML: string
    pubDate: string
    enclosure: string
    image: string
    link: string
    duration: number
    lastPlayed?: string
    progress: number
    created: Date
    updated: Date
  }
  