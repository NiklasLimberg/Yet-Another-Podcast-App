export interface Episode {
    id: string
    title: string
    seriesId: string
    seriesTitle: string
    descriptionHTML: string
    pubDate: Date
    enclosure: string
    image: string
    link: string
    duration: number
    lastPlayed?: Date
    progress: number
    created: Date
    updated: Date
  }
  