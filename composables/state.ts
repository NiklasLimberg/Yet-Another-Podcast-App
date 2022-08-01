import { Episode } from "~types/Episode";

export const usePlayingEpisode = () => useState<Episode|undefined>('playingEpisode', undefined)