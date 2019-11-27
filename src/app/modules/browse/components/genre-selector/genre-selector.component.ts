import { Component, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { MatChipList, MatChipListChange } from '@angular/material';
import { GenresService } from 'src/app/core/services/genres.service';

@Component({
  selector: 'app-genre-selector',
  templateUrl: './genre-selector.component.html',
  styleUrls: ['./genre-selector.component.scss']
})
export class GenreSelectorComponent {

  genresList: Observable<Genre[]>;
  @Input() selectedGenres: Genre[] = [];
  @Output() selectedGenresChange: EventEmitter<Genre[]> = new EventEmitter();
  @Output() selectedChange: EventEmitter<void> = new EventEmitter();

  @ViewChild('selGenre') genreSelector: MatChipList;

  constructor(
    private genres: GenresService
  ) {
    this.genresList = this.genres.get();
  }

  toggleGenre(genre: Genre) {
    const i = this.genreComparisonIndex(genre);
    if (i >= 0) {
      this.selectedGenres.splice(i, 1);
    } else {
      this.selectedGenres.push(genre);
    }
    this.genreSelector.writeValue(this.selectedGenres);
    this.doChange();
  }

  genreSelected(genre: Genre) {
    return this.genreComparisonIndex(genre) > -1;
  }

  private genreComparisonIndex(genre: Genre) {
    for (let i = 0; i < this.selectedGenres.length; i++) {
      if  (this.selectedGenres[i].name.toLowerCase() === genre.name.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }
  compareGenres(genre1: Genre, genre2: Genre): boolean {
    return genre1.name.toLowerCase() === genre2.name.toLowerCase();
  }

  doChange(e?: MatChipListChange) {
    this.selectedGenresChange.emit(this.selectedGenres);
    this.selectedChange.emit();
  }
}
