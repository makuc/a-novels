// novel.model.ts

export default class Novel {
    Title: string;
    Author: string;
    Cover: string;

    Description: string;
    Tags: string[];

    DateCreated: string;
    NFavorites: number;

    NRatings: number;
    StoryRating: number;
    StyleRating: number;
    CharsRating: number;
    WorldRating: number;
    GrammRating: number;

    constructor(
        title: string,
        author: string,
        cover: string,
        description: string,
        tags: string[],
        dateCreated: string,
        nFavorites: number,
        nRatings: number,
        storyRating: number,
        styleRating: number,
        charsRating: number,
        worldRating: number,
        grammRating: number
    ) {
        this.Title = title;
        this.Author = author;
        this.Cover = cover;

        this.Description = description;
        this.Tags = tags;

        this.DateCreated = dateCreated;
        this.NFavorites = nFavorites;

        this.NRatings = nRatings;
        this.StoryRating = storyRating;
        this.StyleRating = styleRating;
        this.CharsRating = charsRating;
        this.WorldRating = worldRating;
        this.GrammRating = grammRating;
    }
}
