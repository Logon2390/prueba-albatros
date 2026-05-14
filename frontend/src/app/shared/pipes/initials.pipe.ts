import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength = 2): string {
    if (!value?.trim()) return '?';

    return value
      .trim()
      .split(/\s+/) // separa por uno o más espacios
      .filter(Boolean) // elimina strings vacíos
      .slice(0, maxLength) // toma los primeros N palabras
      .map((word) => word[0]) // toma la primera letra de cada palabra
      .join('')
      .toUpperCase();
  }
}
